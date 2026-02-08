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

Run locally
- npm install
- npm run dev
- Open http://localhost:5173

Usage
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
