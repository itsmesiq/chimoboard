import lifeFull from '../../assets/life-full.svg';
import lifeLost from '../../assets/life-lost.svg';

type LivesIndicatorProps = {
    lives: number;
};

const TOTAL_LIVES = 3;

export function LivesIndicator({ lives }: LivesIndicatorProps) {
    const remainingLives = Math.max(0, Math.min(TOTAL_LIVES, lives));

    return (
        <div className="flex items-center gap-2 py-2 px-3 bg-background rounded-full">
            {Array.from({ length: TOTAL_LIVES }, (_, index) => {
                const isAlive = index < remainingLives;

                return (
                    <div key={index} aria-hidden="true">
                        {isAlive ? (
                            <img src={lifeFull} alt="" aria-hidden="true" className="w-6 h-5" />
                        ) : (
                            <img src={lifeLost} alt="" aria-hidden="true" className="w-6 h-5" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
