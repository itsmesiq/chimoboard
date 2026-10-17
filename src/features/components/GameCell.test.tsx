// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GameCell } from './GameCell';

function renderCell(overrides: Partial<React.ComponentProps<typeof GameCell>> = {}) {
    const props = {
        cellId: '0-0',
        regionColor: '#09b4cd',
        isRevealed: false,
        isChimo: false,
        isMarked: false,
        disabled: false,
        onReveal: vi.fn(),
        onToggleMark: vi.fn(),
        ...overrides,
    };

    return {
        ...render(<GameCell {...props} />),
        props,
    };
}

describe('GameCell', () => {
    it('renders a hidden cell', () => {
        renderCell();

        expect(screen.getByRole('button', { name: 'Célula escondida' })).toBeInTheDocument();
    });

    it('reveals the cell on left click', async () => {
        const user = userEvent.setup();
        const { props } = renderCell();

        await user.click(screen.getByRole('button'));

        expect(props.onReveal).toHaveBeenCalledWith('0-0');
    });

    it('marks the cell on right click without revealing it', () => {
        const { props } = renderCell();

        fireEvent.contextMenu(screen.getByRole('button'));

        expect(props.onToggleMark).toHaveBeenCalledWith('0-0');
        expect(props.onReveal).not.toHaveBeenCalled();
    });

    it('does not reveal an already revealed cell', async () => {
        const user = userEvent.setup();
        const { props } = renderCell({ isRevealed: true, isChimo: true });

        await user.click(screen.getByRole('button'));

        expect(props.onReveal).not.toHaveBeenCalled();
    });

    it('does not mark an already revealed cell', () => {
        const { props } = renderCell({ isRevealed: true });

        fireEvent.contextMenu(screen.getByRole('button'));

        expect(props.onToggleMark).not.toHaveBeenCalled();
    });

    it('does nothing when disabled', async () => {
        const user = userEvent.setup();
        const { props } = renderCell({ disabled: true });

        await user.click(screen.getByRole('button'));

        expect(props.onReveal).not.toHaveBeenCalled();
    });

    it('shows a white X for a marked hidden cell', () => {
        renderCell({ isMarked: true });

        expect(screen.getByRole('button', { name: 'Célula marcada' })).toBeInTheDocument();
    });
});
