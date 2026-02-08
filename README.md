# Pathbuilder 2e → Tableplop Exporter (MVP)

Goal
- Fetch a Pathbuilder 2e JSON build and generate a valid Tableplop character JSON the player can download/import.
- Start with Character tab (Character Details + Ability Scores), then expand tab-by-tab.

Status
- React + TypeScript + Vite minimal app
- Uses 8-digit ID ranges:
  - Character: 10000000–19999999
  - Actions: 20000000–34999999
  - Inventory: 35000000–54999999
  - Feats: 55000000–69999999
  - Spells: 70000000–89999999
  - Background: 90000000–99999999

## Setup & Installation

Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

Runtime Environment
- **React**: 19.1.0 - UI framework
- **TypeScript**: 5.8.3 - Type-safe development
- **Vite**: 6.3.5 - Build tool and dev server
- **ESLint**: 9.25.0 - Code linting

Key Configuration
- TypeScript target: ES2022
- Module system: ESNext with Bundler resolution
- React JSX: `react-jsx` transform
- PWA enabled via `vite-plugin-pwa` for offline support
- GitHub Pages deployment via `gh-pages`

Install & Run
```bash
# Clone the repository
git clone https://github.com/tuhs1985/pf2e-pathbuilder-tableplop.git
cd pf2e-pathbuilder-tableplop

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:5173
```

Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on source files
- `npm run deploy` - Deploy to GitHub Pages

## Usage
- Enter the Pathbuilder JSON ID (e.g., 182461).
- Click “Fetch & Map” to preview.
- Click “Download JSON” to save a Tableplop import file.

Notes
- If CORS blocks the fetch, use a simple proxy or add a “Paste JSON” fallback UI.
- Ranks use gaps for human-friendly ordering; layout uses container chain: tab → horizontal-section → section → title-section → widgets.
- characterId is null for import; Tableplop assigns it.

Next tabs
- Inventory: weapon/armor proficiencies and weapons messages.
- Feats: Active/Passive abilities as messages.
- Spells: two-column structure; preserve DC formulas, slot checkboxes; add summaries.
- Background: freeform paragraphs/messages.

License
- MIT License - feel free to use, fork, modify, and distribute this project however you want.
- See LICENSE file for full details.
