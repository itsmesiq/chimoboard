import type { Puzzle } from '../domain/game.types';

const regionColors = {
    G: { id: 'region-green', color: '#8EEB98' },
    R: { id: 'region-red', color: '#F3656A' },
    B: { id: 'region-blue', color: '#69B9E2' },
    O: { id: 'region-orange', color: '#FF9955' },
    P: { id: 'region-purple', color: '#B954F5' },
    I: { id: 'region-pink', color: '#F7A8D0' },
    Y: { id: 'region-yellow', color: '#FFDF65' },
    T: { id: 'region-teal', color: '#279C8F' },
    S: { id: 'region-gray', color: '#A8BED5' },
} as const;

const regionLayout = [
    'G G G G G G G R R',
    'G R G R G G R R B',
    'R R R R R R R B B',
    'R O O R B B B B P',
    'O O O O O P P P P',
    'O I I I O O Y Y P',
    'O I O O O O Y P P',
    'O I T I O O O S P',
    'O I I I I O S S S',
];

const firstPuzzle: Puzzle = {
    id: 'puzzle-001',
    size: 9,
    regions: Object.values(regionColors).map(({ id, color }) => ({
        id,
        color,
    })),

    cells: regionLayout.flatMap((row, rowIndex) =>
        row.split(' ').map((regionCode, colIndex) => ({
            id: `${rowIndex}-${colIndex}`,
            position: {
                row: rowIndex,
                col: colIndex,
            },
            regionId: regionColors[regionCode as keyof typeof regionColors].id,
        })),
    ),
    solution: [
        { row: 0, col: 0 },
        { row: 1, col: 8 },
        { row: 2, col: 4 },
        { row: 3, col: 1 },
        { row: 4, col: 5 },
        { row: 5, col: 3 },
        { row: 6, col: 6 },
        { row: 7, col: 2 },
        { row: 8, col: 7 },
    ],
};

export const puzzles: Puzzle[] = [firstPuzzle];
