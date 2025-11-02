# Tableplop "Character" Tab: Skills Section Analysis

This document explains the structure and field mapping of the "Skills" section (`id: 77227823`) in the Tableplop character sheet, focusing on conversion from Pathbuilder JSON.

---

## Hierarchy

- **Tab:** `"Character"` (`id: 77228047`)
  - **Section:** `"Skills"` (`id: 77227823`)
    - **Properties:** Each skill proficiency group (with checkboxes), skill bonuses, and lore skills.

---

## Tableplop "Skills" Properties

For each skill in PF2e (Acrobatics, Arcana, Athletics, etc.), Tableplop uses:

- A parent property of type `skill-4` (proficiency group: trained, expert, master, legendary)
- Four child properties of type `checkbox` for each proficiency pip
- A calculated bonus value (`value`) and, optionally, a formula

#### Example for Acrobatics:
```json
{
  "type": "skill-4",
  "parentId": 77227823,
  "name": "acrobatics",
  "value": 17,
  "formula": "(acrobatics-trained ? 2+level : 0) + (acrobatics-expert ? 2 : 0) + (acrobatics-master ? 2 : 0) + (acrobatics-legendary ? 2 : 0) + dexterity + item-bonus",
  "characterId": 1261035
},
{ "type": "checkbox", "parentId": <acrobatics-id>, "name": "acrobatics-trained", "value": true, "characterId": 1261035 },
{ "type": "checkbox", "parentId": <acrobatics-id>, "name": "acrobatics-expert", "value": false, "characterId": 1261035 },
...
```

---

## Pathbuilder → Tableplop Mapping Table (Core Skills)

| Pathbuilder Field                     | Tableplop Name     | Type     | Notes                         |
|----------------------------------------|--------------------|----------|-------------------------------|
| proficiencies.skills.<skill>.prof      | skill-4/checkboxes | skill-4  | Set pips per proficiency      |
| proficiencies.skills.<skill>.item      | item-bonus         | number   | Add to formula/bonus          |
| abilities.<key ability>                | dexterity, etc.    | number   | Used in formula/bonus         |
| build.level                            | level              | number   | Used in formula/bonus         |
| skills.<skill>.total                   | value              | number   | Final bonus; use as value     |

- For each skill, set the checkboxes for trained/expert/master/legendary based on the numeric value from Pathbuilder.
- The bonus for each skill is pre-calculated in Pathbuilder and can be set as the `value` field in Tableplop.

---

## Lore Skills

- Pathbuilder outputs lores as an array: `lores: [ { name: "Engineering", rank: 2 }, ... ]`
- Each Lore should be added as a `skill-4` property (with checkboxes) under the Skills section.

#### Example for Engineering Lore:
```json
{
  "type": "skill-4",
  "parentId": 77227823,
  "name": "engineering-lore",
  "value": 14,
  "formula": "...",
  "characterId": 1261035
},
{ "type": "checkbox", "parentId": <engineering-lore-id>, "name": "engineering-lore-trained", "value": true, "characterId": 1261035 },
...
```

- Set the value and pips based on Pathbuilder's output.
- Use the same mapping for proficiency ranks.

---

## Proficiency Rank Mapping

| Pathbuilder Value | Tableplop Pips (Checkboxes) |
|-------------------|----------------------------|
| 0 (Untrained)     | none                       |
| 2 (Trained)       | trained                    |
| 4 (Expert)        | trained, expert            |
| 6 (Master)        | trained, expert, master    |
| 8 (Legendary)     | all four                   |

---

## Sample Tableplop Properties for a Skill

```json
{
  "type": "skill-4",
  "parentId": 77227823,
  "name": "acrobatics",
  "value": 17,
  "formula": "...", // as per Tableplop template
  "characterId": 1261035
},
{ "type": "checkbox", "parentId": <acrobatics-id>, "name": "acrobatics-trained", "value": true, "characterId": 1261035 },
{ "type": "checkbox", "parentId": <acrobatics-id>, "name": "acrobatics-expert", "value": false, "characterId": 1261035 },
{ "type": "checkbox", "parentId": <acrobatics-id>, "name": "acrobatics-master", "value": false, "characterId": 1261035 },
{ "type": "checkbox", "parentId": <acrobatics-id>, "name": "acrobatics-legendary", "value": false, "characterId": 1261035 }
```

---

## Notes

- **Formulas:** Copy the existing formulas from the Tableplop template; do not modify.
- **Pips:** Set checkboxes per proficiency rank.
- **Value:** Use Pathbuilder’s calculated total for each skill as the Tableplop value.
- **Lore skills:** Dynamically add as needed, with name as `<lore-name>-lore`.

---

## Next Steps

- Map and add all standard skills.
- Dynamically add all lore skills from Pathbuilder.
- Set checkboxes and values correctly per proficiency.
- Continue with next section (e.g., Perception, Saves, etc.).

---