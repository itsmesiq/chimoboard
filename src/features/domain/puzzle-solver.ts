import type { Position, Puzzle } from './game.types';

function getPositionKey(position: Position): string {
    return `${position.row},${position.col}`;
}

function getCellsByPosition(puzzle: Puzzle) {
    const { size, cells, regions } = puzzle;

    if (
        !Number.isInteger(size) ||
        size <= 0 ||
        cells.length !== size * size ||
        regions.length !== size
    ) {
        return null;
    }

    const regionIds = new Set(regions.map((region) => region.id));

    if (regionIds.size !== size) {
        return null;
    }

    const cellsByPosition = new Map(cells.map((cell) => [getPositionKey(cell.position), cell]));

    if (cellsByPosition.size !== size * size) {
        return null;
    }

    for (const cell of cells) {
        const { row, col } = cell.position;

        if (
            !Number.isInteger(row) ||
            !Number.isInteger(col) ||
            row < 0 ||
            row >= size ||
            col < 0 ||
            col >= size ||
            !regionIds.has(cell.regionId)
        ) {
            return null;
        }
    }

    return cellsByPosition;
}

export function findSolutions(puzzle: Puzzle, limit = 2): Position[][] {
    if (!Number.isInteger(limit) || limit < 1) {
        return [];
    }

    const cellsByPosition = getCellsByPosition(puzzle);

    if (!cellsByPosition) {
        return [];
    }

    const { size } = puzzle;
    const usedColumns = new Set<number>();
    const usedRegions = new Set<string>();
    const solution: Position[] = [];
    const solutions: Position[][] = [];

    function search(row: number): void {
        if (solutions.length >= limit) {
            return;
        }

        if (row === size) {
            solutions.push(solution.map((position) => ({ ...position })));
            return;
        }

        for (let col = 0; col < size; col++) {
            if (usedColumns.has(col)) {
                continue;
            }

            const previous = solution[row - 1];

            if (previous && Math.abs(previous.col - col) <= 1) {
                continue;
            }

            const position = { row, col };
            const cell = cellsByPosition?.get(getPositionKey(position));

            if (!cell || usedRegions.has(cell.regionId)) {
                continue;
            }

            usedColumns.add(col);
            usedRegions.add(cell.regionId);
            solution.push(position);

            search(row + 1);

            solution.pop();
            usedColumns.delete(col);
            usedRegions.delete(cell.regionId);

            if (solutions.length >= limit) {
                return;
            }
        }
    }

    search(0);

    return solutions;
}

export function countSolutions(puzzle: Puzzle, limit = 2): number {
    return findSolutions(puzzle, limit).length;
}
