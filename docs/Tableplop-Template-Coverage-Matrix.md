# Tableplop "Template" Coverage Matrix

This document lists all title-section entries present in the Tableplop template by tab and maps each to the analysis document that automates or explains how data is populated. Sections marked “Player-managed” are intentionally left as template fields for players to fill in.

Updated: 2025-11-03

---

## Character tab (id: 77228047)

- Character Details (id: 77227917)
  - Covered by: [Tableplop-Character-Character-Details-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Character-Character-Details-Analysis.md)
  - Character Portrait (Appearance widget; id: 77228084, parent container id: 77227840)
    - Status: Player-managed (no Pathbuilder integration); see [Tableplop-Character-Appearance-Widget-Analysis.md](./Tableplop-Character-Appearance-Widget-Analysis.md)
- Ability Scores (id: 77227822)
  - Covered by: [Tableplop-Character-Ability-Scores-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Character-Ability-Scores-Analysis.md)
- Combat Info (id: 77228069)
  - Covered by: [Tableplop-Character-Combat-Info-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Character-Combat-Info-Analysis.md)
- Skills (id: 77227823)
  - Covered by: [Tableplop-Character-Skills-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Character-Skills-Analysis.md)
  - Lores (id: 77228093) are handled within the Skills analysis (Lore mapping included)

---

## Inventory tab (id: 77228044)

- Weapon Proficiencies (id: 77227860)
  - Covered by: [Tableplop-Inventory-Weapon-Proficiencies-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Inventory-Weapon-Proficiencies-Analysis.md)
- Weapons (id: 77227920)
  - Covered by: [Tableplop-Inventory-Weapons-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Inventory-Weapons-Analysis.md)
- Armor (id: 77227926)
  - Covered by: [Tableplop-Inventory-Armor-Section-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Inventory-Armor-Section-Analysis.md)
- Armor Proficiency (id: 77227864)
  - Covered by: [Tableplop-Inventory-Armor-Proficiency-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Inventory-Armor-Proficiency-Analysis.md)
- On Person (id: 77227962)
  - Status: Player-managed (template only)
- Backpack (id: 77227966)
  - Covered by: [Tableplop-Inventory-Backpack-Section-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Inventory-Backpack-Section-Analysis.md)

---

## Feats tab (id: 77228046)

- Active Abilities (id: 77227985)
  - Status: Player-managed (template only)
- Passive Abilities (id: 77227986)
  - Status: Player-managed (template only)
- Feats Summary (paragraph, not a title-section)
  - Covered by: [Tableplop-Feats-Feats-Summary-Section-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Feats-Feats-Summary-Section-Analysis.md)

---

## Spells tab (id: 77228045)

- Spellcasting (id: 77227992)
  - Column A container (id: 77228030)
    - Cantrips (2nd level) (id: 77228033)
    - First Level Spells (id: 77228034)
    - Second Level Spells (id: 77228035)
  - Column B container (id: 77228032)
    - Focus Spells (id: 77228032)
    - Druid Order Spells (id: 77228060)
  - Covered by: [Tableplop-Spells-Spellcasting-Columns-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Spells-Spellcasting-Columns-Analysis.md)
    - Adds “Spellcasting Summary” to Column A and “Focus Spells Summary” to Column B.
    - Preserves DC fields, slot checkboxes, and example spell messages.

---

## Background tab

- Status: Player-managed (no Pathbuilder integration; intentionally left for players to fill in)

---

## Cross-cutting documents

- Overall workflow and template reference:
  - [Pathbuilder-to-Tableplop-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Pathbuilder-to-Tableplop-Analysis.md)
  - [Tableplop-Template-Analysis.md](https://github.com/tuhs1985/pf2e-pathbuilder-tableplop/blob/main/docs/Tableplop-Template-Analysis.md)

---

## Summary of uncovered title-sections (intentional player-fill)
- Inventory → On Person (id: 77227962)
- Feats → Active Abilities (id: 77227985)
- Feats → Passive Abilities (id: 77227986)
- Spells → Druid Order Spells (id: 77228060) remains template scaffolding; covered by summary but not auto-populated
- Background tab (entire tab)
- Character → Character Portrait (Appearance widget; id: 77228084, parent container id: 77227840) — Player-managed