import lifeFull from '../../assets/life-full.svg';
import lifeLost from '../../assets/life-lost.svg';

type LivesIndicatorProps = {
    lives: number;
};

const TOTAL_LIVES = 3;

export function LivesIndicator({ lives }: LivesIndicatorProps) {
    const remainingLives = Math.max(0, Math.min(TOTAL_LIVES, lives));

    return (
        <div
            role="img"
            aria-label={`${remainingLives} de ${TOTAL_LIVES} vidas restantes`}
            className="flex w-max items-center justify-center gap-2 rounded-full bg-background px-3 py-2"
        >
            {Array.from({ length: TOTAL_LIVES }, (_, index) => {
                const isAlive = index < remainingLives;

                return (
                    <div key={index} aria-hidden="true">
                        {isAlive ? (
                            <img src={lifeFull} alt="" aria-hidden="true" className="h-5 w-6" />
                        ) : (
                            <img src={lifeLost} alt="" aria-hidden="true" className="h-5 w-6" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
