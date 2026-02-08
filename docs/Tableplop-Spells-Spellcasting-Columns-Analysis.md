# Tableplop "Spells" Tab: Spellcasting Columns (parentIds: 77228030, 77228032)

This document defines how to populate TWO separate summary paragraphs in the Spells tab from a Pathbuilder export, while preserving all existing widgets in each column.

- Tab: Spells (id: 77228045)
- Column A parentId: 77228030 (left column)
- Column B parentId: 77228032 (right column)
- Pathbuilder sources: build.spellCasters, build.focus, build.focusPoints

Key interpretation rules (Pathbuilder)
- spells[].list = KNOWN spells (repertoire/known list)
- prepared[].list = PREPARED spells (actually prepared for the day)
- Prepared casters: show prepared; only fall back to known if the prepared block for that level is missing
- Spontaneous casters: show known; also show Slots/day from perDay[level] when available
- Cantrips (level 0):
  - Prepared casters: use prepared[0] if present; else fall back to spells[0]
  - Spontaneous casters: use spells[0] (known)

Do NOT alter these existing widgets
- Do not change any “Spellcasting DC” fields (these derive from formulas in the template).
- Do not remove or rewrite any “Slot X - …” checkboxes.
- Do not remove or rewrite any example spell message blocks already present.

Column A (parentId: 77228030)
- Purpose: Summarize per-caster prepared/known spells as a quick-reference paragraph.
- Existing children in the template (leave intact):
  - Title-sections:
    - 77228033 "Cantrips (2nd level)" (example heading container)
    - 77228034 "First Level Spells" (example heading container)
    - 77228035 "Second Level Spells" (example heading container)
  - Numbers:
    - 77228037 "Primal Spellcasting DC" (formula = class_dc) — do not modify
  - Example spell messages (leave intact):
    - 77228039 Tanglefoot (under 77228033)
    - 77228040 Fleet Step, 77228041 Shillelagh (under 77228034)
    - 77228042 Acid Arrow, 77228043 Entangle (under 77228035)
  - Slot checkboxes (leave intact):
    - 77228061 "Slot 1 - Acid Arrow" (under 77228035)
    - 77228062 "Slot 1 - Fleet Step" (under 77228034)
    - 77228063 "Slot 2 - Entangle" (under 77228035)
    - 77228064 "Slot 2 - Heal" (under 77228034)
    - 77228066 "Slot 3 - Shillelagh" (under 77228034)
- New or updated content:
  - Add or update a paragraph named "Spellcasting Summary" directly under 77228030 (type: paragraph, data: null).
    - If creating: set rank = -1 so it appears above examples; do not reorder existing items.
  - Content rules:
    - For each caster in build.spellCasters:
      - Heading: “{Tradition Titlecase} — {Prepared|Spontaneous|Innate}{ (Caster Name if present)}”
      - For levels 0,1,2,…:
        - Prepared: use prepared[level]; if absent, use spells[level]
          - Preserve duplicates in prepared (e.g., “Sure Strike” twice)
        - Spontaneous/Innate: use spells[level]; for spontaneous only, append “(Slots/day: N)” if perDay[level] > 0
      - Labels: 0 => “Cantrips”, then “1st”, “2nd”, “3rd”, “4th”, …
      - Preserve the order of spells within each level (no sorting within a level)
    - HTML structure:
      - <p><strong>{Header}</strong></p>
      - <ul><li><em>{Label}{optional slots}:</em> name; name; …</li> …</ul>

Column B (parentId: 77228032)
- Purpose: Show Focus Points and Focus spells/cantrips summary (by tradition).
- Existing children in the template (leave intact except where noted):
  - Title-sections:
    - 77228032 "Focus Spells" (column header)
    - 77228060 "Druid Order Spells" (example heading container)
  - Numbers:
    - 77228059 "Focus Spellcasting DC" (formula = class_dc) — do not modify
  - Focus Points widget:
    - 77228031 "Focus Points" (checkboxes) — current tracker (do not set this value)
    - 77228038 "focus_points-max" (number) — we WILL set this to build.focusPoints (default 0 if missing)
  - Example spell message (leave intact):
    - 77228089 "GoodBerry"
- New or updated content:
  - Add or update a paragraph named "Focus Spells Summary" directly under 77228032 (type: paragraph, data: null).
    - If creating: set rank = -1 so it appears near the top; do not reorder existing items.
  - Content rules:
    - First list item: “Focus Points: N” if build.focusPoints is numeric; also set 77228038 (focus_points-max) = N (default 0 if missing).
    - For each tradition in build.focus:
      - Aggregate all focusSpells and focusCantrips (across abilities, e.g., "int")
      - Mark cantrips with “(Cantrip)”
      - Render as: “Tradition: Spell; Spell; …”
    - HTML structure:
      - <p><strong>Focus Spells</strong></p>
      - <ul>
        <li>Focus Points: N</li>
        <li><em>Arcane:</em> …</li>
        <li><em>Occult:</em> …</li>
        …
      </ul>

