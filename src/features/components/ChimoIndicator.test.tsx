// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { puzzles } from '../data/puzzles';
import { ChimoIndicator } from './ChimoIndicator';

const puzzle = puzzles[0];

if (!puzzle) {
    throw new Error('O teste precisa de um puzzle válido.');
}

describe('ChimoIndicator', () => {
    it('renders one silhouette for every region initially', () => {
        render(<ChimoIndicator puzzle={puzzle} foundChimos={[]} />);

        const indicator = screen.getByRole('group', {
            name: 'Progresso dos Chimos',
        });

        expect(within(indicator).getAllByTestId('chimo-silhouette')).toHaveLength(
            puzzle.regions.length,
        );

        expect(within(indicator).queryAllByTestId('chimo-color-dot')).toHaveLength(0);
    });

    it('reveals the found Chimo and its color dot', () => {
        const solutionPosition = puzzle.solution[0];

        if (!solutionPosition) {
            throw new Error('O teste precisa de uma solução válida.');
        }

        const foundCell = puzzle.cells.find(
            (cell) =>
                cell.position.row === solutionPosition.row &&
                cell.position.col === solutionPosition.col,
        );

        if (!foundCell) {
            throw new Error('A célula da solução não foi encontrada');
        }

        const foundRegionIndex = puzzle.regions.findIndex(
            (region) => region.id === foundCell.regionId,
        );

        render(<ChimoIndicator puzzle={puzzle} foundChimos={[foundCell.id]} />);

        const indicator = screen.getByRole('group', {
            name: 'Progresso dos Chimos',
        });

        expect(
            within(indicator).getByRole('img', {
                name: `Chimo da cor ${foundRegionIndex + 1}, encontrado`,
            }),
        );

        expect(within(indicator).getAllByTestId('chimo-silhouette')).toHaveLength(
            puzzle.regions.length - 1,
        );

        expect(within(indicator).getAllByTestId('chimo-color-dot')).toHaveLength(1);
    });
});
