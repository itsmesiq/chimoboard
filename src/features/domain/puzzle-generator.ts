import type { Position, Puzzle, Region } from './game.types';
import { findSolutions } from './puzzle-solver';
import { isValidSolution } from './validation';

const REGION_COLORS = [
    '#8EEB98',
    '#F3656A',
    '#69B9E2',
    '#FF9955',
    '#B954F5',
    '#F7A8D0',
    '#FFDF65',
    '#279C8F',
    '#A8BED5',
] as const;

type Random = () => number;

type FrontierCell = {
    cellIndex: number;
    regionIndex: number;
};

type BoundaryMove = {
    cellIndex: number;
    sourceRegion: number;
    targetRegion: number;
};

const MAX_SOLUTION_ATTEMPTS = 40;
const MAX_REGION_ATTEMPTS = 20;
const MAX_GUIDED_MUTATIONS = 100;

let puzzleSequence = 0;

function shuffle<T>(items: T[], random: Random): T[] {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function getCellIndex(position: Position, size: number): number {
    return position.row * size + position.col;
}

function getPosition(index: number, size: number): Position {
    return {
        row: Math.floor(index / size),
        col: index % size,
    };
}

function getNeighbors(position: Position, size: number): Position[] {
    const { row, col } = position;

    return [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 },
    ].filter(
        (neighbor) =>
            neighbor.row >= 0 && neighbor.row < size && neighbor.col >= 0 && neighbor.col < size,
    );
}

function areAdjacent(first: Position, second: Position): boolean {
    return (
        Math.abs(first.row - second.row) <= 1 &&
        Math.abs(first.col - second.col) <= 1 &&
        (first.row !== second.row || first.col !== second.col)
    );
}

function generateSolution(size: number, random: Random): Position[] {
    const solution: Position[] = [];
    const usedColumns = new Set<number>();

    function placeChimo(row: number): boolean {
        if (row === size) {
            return true;
        }

        const columns = shuffle(
            Array.from({ length: size }, (_, col) => col),
            random,
        );

        for (const col of columns) {
            if (usedColumns.has(col)) {
                continue;
            }

            const position = { row, col };

            if (solution.some((placed) => areAdjacent(position, placed))) {
                continue;
            }

            solution.push(position);
            usedColumns.add(col);

            if (placeChimo(row + 1)) {
                return true;
            }

            solution.pop();
            usedColumns.delete(col);
        }

        return false;
    }

    if (!placeChimo(0)) {
        throw new Error(
            `Não foi possível gerar uma solução válida para um tabuleiro ${size}x${size}.`,
        );
    }

    return solution;
}

function generateRegions(size: number, solution: Position[], random: Random): number[] {
    const regionByCell = Array<number>(size * size).fill(-1);
    const frontier: FrontierCell[] = [];

    function addFrontier(position: Position, regionIndex: number): void {
        for (const neighbor of getNeighbors(position, size)) {
            const cellIndex = getCellIndex(neighbor, size);

            if (regionByCell[cellIndex] === -1) {
                frontier.push({ cellIndex, regionIndex });
            }
        }
    }

    solution.forEach((position, regionIndex) => {
        regionByCell[getCellIndex(position, size)] = regionIndex;
    });

    solution.forEach((position, regionIndex) => {
        addFrontier(position, regionIndex);
    });

    let remaining = regionByCell.filter((region) => region === -1).length;

    while (remaining > 0) {
        if (frontier.length === 0) {
            throw new Error('Não foi possível preencher todas as regiões do tabuleiro.');
        }

        const frontierIndex = Math.floor(random() * frontier.length);
        const [candidate] = frontier.splice(frontierIndex, 1);

        if (!candidate || regionByCell[candidate.cellIndex] !== -1) {
            continue;
        }

        regionByCell[candidate.cellIndex] = candidate.regionIndex;
        remaining--;

        addFrontier(getPosition(candidate.cellIndex, size), candidate.regionIndex);
    }

    return regionByCell;
}

function isRegionConnected(regionByCell: number[], regionIndex: number, size: number): boolean {
    const cells: number[] = [];

    for (let index = 0; index < regionByCell.length; index++) {
        if (regionByCell[index] === regionIndex) {
            cells.push(index);
        }
    }

    if (cells.length === 0) {
        return false;
    }

    const visited = new Set<number>();
    const queue = [cells[0]];

    while (queue.length > 0) {
        const current = queue.shift();

        if (current === undefined || visited.has(current)) {
            continue;
        }

        visited.add(current);

        for (const neighbor of getNeighbors(getPosition(current, size), size)) {
            const neighborIndex = getCellIndex(neighbor, size);

            if (regionByCell[neighborIndex] === regionIndex && !visited.has(neighborIndex)) {
                queue.push(neighborIndex);
            }
        }
    }

    return visited.size === cells.length;
}

function areAllRegionsConnected(regionByCell: number[], size: number): boolean {
    for (let regionIndex = 0; regionIndex < size; regionIndex++) {
        if (!isRegionConnected(regionByCell, regionIndex, size)) {
            return false;
        }
    }

    return true;
}

function buildPuzzle(size: number, solution: Position[], regionByCell: number[]): Puzzle {
    const regions: Region[] = Array.from({ length: size }, (_, index) => ({
        id: `region-${index}`,
        color: REGION_COLORS[index],
    }));

    const cells = Array.from({ length: size * size }, (_, index) => {
        const regionIndex = regionByCell[index];

        if (regionIndex === undefined || regionIndex < 0) {
            throw new Error('O gerador produziu uma célula sem região.');
        }

        return {
            id: `${Math.floor(index / size)}-${index % size}`,
            position: getPosition(index, size),
            regionId: `region-${regionIndex}`,
        };
    });

    return {
        id: `generated-${++puzzleSequence}`,
        size,
        cells,
        regions,
        solution: solution.map((position) => ({ ...position })),
    };
}

