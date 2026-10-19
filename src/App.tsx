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

    const isEmbed = new URLSearchParams(window.location.search).get('mode') === 'embed';

    const gameMessage =
        state.status === 'won'
            ? 'Você encontrou todos os Chimos!'
            : state.status === 'lost'
              ? 'Suas vidas acabaram! Tente novamente.'
              : null;

    return (
        <main
            className={`min-h-screen bg-background text-foreground ${isEmbed ? 'p-2' : 'grid grid-cols-1 gap-8 px-5 py-6 sm:px-10 lg:h-dvh lg:min-h-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-6 lg:overflow-hidden lg:px-10 lg:py-8'}`}
        >
            {!isEmbed && (
                <header className="flex justify-center lg:col-start-1 lg:row-start-1">
                    <img
                        src="/logo-vertical.svg"
                        alt="Logo ChimoBoard"
                        aria-hidden="true"
                        className="mx-auto hidden h-full max-h-[180px] w-auto sm:block"
                    />
                    <img
                        src="/logo-horizontal.svg"
                        alt="Logo ChimoBoard"
                        aria-hidden="true"
                        className="mx-auto h-auto w-[80%] sm:hidden"
                    />
                </header>
            )}

            <section
                aria-label="Partida"
                className={`flex w-full flex-col items-center rounded-2xl border border-stroke bg-surface px-2 py-4 ${isEmbed ? 'gap-4' : 'gap-6 sm:px-6 sm:py-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:justify-center'}`}
            >
                <LivesIndicator lives={state.lives} />

                <div
                    className={`flex w-full min-w-0 flex-col gap-3 ${isEmbed ? '' : 'lg:mx-auto lg:max-h-full lg:max-w-[min(100%,calc((100dvh-240px)*0.9))]'}`}
                >
                    <ChimoIndicator puzzle={puzzle} foundChimos={state.foundChimos} />
                    <GameBoard
                        puzzle={puzzle}
                        gameState={state}
                        onReveal={revealCell}
                        onToggleMark={toggleMark}
                    />
                </div>

                {!isEmbed &&
                    (gameMessage ? (
                        <div>
                            <p>{gameMessage}</p>
                            <button
                                type="button"
                                onClick={resetGame}
                                className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-medium text-background transition-opacity hover:opacity-90"
                            >
                                Jogar Novamente
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={resetGame}
                            disabled={state.status !== 'playing'}
                            className="flex max-h-9 cursor-pointer items-center gap-2 rounded-full border border-foreground bg-transparent px-4 py-2 text-sm text-foreground transition-colors duration-500 ease-in-out hover:border-primary hover:bg-primary hover:text-foreground"
                        >
                            <RotateCcw className="size-4" />
                            <span>Reset</span>
                        </button>
                    ))}
            </section>

            {!isEmbed && (
                <aside className="flex flex-col gap-8 lg:col-start-1 lg:row-start-2 lg:min-h-0 lg:justify-start">
                    <GameInstructions />
                </aside>
            )}
        </main>
    );
}
