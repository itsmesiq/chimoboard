// @vitest-environment jsdom

import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { puzzles } from '../data/puzzles';
import type { GameState } from '../domain/game.types';
import { createInitialGameState, selectCell, toggleCellMark } from '../domain/game-state';
import { GameBoard } from './GameBoard';

const puzzle = puzzles[0];

if (!puzzle) {
    throw new Error('O teste precisa de um puzzle válido.');
}

function createGameState(): GameState {
    return createInitialGameState(puzzle);
}

function renderBoard(gameState = createGameState()) {
    const props = {
        puzzle,
        gameState,
        onReveal: vi.fn(),
        onToggleMark: vi.fn(),
    };

    return {
        ...render(<GameBoard {...props} />),
        props,
    };
}

describe('GameBoard', () => {
    it('renders the board with the correct dimensions', () => {
        renderBoard();

        const board = screen.getByRole('group', {
            name: `Tabuleiro ${puzzle.size}x${puzzle.size}`,
        });

        expect(within(board).getAllByRole('button')).toHaveLength(puzzle.size * puzzle.size);
    });

    it('renders every cell with its accessible label', () => {
        renderBoard();

        expect(screen.getAllByRole('button', { name: 'Célula escondida' })).toHaveLength(
            puzzle.size * puzzle.size,
        );
    });

    it('passes the cell ID to onReveal when a cell is clicked', async () => {
        const user = userEvent.setup();
        const { props } = renderBoard();

        await user.click(screen.getAllByRole('button', { name: 'Célula escondida' })[0]);

        expect(props.onReveal).toHaveBeenCalledWith(puzzle.cells[0].id);
    });

    it('passes the cell ID to onToggleMark on right click', () => {
        const { props } = renderBoard();

        fireEvent.contextMenu(screen.getAllByRole('button', { name: 'Célula escondida' })[0]);

        expect(props.onToggleMark).toHaveBeenCalledWith(puzzle.cells[0].id);
        expect(props.onReveal).not.toHaveBeenCalled();
    });

    it('renders a found Chimo as revealed', () => {
        const cell = puzzle.cells.find((currentCell) =>
            puzzle.solution.some(
                (position) =>
                    position.row === currentCell.position.row &&
                    position.col === currentCell.position.col,
            ),
        );

        expect(cell).toBeDefined();

        if (!cell) return;

        const gameState = {
            ...createGameState(),
            ...selectCell(createGameState(), cell.id),
        };

        renderBoard(gameState);

        expect(screen.getByRole('button', { name: 'Chimo encontrado' })).toBeInTheDocument();
    });

    it('renders an empty revealed cell', () => {
        const cell = puzzle.cells.find(
            (currentCell) =>
                !puzzle.solution.some(
                    (position) =>
                        position.row === currentCell.position.row &&
                        position.col === currentCell.position.col,
                ),
        );

        if (!cell) {
            throw new Error('O puzzle precisa ter pelo menos uma célula vazia.');
        }

        const gameState = selectCell(createGameState(), cell.id);

        renderBoard(gameState);

        expect(screen.getByRole('button', { name: 'Célula vazia' })).toBeInTheDocument();
    });

    it('renders a marked cell', () => {
        const cell = puzzle.cells[0];
        const gameState = toggleCellMark(createGameState(), cell.id);

        renderBoard(gameState);

        expect(screen.getByRole('button', { name: 'Célula marcada' })).toBeInTheDocument();
    });

    it('disables cells when the game is over', () => {
        const gameState: GameState = {
            ...createGameState(),
            status: 'lost',
            lives: 0,
        };

        renderBoard(gameState);

        for (const button of screen.getAllByRole('button')) {
            expect(button).toBeDisabled();
        }
    });
});
