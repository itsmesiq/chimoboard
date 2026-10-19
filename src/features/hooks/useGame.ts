import { useCallback, useState } from 'react';

import type { Puzzle } from '../domain/game.types';
import { createInitialGameState, selectCell, toggleCellMark } from '../domain/game-state';

export function useGame(createPuzzle: () => Puzzle) {
    const [puzzle, setPuzzle] = useState<Puzzle>(() => createPuzzle());
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

    const replayGame = useCallback(() => {
        const nextPuzzle = createPuzzle();

        setPuzzle(nextPuzzle);
        setState(createInitialGameState(nextPuzzle));
    }, [createPuzzle]);

    return {
        puzzle,
        state,
        revealCell,
        toggleMark,
        resetGame,
        replayGame,
    };
}
