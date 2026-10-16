import { describe, expect, it } from 'vitest';
import { areAdjacent } from './rules';

describe('areAdjacent', () => {
    it('identifica células horizontalmente adjacentes', () => {
        expect(areAdjacent({ row: 2, col: 2 }, { row: 2, col: 3 })).toBe(true);
    });

    it('identifica células verticalmente adjacentes', () => {
        expect(areAdjacent({ row: 2, col: 2 }, { row: 3, col: 2 })).toBe(true);
    });

    it('identifica células diagonalmente adjacentes', () => {
        expect(areAdjacent({ row: 2, col: 2 }, { row: 3, col: 3 })).toBe(true);
    });

    it('rejeita células separadas por mais de uma posição', () => {
        expect(areAdjacent({ row: 0, col: 0 }, { row: 2, col: 2 })).toBe(false);
    });

    it('rejeita a mesma célula', () => {
        expect(areAdjacent({ row: 1, col: 1 }, { row: 1, col: 1 })).toBe(false);
    });
});
