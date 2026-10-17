import { useState } from 'react';
import { GameCell } from './features/components/GameCell';

export default function App() {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isMarked, setIsMarked] = useState(false);

    function handleReveal(cellId: string) {
        console.log('Célula revelada:', cellId);
        setIsRevealed(true);
        setIsMarked(false);
    }

    function handleToggleMark(cellId: string) {
        console.log('Marcação alternada:', cellId);
        setIsMarked((current) => !current);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-foreground">
            <h1 className="text-2xl font-semibold">ChimoBoard</h1>

            <div className="grid w-20 grid-cols-1 gap-2">
                <GameCell
                    cellId="0-0"
                    regionColor="#09b4cd"
                    isRevealed={isRevealed}
                    isChimo={true}
                    isMarked={isMarked}
                    disabled={false}
                    onReveal={handleReveal}
                    onToggleMark={handleToggleMark}
                />
            </div>

            <p className="text-sm text-muted">Clique esquerdo: revelar · Clique direito: marcar</p>

            <button
                type="button"
                className="rounded-md border border-stroke px-4 py-2"
                onClick={() => {
                    setIsRevealed(false);
                    setIsMarked(false);
                }}
            >
                Reiniciar demonstração
            </button>
        </main>
    );
}
