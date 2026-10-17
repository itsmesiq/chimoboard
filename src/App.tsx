import { GameBoard } from './features/components/GameBoard';
import { LivesIndicator } from './features/components/LivesIndicator';
import { puzzles } from './features/data/puzzles';
import { useGame } from './features/hooks/useGame';

export default function App() {
    const puzzle = puzzles[0];
    const { state, revealCell, toggleMark, resetGame } = useGame(puzzle);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-foreground">
            <div className="flex h-[640px] w-[416px] flex-col items-center justify-between rounded-lg bg-surface p-6">
                <h1 className="text-2xl font-semibold">ChimoBoard</h1>

                <div className="w-full max-w-sm">
                    <GameBoard
                        puzzle={puzzle}
                        gameState={state}
                        onReveal={revealCell}
                        onToggleMark={toggleMark}
                    />
                </div>

                <LivesIndicator lives={state.lives} />

                {state.status !== 'playing' && (
                    <p role="status">{state.status === 'won' ? 'Você venceu!' : 'Fim de jogo!'}</p>
                )}

                <button
                    type="button"
                    className="rounded-md border border-stroke px-4 py-2"
                    onClick={resetGame}
                >
                    Reiniciar partida
                </button>
            </div>
        </main>
    );
}
