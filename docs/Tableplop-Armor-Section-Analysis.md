# Tableplop: Armor (parentId: 77227926)

This document defines how to populate the Armor section from a Pathbuilder export.

- Section: Armor (`parentId: 77227926`)
- Pathbuilder source: `build.acTotal`

Fields in this section and mappings
- Item-bonus (Tableplop) → acItemBonus (Pathbuilder)
  - Tableplop path: number under Armor named "Item-bonus" (id: 77227927)
  - Value to set: `build.acTotal.acItemBonus`

- dex-cap (Tableplop) → acAbilityBonus (Pathbuilder)
  - Tableplop path: number under Armor named "dex-cap" (id: 77227928)
  - Value to set: `build.acTotal.acAbilityBonus`

- proficiency (Tableplop) → leave alone
  - Tableplop path: number under Armor named "proficiency" (id: 77227929), formula "medium"
  - Behavior: Do NOT change. This auto-calculates from the armor proficiency checkboxes.

- Circumstance Bonus (Tableplop) → player managed
  - Tableplop path: number under Armor named "Circumstance Bonus" (id: 77227961)
  - Behavior: Do NOT change. Player-entered situational modifier.

Notes
- We do not set the overall Armor Class directly; the sheet’s Armor Class formula uses these fields.
- If Pathbuilder lacks `acTotal`, default both Item-bonus and dex-cap to 0 and leave the rest unchanged.
- No other properties under parentId 77227926 are modified.

Example (from provided Pathbuilder export)
- build.acTotal: { acItemBonus: 7, acAbilityBonus: 0, acProfBonus: 10, acTotal: 27 }
- Set:
  - Item-bonus = 7
  - dex-cap = 0
  - proficiency = leave as-is (auto)
  - Circumstance Bonus = leave as-is (player)
  
Pseudocode
- src = build.acTotal || {}
- set("Item-bonus", parentId=77227926) = src.acItemBonus ?? 0
- set("dex-cap", parentId=77227926) = src.acAbilityBonus ?? 0
- do not change "proficiency"
- do not change "Circumstance Bonus"