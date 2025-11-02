# Pathbuilder to Tableplop (VTT) Data Mapping: Analysis & Notes

## Overview

This document captures the structural analysis and field-mapping logic for converting character data from Pathbuilder's JSON export (for Pathfinder 2e) into a format suitable for the Tableplop virtual tabletop (VTT).

---

## Pathbuilder Output Structure (Summary)

- **Top-level:**  
  - `success` (boolean)
  - `build` (object): All character data resides here

### Key `build` Fields

| Field                | Description                                       | Example                         |
|----------------------|---------------------------------------------------|---------------------------------|
| name                 | Character name                                    | "Kurgan Dusthammer"             |
| class                | Character class                                   | "Magus"                         |
| level                | Character level                                   | 8                               |
| ancestry, heritage   | Race and subrace                                  | "Dwarf", "Forge Dwarf"          |
| background           | Character background                              | "Artisan"                       |
| alignment            | Alignment code                                    | "N"                             |
| keyability           | Key ability score                                 | "str"                           |
| abilities            | Nested object, has str/dex/con/int/wis/cha, breakdowns |
| attributes           | HP, speed, bonuses                                | ancestryhp, classhp, speed      |
| proficiencies        | Object, numeric (see below)                       | classDC, skills, weapons, etc.  |
| feats                | List of arrays (feat name, type, level, etc.)     |                                 |
| specials             | List of special abilities                         |                                 |
| lores                | List of lore skills and their levels              |                                 |
| equipment            | Array (name, qty, notes)                          |                                 |
| weapons, armor       | Array of objects (see below)                      |                                 |
| money                | Object (cp, sp, gp, pp)                           |                                 |
| spellCasters         | List of spellcasting objects (see below)          |                                 |
| focus, focusPoints   | Focus spells/cantrips (see below)                 |                                 |
| acTotal              | Object with AC details                            |                                 |

---

## Spell Level and Focus Spells

- **Cantrips:** Always `spellLevel: 0`
- **Levelled Spells:** `spellLevel: 1-10`
- **Focus Spells:**  
  - Located under `focus` object:  
    - `focusSpells` (tradition/ability-rooted)  
    - `focusCantrips` (tradition/ability-rooted)

---

## Proficiency Mapping

Pathbuilder outputs numeric proficiency values for skills, saves, armor, weapons, etc.:

| Label      | Value |
|------------|-------|
| Untrained  | 0     |
| Trained    | 2     |
| Expert     | 4     |
| Master     | 6     |
| Legendary  | 8     |

---

## Skill, Save, and Perception Math

### Ability Modifier Calculation (PF2e Standard)
| Ability Score | Modifier |
|---------------|----------|
| 0–1           |   -5     |
| 2–3           |   -4     |
| 4–5           |   -3     |
| 6–7           |   -2     |
| 8–9           |   -1     |
| 10–11         |    0     |
| 12–13         |   +1     |
| 14–15         |   +2     |
| 16–17         |   +3     |
| 18–19         |   +4     |
| 20–21         |   +5     |
| 22–23         |   +6     |
| 24–25         |   +7     |
| ...           |   ...    |

**Ability Mod formula:**  
`modifier = floor((score - 10) / 2)`

### Skill/Save/Perception Total Bonus

- If **proficiency is Untrained** (0):  
  `Total Bonus = Ability Modifier [+ Item Bonus]`
- If **Trained or higher** (2, 4, 6, 8):  
  `Total Bonus = Level + Proficiency Value + Ability Modifier [+ Item Bonus]`

- **Item bonuses**: Include as needed (e.g., resilient rune for saves).

**Example (Trained skill):**  
Level 8, Proficiency 4 (Expert), Ability 19 (+4):  
`8 + 4 + 4 = +16`

**Example (Save with Resilient Rune):**  
Level 8, Proficiency 4 (Expert), Ability 16 (+3), Resilient (+1):  
`8 + 4 + 3 + 1 = +16`

---

## Weapon Dice Calculation

- `"die"`: e.g., "d10" (the base die)
- `"str"`: affects number of dice:
    - `""` (empty): 1dX
    - `"striking"`: 2dX
    - `"greaterStriking"`: 3dX
    - `"majorStriking"`: 4dX
- `"pot"`: potency rune, already reflected in attack bonus
- `"attack"`, `"damageBonus"`: already calculated, use as-is
- `"extraDamage"`: list of extra damage dice/effects

| "str" Value        | Dice         |
|--------------------|-------------|
| ""                 | 1dX         |
| "striking"         | 2dX         |
| "greaterStriking"  | 3dX         |
| "majorStriking"    | 4dX         |

---

## Armor Rune Breakdown

- `"pot"`: Potency rune; +1, +2, +3 to AC (already in `acTotal`)
- `"res"`: Resilient rune for saves:
    - "resilient": +1 item bonus to all saves
    - "greaterResilient": +2 item bonus
    - "majorResilient": +3 item bonus
- `"runes"`: Array of other rune effects (e.g., energy resistance)
- `"display"`: User-facing summary of armor

| "res" Value        | Save Bonus |
|--------------------|------------|
| "resilient"        | +1         |
| "greaterResilient" | +2         |
| "majorResilient"   | +3         |
| (null/empty)       | 0          |

---

## AC/Armor Bonus Calculation Note

- **acTotal.acItemBonus** = (armor’s base AC bonus) + (potency rune value)
- To get the armor’s base AC bonus (without rune):  
  `base_armor_bonus = acTotal.acItemBonus - armor.pot`

---

## Notes & Outstanding Items

- **AC and Attack/Damage bonuses are pre-calculated** in Pathbuilder output; no need to derive.
- **Saves and skill bonuses may need to have resilient rune bonuses added** if Tableplop expects final values.
- **Weapons and armor**: Properly parse rune, potency, and resilient data for conversion.
- **Focus spells/cantrips**: Extract from correct paths under `focus` object.
- **Skill/save calculation**: Use ability mod table and proficiency mapping above.
- **Awaiting Tableplop sample or schema** to finalize mapping.

---

## Next Steps

1. Acquire Tableplop (VTT) character schema or export for precise mapping.
2. Start building conversion functions/scripts based on above mappings.
3. Confirm how Tableplop expects fields like AC, saves, skills, equipment, spells, and focus spells.

---