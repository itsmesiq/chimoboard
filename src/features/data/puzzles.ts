import type { Puzzle } from '../domain/game.types';

const firstPuzzle: Puzzle = {
    id: 'puzzle-001',
    size: 4,
    regions: [
        { id: 'region-0', color: '#09b4cd' },
        { id: 'region-1', color: '#cce045' },
        { id: 'region-2', color: '#9b7bea' },
        { id: 'region-3', color: '#f08b62' },
    ],
    cells: Array.from({ length: 16 }, (_, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;

        return {
            id: `${row}-${col}`,
            position: { row, col },
            regionId: `region-${col}`,
        };
    }),
    solution: [
        { row: 0, col: 1 },
        { row: 1, col: 3 },
        { row: 2, col: 0 },
        { row: 3, col: 2 },
    ],
};

export const puzzles: Puzzle[] = [firstPuzzle];
