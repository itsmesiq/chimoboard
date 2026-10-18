import { RotateCcw } from 'lucide-react';

import { ChimoIndicator } from './features/components/ChimoIndicator';
import { GameBoard } from './features/components/GameBoard';
import { GameInstructions } from './features/components/GameInstructions';
import { LivesIndicator } from './features/components/LivesIndicator';
import { puzzles } from './features/data/puzzles';
import { useGame } from './features/hooks/useGame';

export default function App() {
    const puzzle = puzzles[0];
    const { state, revealCell, toggleMark, resetGame } = useGame(puzzle);

    const gameMessage =
        state.status === 'won'
            ? 'Você encontrou todos os Chimos!'
            : state.status === 'lost'
              ? 'Suas vidas acabaram! Tente novamente.'
              : null;

    return (
        <main className="min-h-screen bg-background px-1.5 py-1.5 text-foreground sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 rounded-2xl border border-stroke bg-surface p-3 sm:gap-6 sm:p-6 lg:p-8">
                <header className="flex w-full items-center justify-between">
                    <LivesIndicator lives={state.lives} />
                    <img
                        src="/public/logo-vertical.svg"
                        alt="Logo ChimoBoard"
                        aria-hidden="true"
                        className="h-full max-h-[108px] w-auto"
                    />
                    <button
                        type="button"
                        onClick={resetGame}
                        disabled={state.status !== 'playing'}
                        className="flex max-h-9 cursor-pointer items-center gap-2 rounded-full border border-foreground bg-transparent px-4 py-2 text-sm text-foreground transition-colors duration-500 ease-in-out hover:border-primary hover:bg-primary hover:text-foreground"
                    >
                        <RotateCcw className="size-4" />
                        <span>Reset</span>
                    </button>
                </header>

                <section
                    aria-label="Partida"
                    className="flex w-full flex-col items-center gap-5 sm:gap-8"
                >
                    <div className="flex w-full max-w-[560px] flex-col gap-3">
                        <ChimoIndicator puzzle={puzzle} foundChimos={state.foundChimos} />

                        <GameBoard
                            puzzle={puzzle}
                            gameState={state}
                            onReveal={revealCell}
                            onToggleMark={toggleMark}
                        />
                    </div>
                </section>

                {gameMessage && (
                    <div
                        role="status"
                        className="flex w-full flex-col items-center gap-3 rounded-xl border border-stroke p-4 text-center"
                    >
                        <p className="font-medium">{gameMessage}</p>

                        <button
                            type="button"
                            onClick={resetGame}
                            className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-medium text-background transition-opacity hover:opacity-90"
                        >
                            Jogar Novamente
                        </button>
                    </div>
                )}

                <GameInstructions />
            </div>
        </main>
    );
}
