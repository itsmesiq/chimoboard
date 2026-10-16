import type { Position, Puzzle } from './game.types';
import { areAdjacent } from './rules';

function getPositionKey(position: Position): string {
    return `${position.row},${position.col}`;
}

function isInsideBoard(position: Position, size: number): boolean {
    return position.row >= 0 && position.row < size && position.col >= 0 && position.col < size;
}

export function isValidSolution(puzzle: Puzzle): boolean {
    const { size, cells, regions, solution } = puzzle;

    if (
        size <= 0 ||
        !Number.isInteger(size) ||
        cells.length !== size * size ||
        regions.length !== size ||
        solution.length !== size
    ) {
        return false;
    }

    const regionIds = new Set(regions.map((region) => region.id));

    if (regionIds.size !== regions.length) {
        return false;
    }

    const cellsByPosition = new Map(cells.map((cell) => [getPositionKey(cell.position), cell]));

    if (cellsByPosition.size !== cells.length) {
        return false;
    }

    for (const cell of cells) {
        if (!isInsideBoard(cell.position, size) || !regionIds.has(cell.regionId)) {
            return false;
        }
    }

    const rows = new Set<number>();
    const columns = new Set<number>();
    const usedRegions = new Set<string>();

    for (let i = 0; i < solution.length; i++) {
        const position = solution[i];

        if (!isInsideBoard(position, size)) {
            return false;
        }

        const key = getPositionKey(position);
        const cell = cellsByPosition.get(key);

        if (!cell || rows.has(position.row) || columns.has(position.col)) {
            return false;
        }

        if (usedRegions.has(cell.regionId)) {
            return false;
        }

        rows.add(position.row);
        columns.add(position.col);
        usedRegions.add(cell.regionId);

        for (let j = 0; j < i; j++) {
            if (areAdjacent(position, solution[j])) {
                return false;
            }
        }
    }

    return rows.size === size && columns.size === size && usedRegions.size === regions.length;
}
