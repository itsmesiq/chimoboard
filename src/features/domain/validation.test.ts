import { describe, expect, it } from 'vitest';

import type { Puzzle } from './game.types';
import { isValidSolution } from './validation';

const validPuzzle: Puzzle = {
    id: 'test-puzzle',
    size: 4,
    cells: Array.from({ length: 16 }, (_, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;

        return {
            id: `${row}-${col}`,
            position: { row, col },
            regionId: `region-${col}`,
        };
    }),

    regions: Array.from({ length: 4 }, (_, index) => ({
        id: `region-${index}`,
        color: `color-${index}`,
    })),
    solution: [
        { row: 0, col: 1 },
        { row: 1, col: 3 },
        { row: 2, col: 0 },
        { row: 3, col: 2 },
    ],
};

describe('isValidSolution', () => {
    it('accepts a valid solution', () => {
        expect(isValidSolution(validPuzzle)).toBe(true);
    });

    it('rejects two Chimos in the same row', () => {
        const puzzle = {
            ...validPuzzle,
            solution: [
                { row: 0, col: 0 },
                { row: 0, col: 2 },
                { row: 2, col: 1 },
                { row: 3, col: 3 },
            ],
        };

        expect(isValidSolution(puzzle)).toBe(false);
    });

    it('rejects adjacent Chimos', () => {
        const puzzle = {
            ...validPuzzle,
            solution: [
                { row: 0, col: 0 },
                { row: 1, col: 1 },
                { row: 2, col: 3 },
                { row: 3, col: 0 },
            ],
        };

        expect(isValidSolution(puzzle)).toBe(false);
    });

    it('rejects two Chimos in the same region', () => {
        const puzzle = {
            ...validPuzzle,
            solution: [
                { row: 0, col: 0 },
                { row: 1, col: 2 },
                { row: 2, col: 1 },
                { row: 3, col: 3 },
            ],
        };

        expect(isValidSolution(puzzle)).toBe(false);
    });
});
