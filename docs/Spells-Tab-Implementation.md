# Spells Tab Implementation

## Overview

The spells tab converts Pathbuilder spellcasting JSON into Tableplop UI sections following deterministic rules. This document outlines the implementation details and key design decisions.

## Architecture

### SpellcastingEntry Model

Each spellcaster is modeled as a `SpellcastingEntry` object with:
- **tradition**: arcane, divine, occult, primal (discovered dynamically)
- **type**: prepared, spontaneous, innate, or focus
- **casterName**: Name of the caster (e.g., "Wizard", "Archetype Psychic")
- **ability**: Spellcasting ability (int, wis, cha)
- **proficiency**: Spell proficiency value (0-8, where 2=trained, 4=expert, etc.)
- **spellsByRank**: Map of spell rank to spell entries
- **preparedByRank**: (prepared only) Map of prepared spells with counts
- **slotsByRank**: Spell slots per rank (from `perDay` array)
- **maxRank**: Highest spell rank available (drives cantrip/focus heightening)

### Tradition Grouping

Spells are grouped by **tradition** at the top level. Each tradition gets its own section with:
1. Spell Attack modifier (skill-4 with proficiency pips)
2. Spell DC (text field with formula)
3. Sub-sections for each casting type (Prepared/Spontaneous/Innate/Focus)

**Multiple casters** of the same tradition+type get a suffix: `— {casterName}`

Example: `Occult Spontaneous Spells — Archetype Psychic`

## Critical Rules

### 1. Spellbook Rule (Prepared Casters)

Prepared casters have **TWO sections**:
- **Prepared Spells**: Shows what's currently prepared with slot counts
- **Spell Book**: Source of truth containing all known spells

**Important**: Never import spells directly into prepared slots. Always populate the spellbook and let prepared lists reference it.

### 2. Auto-Heightening

#### Cantrips (Rank 0)
- **ALL cantrips auto-heighten**
- Always displayed at `entry.maxRank`
- Display format: `Rank {maxRank} {spell.name}`

#### Focus Spells
- **ALL focus spells auto-heighten**
- Ignore any printed rank in Pathbuilder
- Use `focusEntry.maxRank` (derived from same-tradition casters or global max)
- Display format: `Rank {maxRank} {spell.name}`

### 3. Rank Display (Never Store in Name)

**Storage:**
```typescript
spell.name = "Fireball"  // Raw name
spell.baseRank = 3       // Base rank
```

**Computation:**
```typescript
effectiveRank = baseRank == 0 ? entry.maxRank : baseRank
```

**Display:**
```typescript
displayName = `Rank ${effectiveRank} ${spell.name}`
```

### 4. Spell DC / Attack (Global Proficiency)

Spell proficiency is **NOT per tradition**. It's global across all casting:

```typescript
globalSpellProficiency = max(
  ...spellCasters[].proficiency,
  ...focus.*.*.proficiency
)
```

Every spell attack uses this proficiency, but each tradition has its own attack/DC widgets.

**Formula:**
```
DC = 10 + level + globalSpellProficiency + abilityMod
Attack = level + globalSpellProficiency + abilityMod
```

### 5. Prepared Duplicates

Multiple preparations collapse into a single entry with count:

**Pathbuilder prepared list:**
```json
["Interposing Earth", "Interposing Earth", "Haste"]
```

**Tableplop display:**
```
Rank 4 Interposing Earth (x2)
Rank 4 Haste
```

### 6. Section Creation

**Only render sections that have data.** Do not create empty Prepared/Focus/Spontaneous blocks.

Check for non-empty arrays before rendering.

## Pathbuilder JSON Structure

### Regular Spellcasters

```json
"spellCasters": [{
  "name": "Magus",
  "magicTradition": "arcane",
  "spellcastingType": "prepared",
  "ability": "int",
  "proficiency": 4,
  "perDay": [5, 0, 0, 1, 4, 1, 0, 2, 2, 0, 0],
  "spells": [{
    "spellLevel": 1,
    "list": ["Shocking Grasp", "Mending", "Ant Haul"]
  }],
  "prepared": [{
    "spellLevel": 3,
    "list": ["Time Jump"]
  }]
}]
```