function getSolutionCellIndexes(solution: Position[], size: number): Set<number> {
    return new Set(solution.map((position) => getCellIndex(position, size)));
}

function getGuidedBondaryMoves(
    size: number,
    intendedSolution: Position[],
    alternativeSolution: Position[],
    regionByCell: number[],
    random: Random,
): BoundaryMove[] {
    const intendedCells = getSolutionCellIndexes(intendedSolution, size);
    const alternativeCells = getSolutionCellIndexes(alternativeSolution, size);
    const moves: BoundaryMove[] = [];

    for (const cellIndex of alternativeCells) {
        if (intendedCells.has(cellIndex)) {
            continue;
        }

        const sourceRegion = regionByCell[cellIndex];

        if (sourceRegion === undefined || sourceRegion < 0) {
            continue;
        }

        const position = getPosition(cellIndex, size);
        const neighboringRegions = new Set<number>();

        for (const neighbor of getNeighbors(position, size)) {
            const neighborIndex = getCellIndex(neighbor, size);
            const targetRegion = regionByCell[neighborIndex];

            if (targetRegion !== undefined && targetRegion !== sourceRegion) {
                neighboringRegions.add(targetRegion);
            }
        }

        for (const targetRegion of neighboringRegions) {
            moves.push({
                cellIndex,
                sourceRegion,
                targetRegion,
            });
        }
    }

    return shuffle(moves, random);
}

function tryEliminateAlternative(
    size: number,
    intendedSolution: Position[],
    alternativeSolution: Position[],
    regionByCell: number[],
    random: Random,
): boolean {
    const moves = getGuidedBondaryMoves(
        size,
        intendedSolution,
        alternativeSolution,
        regionByCell,
        random,
    );

    for (const move of moves) {
        regionByCell[move.cellIndex] = move.targetRegion;

        const regionsConnected = areAllRegionsConnected(regionByCell, size);

        if (!regionsConnected) {
            regionByCell[move.cellIndex] = move.sourceRegion;
            continue;
        }

        const puzzle = buildPuzzle(size, intendedSolution, regionByCell);

        if (!isValidSolution(puzzle)) {
            regionByCell[move.cellIndex] = move.sourceRegion;
            continue;
        }

        const alternativeStillValid = findSolutions(puzzle, 2).some(
            (solution) =>
                solution.length === alternativeSolution.length &&
                solution.every(
                    (position, index) =>
                        position.row === alternativeSolution[index]?.row &&
                        position.col === alternativeSolution[index]?.col,
                ),
        );

        if (!alternativeStillValid) {
            return true;
        }

        regionByCell[move.cellIndex] = move.sourceRegion;
    }

    return false;
}

function getLayoutSignature(regionByCell: number[]): string {
    return regionByCell.join(',');
}

function generateUniqueRegions(
    size: number,
    intendedSolution: Position[],
    random: Random,
): number[] | null {
    for (let regionAttempt = 0; regionAttempt < MAX_REGION_ATTEMPTS; regionAttempt++) {
        const regionByCell = generateRegions(size, intendedSolution, random);

        if (!areAllRegionsConnected(regionByCell, size)) {
            continue;
        }

        const visitedLayouts = new Set<string>();
        visitedLayouts.add(getLayoutSignature(regionByCell));

        for (let mutation = 0; mutation < MAX_GUIDED_MUTATIONS; mutation++) {
            const puzzle = buildPuzzle(size, intendedSolution, regionByCell);

            if (!isValidSolution(puzzle)) {
                break;
            }

            const solutions = findSolutions(puzzle, 2);

            if (solutions.length === 1) {
                return [...regionByCell];
            }

            if (solutions.length === 0) {
                break;
            }

            const alternativeSolution = solutions[1];

            if (!alternativeSolution) {
                break;
            }

            const previousLayout = [...regionByCell];

            const changed = tryEliminateAlternative(
                size,
                intendedSolution,
                alternativeSolution,
                regionByCell,
                random,
            );

            if (!changed) {
                break;
            }

            const signature = getLayoutSignature(regionByCell);

            if (visitedLayouts.has(signature)) {
                regionByCell.splice(0, regionByCell.length, ...previousLayout);
                break;
            }

            visitedLayouts.add(signature);
        }
    }

    return null;
}

export function generatePuzzle(size = 9, random: Random = Math.random): Puzzle {
    if (!Number.isInteger(size) || size < 4 || size > REGION_COLORS.length) {
        throw new Error(
            `O tamanho do tabuleiro deve ser um inteiro entre 4 e ${REGION_COLORS.length}.`,
        );
    }

    for (let attempt = 0; attempt < MAX_SOLUTION_ATTEMPTS; attempt++) {
        const solution = generateSolution(size, random);

        const regionByCell = generateUniqueRegions(size, solution, random);

        if (!regionByCell) {
            continue;
        }

        const puzzle = buildPuzzle(size, solution, regionByCell);

        if (isValidSolution(puzzle) && findSolutions(puzzle, 2).length === 1) {
            return puzzle;
        }
    }

    throw new Error(
        `Não foi possivel gerar um puzzle com solução única após ${MAX_SOLUTION_ATTEMPTS} soluções iniciais, ${MAX_REGION_ATTEMPTS} distribuições de regiões e ${MAX_GUIDED_MUTATIONS} mutações guiadas por distribuição.`,
    );
}
