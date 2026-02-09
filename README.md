# Pathbuilder 2e ? Tableplop Exporter

A comprehensive tool to convert Pathfinder 2e character builds from Pathbuilder JSON format into fully functional Tableplop character sheets.

## Features

### Complete Character Export (6 Tabs)

**Character Tab**
- Character Details (Name, Ancestry, Heritage, Class, Background, Level, Experience)
- Ability Scores (all 6 abilities with calculated modifiers)
- Combat Info (HP with dynamic formula, AC, Speed, Saves, Perception, Class DC)
- Skills (all 16 core skills with proficiency pips)
- Lores (dynamically imported from Pathbuilder)
- Languages
- Hero Points

**Actions Tab**
- Encounter Actions (Attacks, standard actions, reactions, free actions)
- Exploration Actions (Avoid Notice, Scout, Search, Detect Magic, etc.)
- Downtime Actions (Earn Income, Craft, etc.)
- Weapon attacks automatically populated from inventory
- All actions include filter-list for easy searching

**Inventory Tab**
- Weapon Proficiencies (Simple, Martial, Advanced, Unarmed with proficiency pips)
- Weapons (dynamic entries with runes, damage formulas, attack bonuses)
- Armor Proficiencies (Unarmored, Light, Medium, Heavy with proficiency pips)
- Armor section (worn armor with runes, AC bonuses, Dex cap, shield stats)
- Backpack (equipment list with invested items marked)
- Currency tracking

**Feats Tab**
- Class & Ancestry Features (from specials array)
- Class Feats (organized by level)
- Archetype (Free Archetype feats)
- Ancestry Paragon (special ancestry feats)
- Skill Feats (organized by level)
- General Feats (organized by level)
- Ancestry Feats (organized by level)
- Bonus Feats (awarded feats)
- Parent-child feat relationships preserved (e.g., "Advanced Defender (Taunting Strike)")

**Spells Tab**
- Dynamic tradition grouping (Arcane, Divine, Occult, Primal)
- Spell Attack & DC per tradition with proficiency pips
- Prepared Spells with separate spellbook (source of truth)
- Spontaneous Spells (known spells)
- Innate Spellcasting
- Focus Spells with auto-heightening
- Cantrips auto-heighten to max spell rank
- Focus Points tracking
- Prepared spell duplicates collapsed (x2, x3)
- Multiple casters per tradition supported
- Spell slots tracking

**Background Tab**
- Comprehensive user guide with armor and shield notes
- Hidden Values section:
  - HP Modifiers (Ancestry HP, Class HP, HP per Level, Bonus HP)
  - Combat Modifiers (Armor-Class formula value, Class damage bonus, Other damage bonus)
- Class damage bonus calculated from Weapon Specialization

## Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

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

### Usage

1. **Get your Pathbuilder ID**: Open your character in Pathbuilder 2e, the ID is in the URL (e.g., `182461`)
2. **Enter the ID** in the input field
3. **Click "Fetch & Map"** to generate the Tableplop JSON
4. **Click "Download JSON"** to save the file
5. **Import in Tableplop**: Open Tableplop, click Import, and select your downloaded JSON file

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on source files
- `npm run deploy` - Deploy to GitHub Pages

## Architecture

### ID Allocation
The exporter uses deterministic 8-digit ID ranges per tab:
- **Character**: 10000000–19999999
- **Actions**: 20000000–34999999
- **Inventory**: 35000000–54999999
- **Feats**: 55000000–69999999
- **Spells**: 70000000–89999999
- **Background**: 90000000–99999999

### Technology Stack
- **React** 19.1.0 - UI framework
- **TypeScript** 5.8.3 - Type-safe development
- **Vite** 6.3.5 - Build tool and dev server
- **ESLint** 9.25.0 - Code linting
- **PWA** enabled via `vite-plugin-pwa` for offline support

### Key Design Patterns
- Modular tab architecture (one file per tab)
- Type-safe interfaces for Pathbuilder and Tableplop formats
- Formula preservation for dynamic calculations
- Defensive programming with null checks and defaults

## Documentation

See the `/docs` folder for detailed documentation:
- `Tableplop-Working-Notes.md` - Core patterns and type rules

## Known Limitations

1. **Shield Stats**: Pathbuilder doesn't export shield HP or Hardness. Users must manually enter these values in the Inventory tab after import.

2. **Armor Recognition**: The exporter recognizes most Core Rulebook armors. Unknown armors default to category-based values:
   - Heavy: Item Bonus +5, Dex Cap +1
   - Medium: Item Bonus +3, Dex Cap +2
   - Light: Item Bonus +1, Dex Cap +4
   - Unarmored: Item Bonus +0, Dex Cap +5

3. **Spellbook Editing**: After import, users must manually manage their spellbook in Tableplop (adding/removing spells as they level up).

4. **Content**: Pathbuilder spells and feats import as names only; descriptions will have to be supplied by the user.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Follow existing code patterns (one file per tab in `/src/lib/map/`)
- Maintain type safety (no `any` types)
- Preserve formulas exactly as they reference field names
- Test imports in Tableplop before submitting PRs
- Update documentation for significant changes

## License

MIT License - feel free to use, fork, modify, and distribute this project however you want. See [LICENSE](LICENSE) file for full details.

## Legal / Attribution

This project uses trademarks and/or copyrights owned by Paizo Inc., used under [Paizo's Community Use Policy](https://paizo.com/licenses/communityuse). We are expressly prohibited from charging you to use or access this content. This project is not published, endorsed, or specifically approved by Paizo. For more information about Paizo Inc. and Paizo products, visit [paizo.com](https://paizo.com).

## Acknowledgments

- **Pathbuilder 2e** by Redrazors for the excellent character builder
- **Tableplop** for the virtual tabletop platform
- **Paizo** for Pathfinder 2e
- **GitHub Copilot** for AI-assisted development support

## Links

- [Live App](https://tuhs1985.github.io/pf2e-pathbuilder-tableplop/) (GitHub Pages)
- [Pathbuilder 2e](https://pathbuilder2e.com/)
- [Tableplop](https://www.tableplop.com/)
- [Pathfinder 2e](https://paizo.com/pathfinder)

---

Made with love for the Pathfinder 2e community
