# Tableplop "Feats" Tab: Feats Summary (parentId: 77227971)

This document defines how to populate the Feats tab summary paragraph from a Pathbuilder export.

- Tab: Feats (`id: 77228046`)
- Section: unnamed section under Feats (`parentId: 77227971`)
- Target property to update: paragraph with `id: 77228024`
- Pathbuilder sources: `build.feats`, `build.specials`

Goal
- Replace the paragraph’s HTML content with categorized lists of feats taken and a list of class abilities/specials.
- Ignore Heritage as a feat category (Heritage is captured elsewhere in the Character tab).
- Preserve the existing property shape; only overwrite its `value` (HTML).

Property shape (unchanged except value)
- id: 77228024
- parentId: 77227971
- type: paragraph
- data: null
- value: HTML string (we will overwrite with generated content)
- rank: preserve existing
- characterId: preserve existing

Pathbuilder fields used
- build.feats: array of feat tuples, e.g.:
  - ["Dwarven Weapon Familiarity", null, "Ancestry Feat", 1, "Dwarf Feat 1", "standardChoice", null]
  - ["Unburdened Iron", null, "Ancestry Feat", 1, "Ancestry Paragon 1", "standardChoice", null]
  - ["Psychic Dedication", null, "Archetype Feat", 2, "Free Archetype 2", "standardChoice", null]
  - ["Attack of Opportunity", null, "Class Feat", 6, "Magus Feat 6", "standardChoice", null]
  - ["Fleet", null, "General Feat", 7, "General Feat 7", "standardChoice", null]
  - ["Impeccable Crafting", null, "Skill Feat", 8, "Skill Feat 8", "standardChoice", null]
  - ["Shield Block", null, "Awarded Feat", 1, "Awarded Feat", "standardChoice", null]
- build.specials: array of strings (class features, granted abilities, cantrips, etc.)

Key rules
- Heritage handling:
  - If a feat’s type is “Heritage” (or clearly a heritage entry), SKIP it here. Heritage is shown in the Character tab.
- Group feats by type into the following headings:
  - Ancestry Feats
  - Class Feats
  - Archetype Feats
  - General Feats
  - Skill Feats
  - Awarded Feats
- Entry format for feats:
  - Show level and name: “(L) Name”
  - Slot annotation:
    - If the slot string (5th tuple element) indicates a special rule, append an annotation after an em dash:
      - Contains “Free Archetype” → “ — Free Archetype”
      - Contains “Ancestry Paragon” → “ — Ancestry Paragon”
      - Otherwise omit; normal slots (e.g., “Magus Feat 6”, “General Feat 7”) do not need annotation.
- Sorting:
  - Within each group: sort by level ascending, then by name case-insensitively.
- De-duplication:
  - If identical [name, type, level] occurs multiple times, keep the first occurrence.
- Specials (Class Abilities and Specials):
  - Render build.specials as a simple list without levels.
  - Do NOT try to cross-link to feats.
  - “Awarded Feats” from build.feats remain in the “Awarded Feats” group, not in Specials.

HTML rendering structure
- Use this section ordering if the group has at least one entry:
  1) Ancestry Feats
  2) Class Feats
  3) Archetype Feats
  4) General Feats
  5) Skill Feats
  6) Awarded Feats
  7) Class Abilities and Specials
- For each rendered section:
  - Heading paragraph: `<p><strong>{Section Title}:</strong></p>`
  - List: `<ul><li>…</li>…</ul>`
- Entire paragraph value is concatenated HTML of the sections above.
- If a group has no entries, omit that group completely.
- If both feats and specials are empty, leave the existing paragraph unchanged.

Examples (from provided Pathbuilder export)
- Input feats (subset):
  - ["Dwarven Weapon Familiarity", null, "Ancestry Feat", 1, "Dwarf Feat 1", "standardChoice", null]
  - ["Unburdened Iron", null, "Ancestry Feat", 1, "Ancestry Paragon 1", "standardChoice", null]
  - ["Psychic Dedication", null, "Archetype Feat", 2, "Free Archetype 2", "standardChoice", null]
  - ["Attack of Opportunity", null, "Class Feat", 6, "Magus Feat 6", "standardChoice", null]
  - ["Fleet", null, "General Feat", 7, "General Feat 7", "standardChoice", null]
  - ["Impeccable Crafting", null, "Skill Feat", 8, "Skill Feat 8", "standardChoice", null]
  - ["Shield Block", null, "Awarded Feat", 1, "Awarded Feat", "standardChoice", null]
- Input specials (subset):
  - ["Spellstrike","Arcane Cascade","Lightning Reflexes","Weapon Expertise","Weapon Specialization","Studious Spells", …]

- Output paragraph value (illustrative):
  <p><strong>Ancestry Feats:</strong></p>
  <ul>
    <li>(1) Dwarven Weapon Familiarity</li>
    <li>(1) Unburdened Iron — Ancestry Paragon</li>
  </ul>
  <p><strong>Class Feats:</strong></p>
  <ul>
    <li>(6) Attack of Opportunity</li>
  </ul>
  <p><strong>Archetype Feats:</strong></p>
  <ul>
    <li>(2) Psychic Dedication — Free Archetype</li>
  </ul>
  <p><strong>General Feats:</strong></p>
  <ul>
    <li>(7) Fleet</li>
  </ul>
  <p><strong>Skill Feats:</strong></p>
  <ul>
    <li>(8) Impeccable Crafting</li>
  </ul>
  <p><strong>Awarded Feats:</strong></p>
  <ul>
    <li>(1) Shield Block</li>
  </ul>
  <p><strong>Class Abilities and Specials:</strong></p>
  <ul>
    <li>Spellstrike</li>
    <li>Arcane Cascade</li>
    <li>Lightning Reflexes</li>
    <li>Weapon Expertise</li>
    <li>Weapon Specialization</li>
    <li>Studious Spells</li>
  </ul>

Notes
- We only overwrite the HTML value of the target paragraph.
- We don’t attempt to compute or display feat prerequisites, granted spells, or detailed text—players can expand details in other sections as needed.
- Slot strings are used only for indicating Free Archetype or Ancestry Paragon annotations; other slot names are omitted to reduce clutter.