import cellErrorImage from '../../assets/cell-error.svg';
import cellMarkImage from '../../assets/cell-mark.svg';
import chimoImage from '../../assets/chimo.svg';

const instructions = [
    {
        title: '1 Chimo por cor',
        description: 'Cada cor deve conter exatamente um Chimo.',
        type: 'region',
    },
    {
        title: '1 Chimo por linha e coluna',
        description: 'Cada linha e cada coluna deve conter exatamente um Chimo.',
        type: 'line',
    },
    {
        title: 'Chimos não podem se tocar',
        description: 'Chimos não podem ficar em células vizinhas, nem mesmo na diagonal.',
        type: 'adjacency',
    },
] as const;

function RuleExample({ type }: { type: (typeof instructions)[number]['type'] }) {
    return (
        <div
            aria-hidden="true"
            className="grid size-[44px] shrink-0 grid-cols-3 grid-rows-3 gap-0.5 sm:size-[76px]"
        >
            {Array.from({ length: 9 }, (_, index) => {
                const isChimo =
                    (type === 'region' && index === 4) ||
                    (type === 'line' && index === 1) ||
                    (type === 'adjacency' && index === 4);

                const isMarked =
                    (type === 'region' && index === 2) ||
                    (type === 'line' && [0, 2, 4, 7].includes(index)) ||
                    (type === 'adjacency' && index !== 4);

                const isColor = type === 'region' && [0, 1, 3, 6].includes(index);

                return (
                    <div
                        key={index}
                        className={`flex min-h-0 min-w-0 items-center justify-center rounded-[3px] ${
                            isChimo || isMarked || isColor ? 'bg-muted' : 'bg-muted/10'
                        }`}
                    >
                        {isChimo && (
                            <img src={chimoImage} alt="" className="size-[90%] object-contain" />
                        )}

                        {isMarked && (
                            <img
                                src={type === 'region' ? cellErrorImage : cellMarkImage}
                                alt=""
                                className="size-[80%] object-contain"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export function GameInstructions() {
    return (
        <section aria-labelledby="game-instructions-title" className="w-full">
            <h2
                id="game-instructions-title"
                className="mb-3 hidden text-sm font-semibold tracking-wide text-foreground sm:block"
            >
                Como Jogar
            </h2>
            <div className="flex gap-2 sm:grid sm:grid-cols-3 sm:gap-3">
                {instructions.map((instruction) => (
                    <article
                        key={instruction.type}
                        className="flex items-center gap-2 rounded-md border border-stroke p-1.5 sm:flex-col sm:items-start sm:gap-3 sm:p-4 lg:flex-row lg:items-center"
                    >
                        <div className="w-[44px] shrink-0 sm:w-full sm:max-w-[112px] lg:w-[76]">
                            <RuleExample type={instruction.type} />
                        </div>

                        <div className="min-w-0">
                            <h3
                                className={`text-[10px] text-foreground sm:text-sm ${instruction.type === 'region' ? 'w-10 sm:w-full' : ''}`}
                            >
                                {instruction.title}
                            </h3>
                            <p className="mt-1 hidden text-xs leading-relaxed text-muted sm:block">
                                {instruction.description}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
            <p className="mt-3 hidden text-xs leading-relaxed text-muted sm:block">
                Clique em uma célula para revelar seu conteúdo. Encontrar um Chimo não consome
                vidas; revelar uma célula vazia custa uma vida. Use o botão direito para marcar uma
                célula sem revelá-la. Você tem três vidas por partida.
            </p>
        </section>
    );
}
