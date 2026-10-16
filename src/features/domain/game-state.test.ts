import { describe, expect, it } from 'vitest';
import { puzzles } from '../data/puzzles';
import { createInitialGameState, selectCell, toggleCellMark } from './game-state';

const puzzle = puzzles[0];

if (!puzzle) {
    throw new Error('Test puzzle is missing');
}

describe('createInitialGameState', () => {
    it('starts with three lives and no selections', () => {
        const state = createInitialGameState(puzzle);

        expect(state.lives).toBe(3);
        expect(state.foundChimos).toEqual([]);
        expect(state.selectedEmptyCells).toEqual([]);
        expect(state.markedCells).toEqual([]);
        expect(state.status).toBe('playing');
    });
});

describe('selecteCell', () => {
    it('reveals a Chimo whithout losing a life', () => {
        const state = createInitialGameState(puzzle);
        const nextState = selectCell(state, '0-1');

        expect(nextState.foundChimos).toContain('0-1');
        expect(nextState.lives).toBe(3);
        expect(nextState.status).toBe('playing');
    });

    it('does not count a revealed Chimo twice', () => {
        const state = createInitialGameState(puzzle);
        const firstSelection = selectCell(state, '0-1');
        const secondSelection = selectCell(firstSelection, '0-1');

        expect(secondSelection).toBe(firstSelection);
        expect(secondSelection.foundChimos).toHaveLength(1);
    });

    it('reveals an empty cell and loses a life', () => {
        const state = createInitialGameState(puzzle);
        const nextState = selectCell(state, '0-0');

        expect(nextState.selectedEmptyCells).toContain('0-0');
        expect(nextState.lives).toBe(2);
        expect(nextState.status).toBe('playing');
    });

    it('does not lose another life when selection a revealed cell', () => {
        const state = createInitialGameState(puzzle);
        const firstSelection = selectCell(state, '0-0');
        const secontSelection = selectCell(firstSelection, '0-0');

        expect(secontSelection).toBe(firstSelection);
        expect(secontSelection.lives).toBe(2);
    });

    it('removes a white mark when revealing a cell', () => {
        const state = createInitialGameState(puzzle);
        const markedState = toggleCellMark(state, '0-1');
        const revealedState = selectCell(markedState, '0-1');

        expect(revealedState.foundChimos).toContain('0-1');
        expect(revealedState.markedCells).not.toContain('0-1');
    });

    it('loses after three mistakes', () => {
        let state = createInitialGameState(puzzle);

        state = selectCell(state, '0-0');
        state = selectCell(state, '1-0');
        state = selectCell(state, '2-2');

        expect(state.lives).toBe(0);
        expect(state.status).toBe('lost');
        expect(state.selectedEmptyCells).toHaveLength(3);
    });

    it('wins after finding every Chimo', () => {
        let state = createInitialGameState(puzzle);

        for (const position of puzzle.solution) {
            const cell = puzzle.cells.find(
                (currentCell) =>
                    currentCell.position.row === position.row &&
                    currentCell.position.col === position.col,
            );

            if (!cell) {
                throw new Error('Solution cell is missing');
            }

            state = selectCell(state, cell.id);
        }

        expect(state.foundChimos).toHaveLength(puzzle.size);
        expect(state.status).toBe('won');
    });

    it('does not allow selections after the game ends', () => {
        let state = createInitialGameState(puzzle);

        state = selectCell(state, '0-0');
        state = selectCell(state, '1-0');
        state = selectCell(state, '2-2');

        const nextState = selectCell(state, '0-1');

        expect(nextState).toBe(state);
        expect(nextState.foundChimos).toEqual([]);
    });

    it('ignores nonexistent cells', () => {
        const state = createInitialGameState(puzzle);

        expect(selectCell(state, 'invalid-cell')).toBe(state);
    });
});

describe('toggleCellMark', () => {
    it('marks a hidden cell without losing a life', () => {
        const state = createInitialGameState(puzzle);
        const nextState = toggleCellMark(state, '0-0');

        expect(nextState.markedCells).toContain('0-0');
        expect(nextState.lives).toBe(3);
        expect(nextState.selectedEmptyCells).toEqual([]);
        expect(nextState.foundChimos).toEqual([]);
    });

    it('removes a white mark when marking the same cell again', () => {
        const state = createInitialGameState(puzzle);
        const markedState = toggleCellMark(state, '0-0');
        const nextState = toggleCellMark(markedState, '0-0');

        expect(nextState.markedCells).not.toContain('0-0');
        expect(nextState.lives).toBe(3);
    });

    it('does not mark a revealed cell', () => {
        const state = createInitialGameState(puzzle);
        const revealedState = selectCell(state, '0-0');
        const nextState = toggleCellMark(revealedState, '0-0');

        expect(nextState).toBe(revealedState);
        expect(nextState.markedCells).not.toContain('0-0');
    });

    it('does not change state after the game ends', () => {
        let state = createInitialGameState(puzzle);

        state = selectCell(state, '0-0');
        state = selectCell(state, '1-0');
        state = selectCell(state, '2-2');

        const nextState = toggleCellMark(state, '0-1');

        expect(nextState).toBe(state);
    });

    it('ignores nonexistent cells', () => {
        const state = createInitialGameState(puzzle);

        expect(toggleCellMark(state, 'invalid-cell')).toBe(state);
    });
});
