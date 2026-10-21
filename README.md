# ChimoBoard 🐶

ChimoBoard is a logic puzzle game that combines elements of Sudoku and Minesweeper. Find every hidden Chimo by following the rules of rows, columns, and colored regions — without running out of lives.

![ChimoBoard gameplay preview](./docs/chimoboard-preview.png)

## How to Play

- Each row must contain exactly one Chimo.
- Each column must contain exactly one Chimo.
- Each colored region must contain exactly one Chimo.
- Chimos cannot occupy adjacent cells, including diagonals.
- **Left-click** a cell to reveal it.
- Finding a Chimo reveals its face. Revealing an empty cell costs one life.
- **Right-click** to mark or unmark a cell with a white X. Marks do not reveal cells or consume lives.
- You start with **3 lives**. Find every Chimo to win; lose all your lives and the game ends.

Revealed cells remain visible. After winning or losing, you can restart the game or play again with a new puzzle.

## Tech Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-%23252529.svg?style=for-the-badge&logo=vitest&logoColor=FCC72B)

## Technical Highlights

- Procedural puzzle generation with connected regions.
- Backtracking solver to validate puzzle uniqueness.
- Domain logic separated from UI components.
- Automated tests with Vitest and React Testing Library.

## Run Locally

```bash
git clone https://github.com/itsmesiq/chimoboard.git
cd chimoboard
pnpm install
pnpm dev
```
