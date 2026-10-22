import type { GameState, Puzzle } from '../domain/game.types';
import { GameCell } from './GameCell';

type GameBoardProps = {
    puzzle: Puzzle;
    gameState: GameState;
    onReveal: (cellId: string) => void;
    onToggleMark: (cellId: string) => void;
};

export function GameBoard({ puzzle, gameState, onReveal, onToggleMark }: GameBoardProps) {
    const regions = new Map(puzzle.regions.map((region) => [region.id, region]));

    return (
        <div
            role="group"
            aria-label={`Tabuleiro ${puzzle.size}x${puzzle.size}`}
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
        >
            {puzzle.cells.map((cell) => {
                const region = regions.get(cell.regionId);

                const isRevealed =
                    gameState.foundChimos.includes(cell.id) ||
                    gameState.selectedEmptyCells.includes(cell.id);

                const isChimo = gameState.foundChimos.includes(cell.id);
                const isMarked = gameState.markedCells.includes(cell.id);

                return (
                    <div key={cell.id}>
                        <GameCell
                            cellId={cell.id}
                            regionColor={region?.color ?? '#151719'}
                            isRevealed={isRevealed}
                            isChimo={isChimo}
                            isMarked={isMarked}
                            disabled={gameState.status !== 'playing'}
                            onReveal={onReveal}
                            onToggleMark={onToggleMark}
                        />
                    </div>
                );
            })}
        </div>
    );
}
