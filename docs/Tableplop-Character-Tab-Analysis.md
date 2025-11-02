# Tableplop "Character" Tab Analysis

This document analyzes the structure and field mapping of the "Character" tab in a Tableplop character sheet, focusing on how to translate Pathbuilder export fields into the appropriate Tableplop properties/sections.

---

## Hierarchy

- **Tab:** `"Character"` (`type`: `tab-section`, e.g., `id: 77228047`, `parentId: null`)
  - **Section:** `"Character Details"` (`type`: `title-section` or `section`, e.g., `id: 77227917`, `parentId`: Character tab id)
    - **Properties:** Core character info fields (name, ancestry, etc.)

---

## Fields Present in Tableplop "Character Details"

| Tableplop Field Name    | Type      | Example Value        | Notes                  |
|------------------------ |-----------|----------------------|------------------------|
| Name                    | text      | "Kurgan Dusthammer"  | Pathbuilder: `name`    |
| Ancestry                | text      | "Dwarf"              | Pathbuilder: `ancestry`|
| Heritage                | text      | "Forge Dwarf"        | Pathbuilder: `heritage`|
| Background              | text      | "Artisan"            | Pathbuilder: `background`|
| Class                   | text      | "Magus"              | Pathbuilder: `class`   |
| Level                   | number    | 8                    | Pathbuilder: `level`   |
| Experience              | number    | 0                    | Pathbuilder: `xp`      |
| Hero Points             | checkboxes| 1                    | Not in Pathbuilder, default or ignore |
| hero_points-max         | number    | 3                    | Not in Pathbuilder, default or ignore |
| Alignment               | text (optional) | "N"              | Pathbuilder: `alignment` (add if desired) |
| Gender                  | text (optional) | "Not set"         | Pathbuilder: `gender` (add if desired) |
| Deity                   | text (optional) | "Not set"         | Pathbuilder: `deity` (add if desired) |
| Age                     | text (optional) | "Not set"         | Pathbuilder: `age` (add if desired) |

---

## Example Tableplop Properties for Character Details

```json
[
  { "type": "text", "parentId": 77227917, "name": "Name", "value": "Kurgan Dusthammer", "rank": -8, "characterId": 1261035 },
  { "type": "text", "parentId": 77227917, "name": "Ancestry", "value": "Dwarf", "rank": -7, "characterId": 1261035 },
  { "type": "text", "parentId": 77227917, "name": "Heritage", "value": "Forge Dwarf", "rank": -6, "characterId": 1261035 },
  { "type": "text", "parentId": 77227917, "name": "Background", "value": "Artisan", "rank": -4, "characterId": 1261035 },
  { "type": "text", "parentId": 77227917, "name": "Class", "value": "Magus", "rank": -5, "characterId": 1261035 },
  { "type": "number", "parentId": 77227917, "name": "Level", "value": 8, "rank": 0, "characterId": 1261035 },
  { "type": "number", "parentId": 77227917, "name": "Experience", "value": 0, "rank": -1, "characterId": 1261035 }
  // Optionally add Alignment, Gender, Deity, Age if desired
]
```

---

## Mapping Table: Pathbuilder → Tableplop (Character Details)

| Pathbuilder Field     | Tableplop Name    | Type   | Notes                       |
|---------------------- |------------------|--------|-----------------------------|
| name                  | Name             | text   |                             |
| ancestry              | Ancestry         | text   |                             |
| heritage              | Heritage         | text   |                             |
| background            | Background       | text   |                             |
| class                 | Class            | text   |                             |
| level                 | Level            | number |                             |
| xp                    | Experience       | number |                             |
| alignment             | Alignment        | text   | Optional                    |
| gender                | Gender           | text   | Optional                    |
| deity                 | Deity            | text   | Optional                    |
| age                   | Age              | text   | Optional                    |

---

## Notes

- **Direct 1:1 mapping** for core identity fields.
- **Hero Points**: Not present in Pathbuilder, but may be included in Tableplop as a default or left blank.
- **Optional**: Add more fields if you want to preserve extra info (alignment, gender, etc.).
- **parentId**: All fields for this section should use the "Character Details" section id as parentId.

---

## Next Steps

- Repeat this mapping process for other sections/tabs (e.g., Ability Scores, Skills, Armor, Weapons, Spells).
- When converting, ensure all Tableplop `id`/`parentId` relationships are respected for layout.

---