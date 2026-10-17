import type { MouseEvent } from 'react';

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
            className="flex aspect-square w-full items-center justify-center rounded-md border border-stroke transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default"
            style={{ backgroundColor: isRevealed ? '#151719' : regionColor }}
        >
            {isRevealed && isChimo && (
                <span className="text-primary" aria-hidden="true">
                    🐶
                </span>
            )}

            {isRevealed && !isChimo && (
                <span className="text-red-400" aria-hidden="true">
                    X
                </span>
            )}

            {!isRevealed && isMarked && (
                <span className="text-white" aria-hidden="true">
                    X
                </span>
            )}
        </button>
    );
}
