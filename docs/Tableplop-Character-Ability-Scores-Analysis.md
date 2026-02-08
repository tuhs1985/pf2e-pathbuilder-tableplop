# Tableplop "Character" Tab: Ability Scores Section Analysis

This document details the structure and mapping logic for the "Ability Scores" section (`id: 77227822`) within the "Character" tab of a Tableplop character sheet, focusing on translation from Pathbuilder JSON fields.

---

## Hierarchy

- **Tab:** `"Character"` (`id: 77228047`)
  - **Section:** `"Character Details"` (`id: 77227917`)
  - **Section:** `"Ability Scores"` (`id: 77227822`)
    - **Properties:** One for each ability score and modifier

---

## Tableplop "Ability Scores" Properties

For each ability (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma):

| Tableplop Field Name    | Type      | Example Value   | Formula                                  | Notes                    |
|------------------------ |-----------|-----------------|-------------------------------------------|--------------------------|
| strength-score          | number    | 19              |                                           | Pathbuilder: abilities.str |
| Strength                | ability   | 4               | floor((strength-score-10)/2)              | Pathbuilder: derived     |
| dexterity-score         | number    | 10              |                                           | Pathbuilder: abilities.dex |
| Dexterity               | ability   | 0               | floor((dexterity-score-10)/2)             | Pathbuilder: derived     |
| constitution-score      | number    | 16              |                                           | Pathbuilder: abilities.con |
| Constitution            | ability   | 3               | floor((constitution-score-10)/2)          | Pathbuilder: derived     |
| intelligence-score      | number    | 16              |                                           | Pathbuilder: abilities.int |
| Intelligence            | ability   | 3               | floor((intelligence-score-10)/2)          | Pathbuilder: derived     |
| wisdom-score            | number    | 16              |                                           | Pathbuilder: abilities.wis |
| Wisdom                  | ability   | 3               | floor((wisdom-score-10)/2)                | Pathbuilder: derived     |
| charisma-score          | number    | 8               |                                           | Pathbuilder: abilities.cha |
| Charisma                | ability   | -1              | floor((charisma-score-10)/2)              | Pathbuilder: derived     |

---

## Sample Tableplop Properties for Ability Scores Section

```json
[
  { "type": "number", "parentId": 77227822, "name": "strength-score", "value": 19, "rank": 0, "characterId": 1261035 },
  { "type": "ability", "parentId": 77227822, "name": "Strength", "value": 4, "rank": -1, "formula": "floor((strength-score-10)/2)", "characterId": 1261035 },
  { "type": "number", "parentId": 77227822, "name": "dexterity-score", "value": 10, "rank": 1, "characterId": 1261035 },
  { "type": "ability", "parentId": 77227822, "name": "Dexterity", "value": 0, "rank": 0, "formula": "floor((dexterity-score-10)/2)", "characterId": 1261035 },
  { "type": "number", "parentId": 77227822, "name": "constitution-score", "value": 16, "rank": 2, "characterId": 1261035 },
  { "type": "ability", "parentId": 77227822, "name": "Constitution", "value": 3, "rank": 1, "formula": "floor((constitution-score-10)/2)", "characterId": 1261035 },
  { "type": "number", "parentId": 77227822, "name": "intelligence-score", "value": 16, "rank": 3, "characterId": 1261035 },
  { "type": "ability", "parentId": 77227822, "name": "Intelligence", "value": 3, "rank": 2, "formula": "floor((intelligence-score-10)/2)", "characterId": 1261035 },
  { "type": "number", "parentId": 77227822, "name": "wisdom-score", "value": 16, "rank": 4, "characterId": 1261035 },
  { "type": "ability", "parentId": 77227822, "name": "Wisdom", "value": 3, "rank": 3, "formula": "floor((wisdom-score-10)/2)", "characterId": 1261035 },
  { "type": "number", "parentId": 77227822, "name": "charisma-score", "value": 8, "rank": 5, "characterId": 1261035 },
  { "type": "ability", "parentId": 77227822, "name": "Charisma", "value": -1, "rank": 4, "formula": "floor((charisma-score-10)/2)", "characterId": 1261035 }
]
```

---

## Pathbuilder → Tableplop Mapping Table (Ability Scores)

| Pathbuilder            | Tableplop Name       | Type     | Notes                  |
|------------------------|----------------------|----------|------------------------|
| abilities.str          | strength-score       | number   |                        |
| Modifier (derived)     | Strength             | ability  | use Tableplop formula  |
| abilities.dex          | dexterity-score      | number   |                        |
| Modifier (derived)     | Dexterity            | ability  | use Tableplop formula  |
| abilities.con          | constitution-score   | number   |                        |
| Modifier (derived)     | Constitution         | ability  | use Tableplop formula  |
| abilities.int          | intelligence-score   | number   |                        |
| Modifier (derived)     | Intelligence         | ability  | use Tableplop formula  |
| abilities.wis          | wisdom-score         | number   |                        |
| Modifier (derived)     | Wisdom               | ability  | use Tableplop formula  |
| abilities.cha          | charisma-score       | number   |                        |
| Modifier (derived)     | Charisma             | ability  | use Tableplop formula  |

---

## Notes

- **Ranks**: Adjust as needed to match your display preferences.
- **Formulas**: Tableplop conventionally uses the formula `"floor((score-10)/2)"` for ability modifiers.
- **parentId**: All fields in this section should use the Ability Scores section id.
- **characterId**: Should be set to the character's id.

---

## Next Steps

- Repeat this detailed mapping for the next section (e.g., HP & Speed, Skills, etc.)
- When building the conversion, ensure ability modifiers are calculated and both score and mod are output as separate Tableplop fields.

---