# Tableplop "Inventory" Tab: Armor Proficiency (parentId: 77227864)

This document specifies how to map Pathbuilder armor proficiency into Tableplop’s “Armor Proficiency” section using the template’s skill-4 + checkboxes structure.

- Section: Armor Proficiency (parentId: 77227864)
- Categories: unarmored, light, medium, heavy

Overview
- For each category, the template contains:
  - One parent property of type "skill-4" named exactly the category (lowercase), with a formula.
  - Four checkbox children named "{category}-trained", "{category}-expert", "{category}-master", "{category}-legendary".
- The converter sets checkbox values based on Pathbuilder’s numeric proficiency rank. The skill’s formula computes the final value automatically.

Important
- Keep the template structure and ordering intact.
- Do NOT add icons for this section.
- Use data.subtitle "" for skill-4 parents; data: null for checkboxes.
- Preserve existing rank ordering; only toggle checkbox values.

## Target property shapes and order

Parent (skill-4): fields in this exact order
1) id
2) parentId
3) type
4) data
5) name
6) value
7) rank
8) formula
9) characterId

Child (checkbox): fields in this exact order
1) id
2) parentId
3) type
4) data
5) name
6) value
7) rank
8) characterId

## Example (Heavy)
Parent skill and four checkboxes using the template’s pattern:

```json
{
  "id": 77227990,
  "parentId": 77227864,
  "type": "skill-4",
  "data": {
    "subtitle": ""
  },
  "name": "heavy",
  "value": 9,
  "rank": 3,
  "formula": "(heavy-trained ? 2+level : 0) + (heavy-expert ? 2 : 0) + (heavy-master ? 2 : 0) + (heavy-legendary ? 2 : 0)",
  "characterId": 1261035
},
{
  "id": 77227913,
  "parentId": 77227990,
  "type": "checkbox",
  "data": null,
  "name": "heavy-trained",
  "value": true,
  "rank": 1,
  "characterId": 1261035
},
{
  "id": 77227914,
  "parentId": 77227990,
  "type": "checkbox",
  "data": null,
  "name": "heavy-expert",
  "value": true,
  "rank": 2,
  "characterId": 1261035
},
{
  "id": 77227915,
  "parentId": 77227990,
  "type": "checkbox",
  "data": null,
  "name": "heavy-master",
  "value": true,
  "rank": 3,
  "characterId": 1261035
},
{
  "id": 77227916,
  "parentId": 77227990,
  "type": "checkbox",
  "data": null,
  "name": "heavy-legendary",
  "value": true,
  "rank": 4,
  "characterId": 1261035
}
```

## Pathbuilder fields used
- build.proficiencies.unarmored: 0, 2, 4, 6, 8
- build.proficiencies.light: 0, 2, 4, 6, 8
- build.proficiencies.medium: 0, 2, 4, 6, 8
- build.proficiencies.heavy: 0, 2, 4, 6, 8
- Some exports may nest under build.proficiencies.armor.{category}; support both.

## Numeric-to-checkbox mapping
- 0 (Untrained): all false
- 2 (Trained): trained true
- 4 (Expert): trained true, expert true
- 6 (Master): trained true, expert true, master true
- 8 (Legendary): trained true, expert true, master true, legendary true
- If Pathbuilder provides an unexpected value, clamp to nearest of {0,2,4,6,8}.

## Formula template per category
Parent skill-4 name must be exactly lowercased category.
Use this per-category formula (replace {cat} with unarmored, light, medium, heavy):

({cat}-trained ? 2+level : 0) + ({cat}-expert ? 2 : 0) + ({cat}-master ? 2 : 0) + ({cat}-legendary ? 2 : 0)

## Creation/update behavior
- Prefer update-in-place:
  - Find existing parent skill-4 by name == category and parentId == 77227864.
  - Find its four child checkboxes by names "{cat}-trained/expert/master/legendary".
  - Set checkbox values per mapping above.
  - Do not change data.subtitle, rank, or formula if already correct.
- If any expected items are missing:
  - Create them with:
    - parent skill-4: data.subtitle "", formula per template, value can be left as-is (the formula will compute it), rank to preserve ordering.
    - child checkboxes: data null, rank 1..4.
- Do not add icons; keep fields exactly as in the template.

## Optional: value field
The value on the parent is computed by the formula from level and checkboxes:
- Trained: level+2
- Expert: level+4
- Master: level+6
- Legendary: level+8
You may leave value as-is (preferred) and let the formula recompute; or set it to the expected total for a clean snapshot.

## Template overlay rules
- Load the character template as-is.
- Apply checkbox updates for categories present in Pathbuilder.
- Leave categories missing from Pathbuilder untouched (keep template defaults).
- Do not alter unrelated sections.

## Pseudocode
- rankMap = {0:[], 2:["trained"], 4:["trained","expert"], 6:["trained","expert","master"], 8:["trained","expert","master","legendary"]}
- categories = ["unarmored","light","medium","heavy"]

for cat in categories:
  val = build.proficiencies[cat] || build.proficiencies.armor?.[cat]
  if val is number:
    tiers = rankMap[clamp(val, {0,2,4,6,8})]
    ensure parent skill-4 exists: name=cat, parentId=77227864, data.subtitle=""
    ensure child checkboxes exist under parent with names:
      `${cat}-trained`, `${cat}-expert`, `${cat}-master`, `${cat}-legendary`
    set checkbox.value = (tierName in tiers)
  else:
    leave template entries as-is

Notes
- Names are lowercase: "unarmored", "light", "medium", "heavy".
- Checkbox names follow "{cat}-tier".
