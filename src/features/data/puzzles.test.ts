import { describe, expect, it } from 'vitest';
import { isValidSolution } from '../domain/validation';
import { puzzles } from './puzzles';

describe('puzzles', () => {
    it('contains at least one puzzle', () => {
        expect(puzzles.length).toBeGreaterThan(0);
    });

    it('contains puzzles with valid solutions', () => {
        for (const puzzle of puzzles) {
            expect(isValidSolution(puzzle)).toBe(true);
        }
    });

    it('contains unique puzzle IDs', () => {
        const ids = puzzles.map((puzzle) => puzzle.id);

        expect(new Set(ids).size).toBe(ids.length);
    });
});
