# WBS Pokemon Game

A Pokemon Battle Game built as a group project at WBS Coding School.

## Project Goal

Build an interactive Pokemon game with the following features:
- Browse and select Pokemon from the PokeAPI
- Build your own roster (team)
- Battle against random opponents
- Compare scores on the leaderboard

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | React Framework with App Router |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| Prisma | - | Database ORM (coming later) |
| Neon | - | PostgreSQL Database (coming later) |

## Local Setup

### Prerequisites
- Node.js 18+ installed
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Maximilian-D-Muhr/WBS-Pokemon-Game-NextJS-PostgreSQL
cd wbs-pokemon-game

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start development server with hot reload |
| Build | `npm run build` | Create production build |
| Start | `npm run start` | Start production server |
| Lint | `npm run lint` | Check code with ESLint |

## Project Structure

```
wbs-pokemon-game/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root Layout
│   ├── page.tsx            # Home Page
│   └── globals.css         # Global Styles
├── public/                 # Static Assets
├── lib/                    # Utility Functions (coming)
├── components/             # React Components (coming)
└── package.json            # Dependencies & Scripts
```

## Team

- Max
- Waqar

## Links

- [Project Slides](https://docs.google.com/presentation/d/1mGGo_gcygBrztvbtGtoTf1nXKqowG1OyjEdDCMvaQKI/edit?usp=sharing)
- [Next.js Docs](https://nextjs.org/docs)
- [PokeAPI](https://pokeapi.co/)
- [Tailwind CSS](https://tailwindcss.com/docs)

