# ♟️ ChessVerse Battlefield

> A polished, fully-playable local-multiplayer chess game built entirely in the browser — no server, no account, no downloads required.

🌐 **Live Demo:** [https://cheeseverse.netlify.app/](https://cheeseverse.netlify.app/)

---

## 📌 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [What It Solves](#-what-it-solves)
3. [Features](#-features)
4. [Architecture Diagram](#-architecture-diagram)
5. [Component Breakdown](#-component-breakdown)
6. [Chess Logic Deep Dive](#-chess-logic-deep-dive)
7. [Tech Stack](#-tech-stack)
8. [Project Structure](#-project-structure)
9. [Getting Started](#-getting-started)
10. [Available Scripts](#-available-scripts)
11. [Deployment](#-deployment)

---

## 🧩 Problem Statement

Chess is one of the most enduring strategy games in human history, yet most digital implementations either:

- **Require an account or online connection** to play with a friend sitting next to you.
- **Are cluttered with ads, social features, and paywalls** that get in the way of simply playing the game.
- **Lack visual clarity** — move hints, capture highlights, and turn indicators are often buried or missing entirely.
- **Are not easily embeddable or customizable** — most are closed-source black boxes.

There was a clear gap for a **lightweight, open, dependency-free chess experience** that works instantly in any modern browser and can be run locally or self-hosted.

---

## ✅ What It Solves

ChessVerse Battlefield provides:

| Problem | Solution |
|---|---|
| Needing an account to play chess with a friend | Fully local pass-and-play multiplayer — zero sign-up required |
| Cluttered chess UIs | Minimal, distraction-free interface focused on the board |
| No move feedback | Green dot overlays on valid destination squares; red highlight on captures |
| Opaque piece state | Selected piece is visually scaled and highlighted |
| No turn awareness | Prominent "Current Turn" indicator with animated badge |
| Sound feedback | Lightweight audio cues on piece selection and movement |
| Heavy external libraries | Chess rules implemented from scratch — no `chess.js` or similar runtime dependency |

---

## ✨ Features

- ♟️ **Full standard chess piece movement** — Pawn, Rook, Knight, Bishop, Queen, King
- 🟢 **Valid move highlighting** — animated green dots indicate legal destination squares
- 🔴 **Capture highlighting** — red overlay marks the captured square
- 🔵 **Selected piece scaling** — selected pieces scale up for clear visual feedback
- 🔔 **Toast notifications** — move and capture announcements appear in a non-blocking overlay
- 🔊 **Sound effects** — audio cues for selection (`select.mp3`) and movement (`move.mp3`)
- 🎨 **Dark/light aware theming** — Tailwind CSS custom design tokens
- 📱 **Responsive layout** — adapts to desktop and mobile viewports
- ⚡ **Blazing fast** — Vite + SWC compilation, no backend latency

---

## 🏗️ Architecture Diagram
'''

graph TD

    %% Global Styles
    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef logic fill:#f1f8e9,stroke:#33691e,stroke-width:2px;
    classDef userAction fill:#fff3e0,stroke:#e65100,stroke-width:2px,stroke-dasharray: 5 5;

    subgraph UI_Layer ["Frontend UI (React Components)"]
        App["App.tsx (Providers)"]
        Index["pages/Index"]
        Chessboard["Chessboard.tsx"]
        Squares["Square.tsx (x64)"]
        GameInfo["GameInfo.tsx"]
        
        App --> Index
        Index --> Chessboard
        Index --> GameInfo
        Chessboard --> Squares
    end

    subgraph State_Logic ["State & Logic Layer"]
        State[("React State<br/>- pieces Map<br/>- currentTurn<br/>- selectedSquare<br/>- validMoves")]
        Utils["chessLogic.ts<br/>- isValidMove()<br/>- getValidMoves()"]
        Toast["use-toast.ts<br/>- Notifications"]
    end

    %% Interaction Flow
    User((User)) -- "1. Clicks Square" --> Squares
    Squares -- "2. Trigger Click" --> Chessboard
    
    Chessboard -- "3. handleSquareClick(x, y)" --> Utils
    
    subgraph Decision_Node ["Logic Decision"]
        Utils --> ValidCheck{Is Piece Selected?}
        ValidCheck -- "No" --> GetMoves["getValidMoves()"]
        ValidCheck -- "Yes" --> MoveCheck["isValidMove()"]
    end

    GetMoves --> UpdateHints["4. setValidMoves(...)"]
    UpdateHints -.->|Re-render| Squares
    
    MoveCheck -- "Valid Move" --> UpdateState["5. Update pieces Map<br/>+ Flip Turn"]
    UpdateState --> State
    
    State -.->|6. Effect| Toast
    State -.->|7. Re-render| GameInfo
    State -.->|8. Re-render| Chessboard

    %% Styling
    class Chessboard,Squares,GameInfo component;
    class State,Utils,Toast logic;
    class User userAction;
   
'''
### Data Flow

```
User clicks a square
        │
        ▼
handleSquareClick(x, y)          ← Chessboard.tsx
        │
  ┌─────┴──────────────────┐
  │ No piece selected yet? │
  └─────┬──────────────────┘
        │ Yes — select piece
        ▼
getValidMoves(pos, piece, board) ← chessLogic.ts
        │
  setValidMoves([...])           ← triggers re-render with green hints
        │
  User clicks destination
        ▼
isValidMove(from, to, piece, board) ← chessLogic.ts
        │
  Update pieces Map + flip turn
        │
  Toast notification + sound
        │
  GameInfo re-renders with new turn
```

---

## 🧱 Component Breakdown

### `App.tsx`
The root component. Wraps the entire app in:
- **`QueryClientProvider`** — sets up TanStack Query for any future async data needs
- **`TooltipProvider`** — global Radix UI tooltip context
- **`BrowserRouter`** — client-side routing via React Router v6
- **`Toaster` / `Sonner`** — global toast notification systems

### `pages/Index.tsx`
The main (and only) page. Manages the `currentTurn` state at the page level so `GameInfo` can display it independently from the board. Renders a two-column responsive grid:
- Left: `<Chessboard />`
- Right: `<GameInfo />`

### `components/Chessboard.tsx`
The heart of the application. Responsible for:
- **Board initialization** — populates a `Map<string, ChessPiece>` keyed by `"x,y"` coordinates with the standard starting position
- **Click handling** — two-phase selection: (1) select a piece to show valid moves, (2) click a destination to execute the move
- **Turn management** — alternates between `'white'` and `'black'` after each valid move
- **Sound effects** — plays `select.mp3` and `move.mp3` via the Web Audio API
- **Capture detection** — identifies and highlights the last captured square

### `components/Square.tsx`
A single 1/8th-of-the-board cell. Purely presentational — receives all state via props:
- `isWhite` — determines light/dark square background
- `piece` — renders the Unicode chess symbol (`♔ ♕ ♖ ♗ ♘ ♙` / `♚ ♛ ♜ ♝ ♞ ♟`)
- `isSelected` — applies scale + accent background
- `isValidMove` — shows animated green dot overlay
- `isCapture` — applies red overlay on the captured square

### `components/GameInfo.tsx`
A sidebar panel displaying:
- The current player's turn with an animated pulsing badge (white/black styled accordingly)

### `hooks/use-toast.ts`
Custom React hook managing the toast notification queue — tracks toast state and provides `toast()` imperative trigger used in Chessboard for move/capture announcements.

---

## ♟️ Chess Logic Deep Dive

All chess rules live in `src/utils/chessLogic.ts`. No external chess engine is used.

### Board Representation
The board is a `Map<string, ChessPiece>` where keys are `"x,y"` coordinate strings (e.g. `"3,4"`). Empty squares are simply absent from the Map.

```
x: 0–7 (columns, left to right)
y: 0–7 (rows, top to bottom)
  Black pieces start at y=0 (back row) and y=1 (pawns)
  White pieces start at y=7 (back row) and y=6 (pawns)
```

### `isValidMove(from, to, piece, board)`
Entry point for move validation. Checks:
1. Destination is within board boundaries (0–7)
2. Destination does not contain a friendly piece
3. Delegates to piece-specific validators

### Piece Validators

| Piece | Validator | Logic |
|---|---|---|
| **Pawn** | `isValidPawnMove` | Direction determined by color (`white` = −y, `black` = +y). Single-step forward, double-step from start row (checks intermediate square is clear), diagonal-only captures |
| **Rook** | `isValidRookMove` | Must move along same row or column; path obstruction check via `isPathObstructed` |
| **Knight** | `isValidKnightMove` | L-shape: `(±2,±1)` or `(±1,±2)` — ignores path obstruction by design |
| **Bishop** | `isValidBishopMove` | Must move diagonally (`|dx| === |dy|`); path obstruction check |
| **Queen** | `isValidQueenMove` | Combines Rook + Bishop logic; path obstruction check |
| **King** | `isValidKingMove` | Maximum one square in any direction (`|dx| ≤ 1 && |dy| ≤ 1`) |

### `isPathObstructed(from, to, board)`
Walks every intermediate square between `from` and `to` using normalized direction vectors (`Math.sign`). Returns `true` if any intermediate square is occupied. Used by Rook, Bishop, and Queen validators.

### `getValidMoves(position, piece, board)`
Brute-forces all 64 squares and returns those that pass `isValidMove`. Used to compute the green-dot valid-move overlays when a piece is selected.

> **Note:** The current implementation does not yet enforce check/checkmate detection or special moves (castling, en passant, pawn promotion). These are natural extension points.

---

## 🛠️ Tech Stack

### Core

| Technology | Version | Role |
|---|---|---|
| **React** | 18.3 | UI component library and rendering engine |
| **TypeScript** | 5.5 | Static typing across all components, types, and utilities |
| **Vite** | 5.4 | Build tool and development server (HMR via SWC) |
| **@vitejs/plugin-react-swc** | 3.5 | SWC-powered Rust-based compiler for lightning-fast builds |

### UI & Styling

| Technology | Version | Role |
|---|---|---|
| **Tailwind CSS** | 3.4 | Utility-first CSS framework with custom design tokens |
| **tailwindcss-animate** | 1.0 | Animation utilities (`animate-pulse`, `animate-fade-in`) |
| **shadcn/ui** | — | Pre-built accessible component collection (Toast, Tooltip, etc.) |
| **Radix UI** | Various | Headless, accessible primitives underlying shadcn components |
| **lucide-react** | 0.462 | Icon library (SVG icons) |
| **class-variance-authority** | 0.7 | Type-safe variant styling for UI components |
| **clsx + tailwind-merge** | — | Conditional class name composition without conflicts |

### Routing & State

| Technology | Version | Role |
|---|---|---|
| **react-router-dom** | 6.26 | Client-side routing (SPA navigation) |
| **@tanstack/react-query** | 5.56 | Async state management (pre-configured for future API use) |
| **React `useState` / `useEffect`** | — | Local component state for board, turn, selection, and moves |

### Forms & Validation (available, unused in current scope)

| Technology | Version | Role |
|---|---|---|
| **react-hook-form** | 7.53 | Form state management |
| **zod** | 3.23 | Schema validation |
| **@hookform/resolvers** | 3.9 | Bridge between zod and react-hook-form |

### Developer Experience

| Technology | Version | Role |
|---|---|---|
| **ESLint** | 9.9 | Code linting with React Hooks and Refresh rules |
| **typescript-eslint** | 8.0 | TypeScript-aware ESLint rules |
| **PostCSS + Autoprefixer** | — | CSS processing and vendor prefix injection |
| **lovable-tagger** | 1.0 | Component tagging for Lovable.dev visual editor integration |

---

## 📁 Project Structure

```
chessverse-battlefield/
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   ├── placeholder.svg
│   └── sounds/
│       ├── select.mp3          ← Piece selection audio cue
│       └── move.mp3            ← Piece movement audio cue
│
├── src/
│   ├── main.tsx                ← React DOM entry point
│   ├── App.tsx                 ← Root component (providers + router)
│   ├── App.css                 ← Global app styles
│   ├── index.css               ← Tailwind base + CSS custom properties
│   ├── vite-env.d.ts           ← Vite type declarations
│   │
│   ├── pages/
│   │   ├── Index.tsx           ← Main game page (layout + turn state)
│   │   └── NotFound.tsx        ← 404 fallback route
│   │
│   ├── components/
│   │   ├── Chessboard.tsx      ← Board state, click handler, move execution
│   │   ├── Square.tsx          ← Individual cell renderer (piece + overlays)
│   │   ├── GameInfo.tsx        ← Turn indicator sidebar
│   │   └── ui/                 ← shadcn/ui component library
│   │       ├── toaster.tsx
│   │       ├── sonner.tsx
│   │       ├── tooltip.tsx
│   │       └── ...             ← (full Radix UI component set)
│   │
│   ├── types/
│   │   └── chess.ts            ← ChessPiece, Position, Move, PieceType, PieceColor
│   │
│   ├── utils/
│   │   └── chessLogic.ts       ← All move validation logic (no external engine)
│   │
│   ├── hooks/
│   │   ├── use-toast.ts        ← Toast notification state hook
│   │   └── use-mobile.tsx      ← Responsive breakpoint detection hook
│   │
│   └── lib/
│       └── utils.ts            ← `cn()` Tailwind class merge utility
│
├── index.html                  ← Vite HTML entry point
├── vite.config.ts              ← Vite config (port 8080, @ alias, SWC)
├── tailwind.config.ts          ← Custom colors, fonts, keyframes
├── tsconfig.json               ← TypeScript project references
├── tsconfig.app.json           ← App source TypeScript config
├── tsconfig.node.json          ← Node/Vite config TypeScript config
├── components.json             ← shadcn/ui configuration
├── eslint.config.js            ← ESLint flat config
├── postcss.config.js           ← PostCSS plugins
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** ≥ 9 (bundled with Node.js)

### Local Development

```sh
# 1. Clone the repository
git clone https://github.com/Itinerant18/chessverse-battlefield.git

# 2. Enter the project directory
cd chessverse-battlefield

# 3. Install dependencies
npm install

# 4. Start the development server (hot-reload on http://localhost:8080)
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser. Two players can take turns on the same machine.

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| **dev** | `npm run dev` | Start Vite development server with HMR on port 8080 |
| **build** | `npm run build` | Compile TypeScript and bundle for production (`dist/`) |
| **build:dev** | `npm run build:dev` | Production bundle in development mode (source maps enabled) |
| **preview** | `npm run preview` | Serve the production build locally for smoke-testing |
| **lint** | `npm run lint` | Run ESLint across the entire source tree |

---

## ☁️ Deployment

The app is a fully static SPA — any static hosting service works.

### Netlify (recommended)

The live demo runs on [Netlify](https://www.netlify.com/):

```sh
npm run build
# Deploy the generated dist/ folder to Netlify
```

Or connect your GitHub repository to Netlify for automatic deployments on every push to `main`.

**Build settings:**
- Build command: `npm run build`
- Publish directory: `dist`

### Other Options

- **Vercel** — `vercel --prod`
- **GitHub Pages** — use the `gh-pages` npm package or GitHub Actions
- **Any CDN / S3 bucket** — upload contents of `dist/` and configure SPA fallback to `index.html`

---

## 🔮 Roadmap / Extension Points

- [ ] Check and checkmate detection
- [ ] Stalemate and draw detection
- [ ] Castling (kingside & queenside)
- [ ] En passant captures
- [ ] Pawn promotion dialog
- [ ] Move history / algebraic notation log
- [ ] Undo/redo last move
- [ ] Timer / clock per player
- [ ] Online multiplayer via WebSockets
- [ ] AI opponent (Stockfish WASM integration)
- [ ] Board themes and piece set customization

---

## 📄 License

This project is open source. See the repository for license details.

