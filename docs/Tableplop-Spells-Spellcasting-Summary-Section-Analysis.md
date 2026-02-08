# Tableplop "Spells" Tab: Spellcasting Columns (parentIds: 77228030, 77228032)

This document defines how to populate TWO separate summary paragraphs in the Spells tab from a Pathbuilder export.

- Tab: Spells (id: 77228045)
- Column A: parentId: 77228030 (left column in the template)
  - Target: paragraph named “Spellcasting Summary” placed under 77228030
- Column B: parentId: 77228032 (right column in the template)
  - Target: paragraph named “Focus Spells Summary” placed under 77228032
- Pathbuilder sources: build.spellCasters, build.focus, build.focusPoints

Do NOT alter existing template widgets
- Do not change “Spellcasting DC” fields, example spell message blocks, or any existing “Slot X - …” checkboxes/title-sections.
- Only add or update the two summary paragraphs described below.

Key interpretation rules
- spells[].list = KNOWN spells (repertoire/known list)
- prepared[].list = PREPARED spells (actually prepared for the day)
- Prepared casters: show prepared; only fall back to known if the prepared block for that level is missing
- Spontaneous casters: show known; also show Slots/day from perDay[level] when available
- Cantrips (level 0):
  - Prepared casters: use prepared[0] if present; else fall back to spells[0]
  - Spontaneous casters: use spells[0] (known)

Column A (parentId: 77228030): Spellcasting Summary
- Create or update a paragraph named “Spellcasting Summary” directly under 77228030
  - type: paragraph; data: null; rank: -1 (if creating); do not rearrange other content
- For each caster in build.spellCasters:
  - Heading: “{Tradition Titlecase} — {Prepared|Spontaneous|Innate}{ (Caster Name if present)}”
  - For levels 0,1,2,…:
    - Prepared casters: use prepared[level]; if not present, use spells[level]
      - Preserve duplicates in prepared (e.g., “Sure Strike” twice)
    - Spontaneous casters: use spells[level]; append “(Slots/day: N)” if perDay[level] > 0
  - Labels: 0 => “Cantrips”, then “1st”, “2nd”, “3rd”, …
  - Preserve the order of spells within each level; do not sort at the spell name level
- HTML structure:
  - <p><strong>{Header}</strong></p>
  - <ul><li><em>{Label}{optional slots}:</em> name; name; …</li> …</ul>

Column B (parentId: 77228032): Focus Spells Summary
- Create or update a paragraph named “Focus Spells Summary” directly under 77228032
  - type: paragraph; data: null; rank: -1 (if creating)
- Content:
  - “Focus Points: N” when build.focusPoints is numeric
  - For each tradition present in build.focus:
    - Aggregate focusSpells and focusCantrips under that tradition (all abilities)
    - Mark focus cantrips with “(Cantrip)”
    - Render as: “Tradition: Spell; Spell; …”

Behavior
- Create the summary paragraphs if they do not exist; otherwise overwrite their value fields
- If build.spellCasters is empty, leave Column A unchanged
- If neither focusPoints nor any focus spells exist, leave Column B unchanged

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
    - type = lower(caster.spellcastingType)
    - trad = title(lower(caster.magicTradition))
    - heading = `${trad} — ${title(type)}${caster.name ? ` (${caster.name})` : ""}`
    - idxKnown = buildIndex(caster.spells)
    - idxPrepared = buildIndex(caster.prepared)
    - levels = (type === "prepared")
      ? sorted union of keys in idxPrepared and idxKnown (fallback coverage)
      : sorted keys of idxKnown
    - lis = []
    - for L in levels asc:
      - names = (type === "prepared") ? (idxPrepared[L] ?? idxKnown[L] ?? []) : (idxKnown[L] ?? [])
      - if !names.length: continue
      - label = (L===0 ? "Cantrips" : ordinal(L))
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
    - for each abilityKey in Object.keys(build.focus[traditionKey] || {}):
      - node = build.focus[traditionKey][abilityKey] || {}
      - items = [...(node.focusSpells||[]).map(trim), ...(node.focusCantrips||[]).map(x => `${trim(x)} (Cantrip)`)].filter(Boolean)
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

Notes
- We never merge prepared and known for a level; prepared always takes precedence for prepared casters
- We intentionally avoid altering any existing slot checkboxes or example spell message blocks in the template