Behavior
- Create the summary paragraphs if they do not exist; otherwise overwrite their value fields only.
- If build.spellCasters is empty, leave Column A unchanged.
- If neither focusPoints nor any focus spells exist, leave Column B unchanged (and do not touch focus_points-max).
- Never delete or modify:
  - DC fields (retain formulas)
  - Existing slot checkboxes (“Slot X - …”)
  - Example spell message blocks

Example using the provided Pathbuilder export
- Column A (77228030):
  <p><strong>Arcane — Prepared (Magus)</strong></p>
  <ul>
    <li><em>Cantrips:</em> Detect Magic; Eat Fire; Ignition; Electric Arc; Caustic Blast</li>
    <li><em>2nd:</em> Sure Strike; Sure Strike</li>
    <li><em>3rd:</em> Ghostly Weapon; Fireball</li>
    <li><em>4th:</em> Enlarge; Mountain Resilience</li>
  </ul>
  <p><strong>Occult — Spontaneous (Archetype Psychic)</strong></p>
  <ul>
    <li><em>1st (Slots/day: 1):</em> Protection</li>
    <li><em>2nd (Slots/day: 1):</em> Instant Armor</li>
    <li><em>3rd (Slots/day: 1):</em> Heroism</li>
  </ul>

- Column B (77228032):
  <p><strong>Focus Spells</strong></p>
  <ul>
    <li>Focus Points: 3</li>
    <li><em>Arcane:</em> Shielding Strike; Force Fang</li>
    <li><em>Occult:</em> Shield (Amped) (Cantrip); Imaginary Weapon (Cantrip)</li>
  </ul>

Pseudocode
- ensureParagraph(parentId, name):
  - find paragraph with matching name under parentId
  - if not found: create with type=paragraph, data=null, rank=-1
  - return ref
- buildIndex(blocks):
  - idx = Map<level:number, names:string[]>
  - for {spellLevel, list} in (blocks || []):
    - if finite(spellLevel): names = (list||[]).map(String).map(trim).filter(Boolean)
    - if names.length: idx[spellLevel] = names
  - return idx
- renderCasters():
  - parts = []
  - for caster of build.spellCasters:
    - type = lower(caster.spellcastingType) // prepared|spontaneous
    - trad = title(lower(caster.magicTradition))
    - heading = `${trad} — ${title(type)}${caster.name ? ` (${caster.name})` : ""}`
    - idxKnown = buildIndex(caster.spells)
    - idxPrepared = buildIndex(caster.prepared)
    - levels = (type === "prepared")
      ? sorted union of keys in idxPrepared and idxKnown
      : sorted keys of idxKnown
    - lis = []
    - for L in levels asc:
      - names = (type === "prepared") ? (idxPrepared[L] ?? idxKnown[L] ?? []) : (idxKnown[L] ?? [])
      - if !names.length: continue
      - label = (L===0 ? "Cantrips" : `${ordinal(L)}`)
      - suffix = ""
      - if type==="spontaneous" && L>0 && finite(caster.perDay?.[L]) && caster.perDay[L] > 0:
          suffix = ` (Slots/day: ${caster.perDay[L]})`
      - lis.push(`<li><em>${escape(label)}${suffix}:</em> ${escape(names.join("; "))}</li>`)
    - if lis.length:
      - parts.push(`<p><strong>${escape(heading)}</strong></p>`)
      - parts.push(`<ul>${lis.join("")}</ul>`)
  - return parts.join("")
- renderFocus():
  - parts = []
  - lis = []
  - if finite(build.focusPoints): lis.push(`<li>Focus Points: ${build.focusPoints}</li>`)
  - for each traditionKey in Object.keys(build.focus || {}):
    - items = []
    - for each abilityKey in Object.keys(build.focus[traditionKey] || {}):
      - node = build.focus[traditionKey][abilityKey] || {}
      - items.push(...(node.focusSpells||[]).map(s => String(s).trim()))
      - items.push(...(node.focusCantrips||[]).map(s => `${String(s).trim()} (Cantrip)`))
    - items = items.filter(Boolean)
    - if items.length: lis.push(`<li><em>${title(traditionKey)}:</em> ${escape(items.join("; "))}</li>`)
  - if lis.length:
    - parts.push(`<p><strong>Focus Spells</strong></p>`)
    - parts.push(`<ul>${lis.join("")}</ul>`)
  - return parts.join("")
- main():
  - colA = ensureParagraph(77228030, "Spellcasting Summary")
  - htmlA = renderCasters()
  - if htmlA: colA.value = htmlA
  - colB = ensureParagraph(77228032, "Focus Spells Summary")
  - htmlB = renderFocus()
  - if htmlB: colB.value = htmlB
  - if finite(build.focusPoints): set number id 77228038 (focus_points-max) = build.focusPoints; do not change widget 77228031 current value

Notes
- We never merge prepared and known for a level; prepared always takes precedence for prepared casters (fallback to known only when prepared list for that level is missing).
- We intentionally avoid altering DC fields, existing slot checkboxes, and example spell message blocks.