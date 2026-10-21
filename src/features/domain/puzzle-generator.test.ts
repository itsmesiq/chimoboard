import { describe, expect, it } from 'vitest';

import { puzzles } from '../data/puzzles';
import type { Position, Puzzle } from './game.types';
import { generatePuzzle } from './puzzle-generator';
import { countSolutions, findSolutions } from './puzzle-solver';
import { isValidSolution } from './validation';

function getRegionCells(puzzle: Puzzle, regionId: string) {
    return puzzle.cells.filter((cell) => cell.regionId === regionId);
}

function isRegionConnected(puzzle: Puzzle, regionId: string): boolean {
    const cells = getRegionCells(puzzle, regionId);

    if (cells.length === 0) {
        return false;
    }

    const visited = new Set<string>();
    const queue = [cells[0]];

    while (queue.length > 0) {
        const current = queue.shift();

        if (!current || visited.has(current.id)) {
            continue;
        }

        visited.add(current.id);

        for (const neighbor of cells) {
            const rowDistance = Math.abs(current.position.row - neighbor.position.row);

            const colDistance = Math.abs(current.position.col - neighbor.position.col);

            if (rowDistance + colDistance === 1 && !visited.has(neighbor.id)) {
                queue.push(neighbor);
            }
        }
    }

    return visited.size === cells.length;
}

function createAmbiguousPuzzle(): Puzzle {
    const size = 4;

    const regions = Array.from({ length: size }, (_, col) => ({
        id: `region-${col}`,
        color: ['#8EEB98', '#F3656A', '#69B9E2', '#FF9955'][col],
    }));

    const cells = Array.from({ length: size * size }, (_, index) => {
        const row = Math.floor(index / size);
        const col = index % size;

        return {
            id: `${row}-${col}`,
            position: { row, col },
            regionId: `region-${col}`,
        };
    });

    const solution: Position[] = [
        { row: 0, col: 1 },
        { row: 1, col: 3 },
        { row: 2, col: 0 },
        { row: 3, col: 2 },
    ];

    return {
        id: 'ambiguous-test-puzzle',
        size,
        cells,
        regions,
        solution,
    };
}

describe('generatePuzzle', () => {
    it('generates puzzles with valid solutions', () => {
        for (let i = 0; i < 10; i++) {
            const puzzle = generatePuzzle();

            expect(isValidSolution(puzzle)).toBe(true);
        }
    });

    it('fills all cells and creates one reagion per Chimo', () => {
        const puzzle = generatePuzzle();

        expect(puzzle.cells).toHaveLength(puzzle.size * puzzle.size);
        expect(puzzle.regions).toHaveLength(puzzle.size);
        expect(puzzle.solution).toHaveLength(puzzle.size);

        for (const region of puzzle.regions) {
            const regionCells = getRegionCells(puzzle, region.id);

            const chimosInRegion = puzzle.solution.filter((position) =>
                regionCells.some(
                    (cell) =>
                        cell.position.row === position.row && cell.position.col === position.col,
                ),
            );

            expect(regionCells.length).toBeGreaterThan(0);
            expect(chimosInRegion).toHaveLength(1);
        }
    });

    it('generates connected regions', () => {
        const puzzle = generatePuzzle();

        for (const region of puzzle.regions) {
            expect(isRegionConnected(puzzle, region.id)).toBe(true);
        }
    });

    it('generates puzzles with different IDs', () => {
        const first = generatePuzzle();
        const second = generatePuzzle();

        expect(first.id).not.toBe(second.id);
    });

    it('rejects invalid puzzle sizes', () => {
        expect(() => generatePuzzle(3)).toThrow();
        expect(() => generatePuzzle(10)).toThrow();
        expect(() => generatePuzzle(4.5)).toThrow();
    });

    it('support smaller puzzles', () => {
        const puzzle = generatePuzzle(4);

        expect(puzzle.size).toBe(4);
        expect(isValidSolution(puzzle)).toBe(true);
        expect(countSolutions(puzzle, 2)).toBe(1);
    });

    it('generates puzzles with exactly one solution', () => {
        for (let i = 0; i < 10; i++) {
            const puzzle = generatePuzzle();

            expect(countSolutions(puzzle, 2)).toBe(1);
        }
    });

    it('stops counting solutions at the requested limit', () => {
        const puzzle = generatePuzzle(4);

        expect(countSolutions(puzzle, 1)).toBe(1);
    });
});

describe('puzzle solver', () => {
    it('finds multiple solutions in a deliberately ambiguous puzzle', () => {
        const puzzle = createAmbiguousPuzzle();

        const solutions = findSolutions(puzzle, 2);

        expect(isValidSolution(puzzle)).toBe(true);
        expect(solutions).toHaveLength(2);
        expect(countSolutions(puzzle, 2)).toBe(2);
    });

    it('returns exactly one solution for a generated puzzle', () => {
        const puzzle = generatePuzzle(4);

        expect(countSolutions(puzzle, 2)).toBe(1);
    });
});

describe('original puzzle data', () => {
    it('has exactly one valid solution', () => {
        const puzzle = puzzles[0];

        expect(isValidSolution(puzzle)).toBe(true);
        expect(countSolutions(puzzle, 2)).toBe(1);
    });

    it('returns the official solution for the original puzzle', () => {
        const puzzle = puzzles[0];
        const solutions = findSolutions(puzzle, 2);

        expect(solutions).toHaveLength(1);
        expect(solutions[0]).toEqual(puzzle.solution);
    });
});
