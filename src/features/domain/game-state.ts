import type { GameState, Puzzle } from './game.types';

const INITIAL_VILES = 3;

export function createInitialGameState(puzzle: Puzzle): GameState {
    return {
        puzzle,
        foundChimos: [],
        selectedEmptyCells: [],
        markedCells: [],
        lives: INITIAL_VILES,
        status: 'playing',
    };
}

export function selectCell(state: GameState, cellId: string): GameState {
    if (state.status !== 'playing') {
        return state;
    }

    const cell = state.puzzle.cells.find((currentCell) => currentCell.id === cellId);

    if (!cell) {
        return state;
    }

    const isAlreadyRevealed =
        state.foundChimos.includes(cellId) || state.selectedEmptyCells.includes(cellId);

    if (isAlreadyRevealed) {
        return state;
    }

    const isChimo = state.puzzle.solution.some(
        (position) => position.row === cell.position.row && position.col === cell.position.col,
    );

    const markedCells = state.markedCells.filter((markedCellId) => markedCellId !== cellId);

    if (isChimo) {
        const foundChimos = [...state.foundChimos, cellId];

        return {
            ...state,
            foundChimos,
            markedCells,
            status: foundChimos.length === state.puzzle.solution.length ? 'won' : 'playing',
        };
    }

    const lives = state.lives - 1;

    return {
        ...state,
        selectedEmptyCells: [...state.selectedEmptyCells, cellId],
        markedCells,
        lives,
        status: lives === 0 ? 'lost' : 'playing',
    };
}

export function toggleCellMark(state: GameState, cellId: string): GameState {
    if (state.status !== 'playing') {
        return state;
    }

    const cellExists = state.puzzle.cells.some((cell) => cell.id === cellId);

    if (!cellExists) {
        return state;
    }

    const isAlreadyRevealed =
        state.foundChimos.includes(cellId) || state.selectedEmptyCells.includes(cellId);

    if (isAlreadyRevealed) {
        return state;
    }

    const isMarked = state.markedCells.includes(cellId);

    return {
        ...state,
        markedCells: isMarked
            ? state.markedCells.filter((id) => id !== cellId)
            : [...state.markedCells, cellId],
    };
}
