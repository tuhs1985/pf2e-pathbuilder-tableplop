# Tableplop "Inventory" Tab: Backpack (parentId: 77227966)

This document defines how to populate the Backpack section from a Pathbuilder export.

- Section: Backpack (`parentId: 77227966`)
- Target property to update: paragraph under Backpack with `id: 77227969`
- Pathbuilder source: `build.equipment`

Goal
- Replace the Backpack paragraph’s HTML content with a simple unordered list of equipment from Pathbuilder.
- Players can further populate the sheet with specific details; we only list item names and counts, and show “(Invested)” when applicable.

Property shape (unchanged except value)
- id: 77227969
- parentId: 77227966
- type: paragraph
- data: null
- value: HTML string (we will overwrite with a generated <ul>…</ul>)
- rank: preserve existing
- characterId: preserve existing

Pathbuilder fields used
- build.equipment: array of items
  - Supported shapes:
    - ["Boots of Bounding", 1, "Invested"]  // [name, qty, invested-flag]
    - ["Rope, 50 ft.", 1]                   // [name, qty]
    - "Rope, 50 ft."                        // string-only; treated as qty 1, not invested

Rendering rules
- Each equipment entry becomes one <li>.
- Extract:
  - name: string or first element
  - qty: numeric second element if present and a number; default = 1
  - invested: true only if the third element is the string "Invested" (case-insensitive). If it is not “Invested”, ignore it completely (no other notes shown).
- Format:
  - Always render quantity for consistency: "{qty}× {name}{ (Invested if invested)}"
  - Examples:
    - ["Boots of Bounding", 1, "Invested"] → 1× Boots of Bounding (Invested)
    - ["Rope, 50 ft.", 1] → 1× Rope, 50 ft.
    - "Rope, 50 ft." → 1× Rope, 50 ft.
- The final paragraph value is a single unordered list:
  <ul><li>…</li><li>…</li>…</ul>
- HTML only; no icons or links.

Behavior
- If build.equipment has at least one item:
  - Overwrite the Backpack paragraph (id: 77227969) value with the generated <ul>…</ul>.
- If build.equipment is missing or empty:
  - Leave the existing Backpack paragraph value unchanged.
- Do not create or remove properties; only update the paragraph’s value.

Example (from provided Pathbuilder export)
- Input:
  build.equipment = [
    ["Boots of Bounding", 1, "Invested"]
  ]
- Output paragraph value:
  <ul><li>1× Boots of Bounding (Invested)</li></ul>

Pseudocode
- items = build.equipment
- if Array.isArray(items) and items.length > 0:
  - normalized = []
  - for entry of items:
    - if typeof entry === "string":
        name = entry.trim(); qty = 1; invested = false
    - else if Array.isArray(entry):
        name = String(entry[0] ?? "").trim()
        qty = Number.isFinite(entry[1]) ? entry[1] : 1
        invested = (typeof entry[2] === "string") && entry[2].toLowerCase() === "invested"
    - if name: normalized.push({name, qty, invested})
  - lis = normalized.map(e => `<li>${e.qty}× ${escape(e.name)}${e.invested ? " (Invested)" : ""}</li>`)
  - html = `<ul>${lis.join("")}</ul>`
  - set property (id: 77227969) .value = html
- else:
  - do nothing

Notes
- This section does NOT affect “On Person” or any other inventory sections.
- Keep all other fields (rank, id, parentId, characterId) exactly as in the template.
