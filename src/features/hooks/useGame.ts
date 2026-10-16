import { useCallback, useState } from 'react';
import type { Puzzle } from '../domain/game.types';
import { createInitialGameState, selectCell, toggleCellMark } from '../domain/game-state';

export function useGame(puzzle: Puzzle) {
    const [state, setState] = useState(() => createInitialGameState(puzzle));

    const revealCell = useCallback((cellId: string) => {
        setState((currentState) => selectCell(currentState, cellId));
    }, []);

    const toggleMark = useCallback((cellId: string) => {
        setState((currentState) => toggleCellMark(currentState, cellId));
    }, []);

    const resetGame = useCallback(() => {
        setState(createInitialGameState(puzzle));
    }, [puzzle]);

    return {
        state,
        revealCell,
        toggleMark,
        resetGame,
    };
}
