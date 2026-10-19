import { describe, expect, it } from 'vitest';

import { generatePuzzle } from './puzzle-generator';
import { isValidSolution } from './validation';

function getRegionCells(puzzle: ReturnType<typeof generatePuzzle>, regionId: string) {
    return puzzle.cells.filter((cell) => cell.regionId === regionId);
}

function isRegionConnected(puzzle: ReturnType<typeof generatePuzzle>, regionId: string): boolean {
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

describe('generatePuzzle', () => {
    it('generates puzzles with valid solutions', () => {
        for (let i = 0; i < 30; i++) {
            const puzzle = generatePuzzle();

            expect(isValidSolution(puzzle)).toBe(true);
        }
    });

    it('fills all cells and creates a reagion for each Chimo', () => {
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

    it('allows to generate smaller puzzles to test', () => {
        const puzzle = generatePuzzle(4);

        expect(puzzle.size).toBe(4);
        expect(isValidSolution(puzzle)).toBe(true);
    });
});
