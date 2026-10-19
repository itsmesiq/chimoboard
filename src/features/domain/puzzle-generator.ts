import type { Position, Puzzle, Region } from './game.types';
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

let puzzleSequence = 0;

function shuffle<T>(items: T[], random: Random): T[] {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function areAdjacent(first: Position, second: Position): boolean {
    return (
        Math.abs(first.row - second.row) <= 1 &&
        Math.abs(first.col - second.col) <= 1 &&
        (first.row !== second.row || first.col !== second.col)
    );
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

    const getCellIndex = ({ row, col }: Position) => row * size + col;

    function addFrontier(position: Position, regionIndex: number) {
        for (const neighbor of getNeighbors(position, size)) {
            const cellIndex = getCellIndex(neighbor);

            if (regionByCell[cellIndex] === -1) {
                frontier.push({ cellIndex, regionIndex });
            }
        }
    }

    solution.forEach((position, regionIndex) => {
        regionByCell[getCellIndex(position)] = regionIndex;
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

        const position = {
            row: Math.floor(candidate.cellIndex / size),
            col: candidate.cellIndex % size,
        };

        addFrontier(position, candidate.regionIndex);
    }

    return regionByCell;
}

export function generatePuzzle(size = 9, random: Random = Math.random): Puzzle {
    if (!Number.isInteger(size) || size < 4 || size > REGION_COLORS.length) {
        throw new Error(
            `O tamanho do tabuleiro deve ser um inteiro entre 4 e ${REGION_COLORS.length}.`,
        );
    }

    const solution = generateSolution(size, random);
    const regionByCell = generateRegions(size, solution, random);

    const regions: Region[] = Array.from({ length: size }, (_, index) => ({
        id: `region-${index}`,
        color: REGION_COLORS[index],
    }));

    const cells = Array.from({ length: size * size }, (_, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        const regionIndex = regionByCell[index];

        if (regionIndex === undefined || regionIndex < 0) {
            throw new Error('O gerador produziu uma célula sem região.');
        }

        return {
            id: `${row}-${col}`,
            position: { row, col },
            regionId: `region-${regionIndex}`,
        };
    });

    const puzzle: Puzzle = {
        id: `generated-${++puzzleSequence}`,
        size,
        cells,
        regions,
        solution,
    };

    if (!isValidSolution(puzzle)) {
        throw new Error('O gerador produziu um puzzle inválido.');
    }

    return puzzle;
}
