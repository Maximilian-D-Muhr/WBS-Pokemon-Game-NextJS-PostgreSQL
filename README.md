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
| Zod | 4.x | Runtime Validation |
| Neon | - | PostgreSQL Database |

## Security Features

This project implements advanced security measures to protect against common web attacks:

### Honeypot System ("Hall of Shame")

A proactive security concept that detects and logs malicious activity:

| Protection | Method |
|------------|--------|
| SQL Injection | Parameterized queries + pattern detection |
| XSS Attacks | React auto-escaping + input sanitization |
| Score Manipulation | Server-side validation (max score limits) |
| Type Injection | Zod schema validation |
| Overflow Attacks | Negative number detection |

**How it works:** Instead of simply blocking attacks, suspicious submissions are logged to a public "Hall of Shame" table while returning fake success responses. This honeypot approach catches attackers who believe their exploit worked.

> *Advanced security architecture and honeypot implementation concept by Max and Waqar. Implementation realized and end-to-end testing co-authored and validated by Claude Opus 4.5.*

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
├── app/
│   ├── arena/[id]/         # Arena detail pages
│   ├── pokemon/[id]/       # Pokemon detail pages
│   ├── battle/             # Battle system
│   ├── roster/             # Team management
│   ├── leaderboard/        # Scores + Hall of Shame
│   ├── components/         # Reusable UI components
│   ├── lib/                # Server actions & utilities
│   └── sql/                # Database schemas
├── public/
│   └── arenas/             # Arena background images
└── package.json
```

## Team

- Max
- Waqar

## Links

- [Project Slides](https://docs.google.com/presentation/d/1mGGo_gcygBrztvbtGtoTf1nXKqowG1OyjEdDCMvaQKI/edit?usp=sharing)
- [Next.js Docs](https://nextjs.org/docs)
- [PokeAPI](https://pokeapi.co/)
- [Tailwind CSS](https://tailwindcss.com/docs)
