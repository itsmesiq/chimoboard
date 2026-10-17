// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import lifeFull from '../../assets/life-full.svg';
import lifeLost from '../../assets/life-lost.svg';
import { LivesIndicator } from './LivesIndicator';

describe('LivesIndicator', () => {
    it('renders three hearts when all lives remain', () => {
        render(<LivesIndicator lives={3} />);

        expect(screen.getByRole('img', { name: '3 de 3 vidas restantes' })).toBeInTheDocument();

        const lives = screen
            .getByRole('img', { name: '3 de 3 vidas restantes' })
            .querySelectorAll('img');

        expect(lives).toHaveLength(3);
        expect(lives[0]).toHaveAttribute('src', lifeFull);
        expect(lives[1]).toHaveAttribute('src', lifeFull);
        expect(lives[2]).toHaveAttribute('src', lifeFull);
    });

    it('renders two full lives and one lost life', () => {
        render(<LivesIndicator lives={2} />);

        const lives = screen
            .getByRole('img', {
                name: '2 de 3 vidas restantes',
            })
            .querySelectorAll('img');

        expect(lives).toHaveLength(3);
        expect(lives[0]).toHaveAttribute('src', lifeFull);
        expect(lives[1]).toHaveAttribute('src', lifeFull);
        expect(lives[2]).toHaveAttribute('src', lifeLost);
    });

    it('renders one full life and two lost lives', () => {
        render(<LivesIndicator lives={1} />);

        const lives = screen
            .getByRole('img', {
                name: '1 de 3 vidas restantes',
            })
            .querySelectorAll('img');

        expect(lives).toHaveLength(3);
        expect(lives[0]).toHaveAttribute('src', lifeFull);
        expect(lives[1]).toHaveAttribute('src', lifeLost);
        expect(lives[2]).toHaveAttribute('src', lifeLost);
    });

    it('renders three lost lives when no lives remain', () => {
        render(<LivesIndicator lives={0} />);

        const lives = screen
            .getByRole('img', {
                name: '0 de 3 vidas restantes',
            })
            .querySelectorAll('img');

        expect(lives).toHaveLength(3);

        lives.forEach((life) => {
            expect(life).toHaveAttribute('src', lifeLost);
        });
    });

    it('clamps values above the maximum number of lives', () => {
        render(<LivesIndicator lives={5} />);

        expect(screen.getByRole('img', { name: '3 de 3 vidas restantes' })).toBeInTheDocument();

        const lives = screen
            .getByRole('img', { name: '3 de 3 vidas restantes' })
            .querySelectorAll('img');

        expect(lives).toHaveLength(3);
        lives.forEach((life) => {
            expect(life).toHaveAttribute('src', lifeFull);
        });
    });

    it('clamps negative values to zero', () => {
        render(<LivesIndicator lives={-1} />);

        expect(screen.getByRole('img', { name: '0 de 3 vidas restantes' })).toBeInTheDocument();

        const lives = screen
            .getByRole('img', { name: '0 de 3 vidas restantes' })
            .querySelectorAll('img');

        expect(lives).toHaveLength(3);

        lives.forEach((life) => {
            expect(life).toHaveAttribute('src', lifeLost);
        });
    });
});
