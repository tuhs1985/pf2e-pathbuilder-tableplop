# Tableplop PF2e Template: Working Notes

Purpose
- Capture concrete rules and repeatable patterns we discover while reverse-engineering and rebuilding the Tableplop PF2e template.
- Keep this short, actionable, and up to date as we iterate.

Updated: 2025-11-03

---

## Core truths we’ve confirmed

- Parent/child chain defines placement
  - Tabs (type: tab-section) contain horizontal-section rows.
  - horizontal-section contains section columns (width via size).
  - title-section is a header under a section; its widgets are children of the title-section parent.
  - Nothing “moves columns” except changing parentId.

- Rank controls sibling ordering
  - Ordering is by rank ascending; more negative = higher on the screen.
  - Scope: only among siblings with the same parentId.
  - Avoid ties; tie-breaking is not guaranteed (often looks like insertion order).
  - Best practice: leave gaps (e.g., -100, -90, …, -10, 0, 10) so later inserts don’t force renumbering.

- Import mechanics
  - Imports expect a complete character object: { type: "tableplop-character-v2", private, properties: [...] }.
  - You must include the structural chain (tab → horizontal-section → section) for any content you import.
  - characterId can be null on import; Tableplop assigns it.
  - Imports replace the current character; there’s no in-app “merge.” To patch, overlay changes onto the full JSON offline, then import the whole file.

- Formulas
  - Keep formulas verbatim for derived fields (e.g., ability modifiers, DCs).
  - Formulas reference field names, not ids.

---

## IDs and renumbering

- Valid IDs
  - Integer ≥ 1; whole numbers only.
  - No leading zeros (e.g., 00000001 is invalid).
  - Must be unique within the properties array (duplicates import but won’t render).

- Behavior
  - ID length isn’t constrained (8 digits is fine).
  - Rank, not id, controls visual order.

- Renumbering rules
  - If you renumber, update both the id and every parentId that points to it.
  - Formulas are name-based, so renumbering doesn’t break formulas (keep names the same).

- Tab ID ranges (adopted)
  - Character: 10000000–29999999
  - Inventory: 30000000–49999999
  - Feats: 50000000–69999999
  - Spells: 70000000–89999999
  - Background: 90000000–99999999
  - Guidance:
    - Allocate new ids within the tab’s range.
    - Reserve gaps for future insertions (e.g., step by 10/100 for readability).

---

## Character tab: key layout and IDs

- Character tab (id: 77228047) → columns via horizontal-section (77227847):
  - Left column section: 77227941
    - Character Details (title-section: 77227917)
      - Name (text: 77227952) rank -8
      - Ancestry (text: 77227874) rank -7
      - Heritage (text: 77227876) rank -6
      - Class (text: 77227880) rank -5
      - Background (text: 77227859) rank -4
      - Experience (number: 77227940) rank -1
      - Level (number: 77227939) rank 0
    - Ability Scores (title-section: 77227822)
      - Strength (ability: 77228072 → number: 77227839)
      - Dexterity (ability: 77227995 → number: 77227911)
      - Constitution (ability: 77228070 → number: 77227932)
      - Intelligence (ability: 77228071 → number: 77227933)
      - Wisdom (ability: 77227994 → number: 77227912)
      - Charisma (ability: 77228068 → number: 77227934)
      - Combat Info (title-section: 77228069) includes its own horizontal-section (77227882) with sub-columns for saves/HP/DCs/etc.
  - Right column section: 77227840
    - Skills (title-section: 77227823) with all skill-4 groups and their pip checkboxes.
    - Lores (title-section: 77228093) with Example lore (77228054).
    - Appearance (appearance: 77228084) — player-managed, no Pathbuilder mapping.

---

## Rank normalization (optional best practice)

Character Details ranks (human-friendly gaps; preserves current order):
- Title “Character Details” within the left column: -100
- Name: -100
- Ancestry: -90
- Heritage: -80
- Class: -70
- Background: -60
- Experience: -20
- Level: -10

---

## Minimal imports we tested (and that worked)

- Character-only skeleton (containers + Character Details), with:
  - Original template IDs
  - characterId set to null
  - Best-practice ranks applied

- Character-only with 8‑digit IDs (renumbered):
  - New ids assigned within Character range (e.g., 81000001… or 10000000…)
  - All parentId references updated
  - characterId null

- Character-only within adopted tab range:
  - Character tab and children assigned into 10000000–29999999

Notes
- If you omit required containers (tab/horizontal-section/section), import fails or content won’t render.
- Duplicate ids import but the affected nodes won’t display.

---

## Renumber script (works)

- Purpose: Reassign ids/parentIds to 8‑digit values under the adopted tab ranges, preserving everything else.
- Input: Full Tableplop export JSON.
- Output: Same JSON with:
  - ids/parentIds rewritten per tab
  - characterId set to null for import
  - Sibling order preserved by rank; parents emitted before children

- Usage
  - macOS/Linux:
    - python3 scripts/renumber_tableplop_ids.py input.json output.json
  - Windows (PowerShell/CMD):
    - py -3 scripts\renumber_tableplop_ids.py input.json output.json
    - or python scripts\renumber_tableplop_ids.py input.json output.json

- Notes
  - Script keys on tab names: “Character”, “Inventory”, “Feats”, “Spells”, “Background”.
  - Update TAB_BASE if tab names change.
  - Always back up your original export before running.

---

## Tips for building clean outputs

- Always include the container chain (tab → row → column) for any title-section you import.
- Group by parentId first, then set ranks within each group.
- Leave rank gaps for growth; keep negative ranges for top-of-section highlights.
- Preserve formulas verbatim; avoid recalculating derived fields unless necessary.