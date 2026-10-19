import chimoHappy from '../../assets/happy-chimo.svg';
import chimoSad from '../../assets/sad-chimo.svg';

type GameResultProps = {
    status: 'won' | 'lost';
    onReplay: () => void;
    onReset: () => void;
};

export function GameResult({ status, onReplay, onReset }: GameResultProps) {
    const isVictory = status === 'won';

    return (
        <div className="flex w-full max-w-[280px] flex-col items-center gap-3 rounded-2xl border border-stroke bg-surface p-4 text-center shadow-2xl sm:gap-4 sm:p-6">
            {isVictory ? (
                <img src={chimoHappy} alt="Happy Chimo" />
            ) : (
                <img src={chimoSad} alt="Sad Chimo" />
            )}
            <h2 id="game-result-title" className="text-xl font-bold sm:text-2xl">
                {isVictory ? 'Parabéns!' : 'Que pena!'}
            </h2>
            <p className="text-sm text-foreground sm:text-base">
                {isVictory
                    ? 'Você encontrou todos os Chimos!'
                    : 'Suas vidas acabaram! Tente novamente.'}
            </p>

            {isVictory ? (
                <button
                    type="button"
                    onClick={onReplay}
                    className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:text-base"
                >
                    Novo Puzzle
                </button>
            ) : (
                <div className="flex w-full flex-col gap-3">
                    <button
                        type="button"
                        onClick={onReset}
                        className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:text-base"
                    >
                        Tentar Novamente
                    </button>
                    <button
                        type="button"
                        onClick={onReplay}
                        className="w-full cursor-pointer rounded-lg border border-foreground bg-transparent px-4 py-3 text-sm text-foreground transition-colors hover:bg-foreground/5 sm:text-base"
                    >
                        Novo Puzzle
                    </button>
                </div>
            )}
        </div>
    );
}