### Focus Spells

```json
"focusPoints": 3,
"focus": {
  "arcane": {
    "int": {
      "proficiency": 4,
      "focusCantrips": ["Shield (Amped)", "Imaginary Weapon"],
      "focusSpells": ["Shielding Strike"]
    }
  }
}
```

## Tableplop Structure

### Hierarchy

```
Spells Tab
  ?? Focus Points (checkboxes, global)
  ?? [Tradition] Spellcasting
      ?? Spell Attack / DC (horizontal-section with 2 columns)
      ?? Prepared Spells (if prepared casters exist)
      ?   ?? Cantrip
      ?   ?? Rank 1 (with slot paragraph)
      ?   ?? Rank N...
      ?? Spell Book (if prepared casters exist)
      ?   ?? Cantrips (with filter-list)
      ?   ?? Rank N (with filter-list)
      ?? Spontaneous/Innate Spells (if exist)
      ?   ?? Ranks with known spells
      ?? Focus Spells (if exist)
          ?? Cantrip
          ?? Focus Spell
```

### Property Types

- **tab-section**: Spells tab root
- **title-section**: Tradition, casting type, rank headers
- **horizontal-section**: Layout containers (2-column for attack/DC, prepared/spellbook)
- **section**: Column containers
- **skill-4**: Spell attack (with proficiency pips)
- **text**: Spell DC (with formula)
- **paragraph**: Slot counts (e.g., "Spell Slots: 4")
- **message**: Individual spells
- **filter-list**: Spellbook rank containers (ONLY accepts message children)
- **checkboxes**: Focus Points
- **heading**: Section separators ("===================")

## ID Allocation

**Range**: 70000000-89999999

```typescript
const newId = makeIdAllocator('Spells')
```

IDs increment sequentially within the range.

## MaxRank Derivation

For each entry:

```typescript
maxRank = highest spellLevel found in:
  - spells[]
  - prepared[]
  - perDay indices with count > 0
```

If still 0, use level-based fallback:
```typescript
maxRank = max(1, floor((level + 1) / 2))
```

## Focus Spell MaxRank

Focus entries determine maxRank from:
1. Same-tradition casters (preferred)
2. Global highest rank across all casters (fallback)
3. Level-based calculation (final fallback)

## Multiple Casters Example

**Pathbuilder:**
- Wizard (Arcane Prepared)
- Archetype Psychic (Arcane Spontaneous)

**Tableplop:**
```
Arcane Spellcasting
  ?? Spell Attack / DC
  ?? Prepared Spells — Wizard
  ?? Spell Book — Wizard
  ?? Spontaneous Spells — Archetype Psychic
```

## Known Limitations

1. **Spellbook editing**: Users must manually add/remove spells from spellbook in Tableplop after import
2. **Spell details**: Only spell names are imported; descriptions and mechanics come from Tableplop's database
3. **Blended spells**: Not yet implemented (rare mechanic)
4. **Custom spells**: Pathbuilder custom spells import as names only

## Testing Checklist

- [ ] Prepared caster with spellbook
- [ ] Spontaneous caster without spellbook
- [ ] Innate spells
- [ ] Focus spells with cantrips
- [ ] Multiple casters same tradition
- [ ] Multiple traditions
- [ ] Cantrip auto-heightening
- [ ] Focus spell auto-heightening
- [ ] Prepared duplicates (x2, x3)
- [ ] Empty spell lists (no render)
- [ ] Focus points widget
- [ ] Spell Attack proficiency pips
- [ ] Spell DC formula

## Future Enhancements

1. **Spell slot tracking**: Add checkboxes for tracking used slots
2. **Heightening UI**: Add controls to heighten spells on demand
3. **Spell preparation**: Interactive spell preparation interface
4. **Metamagic**: Support metamagic feat integration
5. **Staffs/Wands**: Handle spells from items
