import chimoImage from '../../assets/chimo.svg';
import type { Puzzle } from '../domain/game.types';

type ChimoIndicatorProps = {
    puzzle: Puzzle;
    foundChimos: string[];
};

export function ChimoIndicator({ puzzle, foundChimos }: ChimoIndicatorProps) {
    const cellsById = new Map(puzzle.cells.map((cell) => [cell.id, cell]));

    const foundRegionsIds = new Set(
        foundChimos
            .map((cellId) => cellsById.get(cellId)?.regionId)
            .filter((regionId): regionId is string => Boolean(regionId)),
    );

    return (
        <div
            role="group"
            aria-label="Progresso dos Chimos"
            className="grid w-full grid-cols-9 items-center gap-2"
        >
            {puzzle.regions.map((region, index) => {
                const isFound = foundRegionsIds.has(region.id);

                return (
                    <div
                        key={region.id}
                        role="img"
                        aria-label={`Chimo da cor ${index + 1}, ${isFound ? 'encontrado' : 'não encontrado'}`}
                        className="relative flex items-center justify-center gap-2"
                    >
                        {isFound ? (
                            <>
                                <img
                                    src={chimoImage}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-auto w-full max-w-12 object-contain"
                                />
                                <span
                                    data-testid="chimo-color-dot"
                                    aria-hidden="true"
                                    className="absolute right-0 bottom-0 size-2.5 rounded-full"
                                    style={{ backgroundColor: region.color }}
                                ></span>
                            </>
                        ) : (
                            <span
                                data-testid="chimo-silhouette"
                                aria-hidden="true"
                                className="block aspect-[510/465] w-full max-w-12"
                                style={{
                                    backgroundColor: region.color,
                                    maskImage: `url(${chimoImage})`,
                                    WebkitMaskImage: `url(${chimoImage})`,
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                    WebkitMaskPosition: 'center',
                                    maskSize: 'contain',
                                    WebkitMaskSize: 'contain',
                                }}
                            ></span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
