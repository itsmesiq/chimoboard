import type { MouseEvent } from 'react';

import cellErrorImage from '../../assets/cell-error.svg';
import cellMarkImage from '../../assets/cell-mark.svg';
import chimoImage from '../../assets/chimo.svg';

type GameCellProps = {
    cellId: string;
    regionColor: string;
    isRevealed: boolean;
    isChimo: boolean;
    isMarked: boolean;
    disabled: boolean;
    onReveal: (cellId: string) => void;
    onToggleMark: (cellId: string) => void;
};

export function GameCell({
    cellId,
    regionColor,
    isRevealed,
    isChimo,
    isMarked,
    disabled,
    onReveal,
    onToggleMark,
}: GameCellProps) {
    function handleClick() {
        if (disabled || isRevealed) return;

        onReveal(cellId);
    }

    function handleContextMenu(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (disabled || isRevealed) return;

        onToggleMark(cellId);
    }

    const label = isRevealed
        ? isChimo
            ? 'Chimo encontrado'
            : 'Célula vazia'
        : isMarked
          ? 'Célula marcada'
          : 'Célula escondida';

    return (
        <button
            type="button"
            aria-label={label}
            aria-pressed={isMarked}
            disabled={disabled}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-md border border-stroke transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default"
            style={{ backgroundColor: regionColor }}
        >
            {isRevealed && isChimo && (
                <img
                    src={chimoImage}
                    alt=""
                    aria-hidden="true"
                    className="h-[70%] w-[70%] object-contain drop-shadow-md drop-shadow-black/30"
                />
            )}

            {isRevealed && !isChimo && (
                <img
                    src={cellErrorImage}
                    alt=""
                    aria-hidden="true"
                    className="h-[45%] w-[45%] object-contain drop-shadow-md drop-shadow-black/30"
                />
            )}

            {!isRevealed && isMarked && (
                <img
                    src={cellMarkImage}
                    alt=""
                    aria-hidden="true"
                    className="h-[45%] w-[45%] object-contain drop-shadow-md drop-shadow-black/30"
                />
            )}
        </button>
    );
}
