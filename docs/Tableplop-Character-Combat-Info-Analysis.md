# Tableplop "Character" Tab: Combat Info Section Analysis

This document details the structure and mapping logic for the "Combat Info" section (`id: 77228069`) within the "Character" tab of a Tableplop character sheet, focusing on translation from Pathbuilder JSON fields.

---

## Hierarchy

- **Tab:** "Character" (`id: 77228047`)
  - **Section:** "Combat Info" (`id: 77228069`)
    - **Properties:** AC, Speed, Shield stats, and other combat-relevant stats.

---

## Typical Fields in Tableplop "Combat Info" Section

| Tableplop Field Name    | Type      | Example Value | Formula (if any)                                  | Pathbuilder Field/Calculation         |
|------------------------ |-----------|--------------|---------------------------------------------------|---------------------------------------|
| Armor Class             | number    | 27           | "10 + item-bonus + dexterity + proficiency"       | `acTotal.acTotal` (precalculated)    |
| Speed                   | number    | 30           |                                                   | `attributes.speed` (+ `speedBonus` if desired) |
| Shield Bonus            | [TO ADD]  | (e.g., 2)    | [Add field: value from acTotal.shieldBonus]        | `acTotal.shieldBonus` (when shield is raised)  |
| Shield Hardness         | number    | 0            | "shield_hardness"                                 | Not present in Pathbuilder (unless shield equipped) |
| Shield HP               | number    | 0            |                                                   | Not present in Pathbuilder            |
| Shield BT (Break Threshold) | number| 0            | "broken_threshhold"                               | Not present in Pathbuilder            |

> **Note:**  
> There is currently no dedicated Shield Bonus field in the Tableplop template.  
> Recommend adding a "Shield Bonus" number field here, populated from Pathbuilder's `acTotal.shieldBonus` (the AC bonus for raising a shield).  
> This field should be calculated/displayed alongside AC and shield stats for full PF2e combat info accuracy.

---

## Notes Section (Languages Only)

- The "Notes" section in Combat Info is represented as a `paragraph` field.
- For this conversion, **only languages are included**.
- Pathbuilder field: `build.languages` (an array of language names).
- Tableplop field: a `paragraph` with HTML value.

### Example Tableplop Property

```json
{
  "type": "paragraph",
  "parentId": 77228069,
  "value": "<p><strong>Languages:</strong> Common, Dwarven, Elven</p>",
  "rank": -4,
  "characterId": 1261035
}
```

### Pseudocode for Conversion

```python
# Pathbuilder languages example
languages = build["languages"]  # e.g., ["Common", "Dwarven", "Elven"]

# Build paragraph HTML
languages_html = f"<p><strong>Languages:</strong> {', '.join(languages)}</p>"

# Tableplop property
languages_property = {
    "type": "paragraph",
    "parentId": 77228069,  # Combat Info section
    "value": languages_html,
    "rank": -4,
    "characterId": CHARACTER_ID
}
```

---

## Pathbuilder → Tableplop Mapping Table (Combat Info)

| Pathbuilder Field        | Tableplop Name        | Type   | Notes                                      |
|------------------------- |----------------------|--------|---------------------------------------------|
| acTotal.acTotal          | Armor Class          | number | Use as-is, this is total calculated AC      |
| attributes.speed         | Speed                | number | Add speedBonus if desired                   |
| acTotal.shieldBonus      | Shield Bonus         | number | [Planned field: add to template!]           |
| (no direct field)        | Shield Hardness      | number | Default to 0 unless shield present          |
| (no direct field)        | Shield HP            | number | Default to 0 unless shield present          |
| (no direct field)        | Broken Threshhold    | number | Default to 0 unless shield present          |
| languages                | Notes (Languages)    | paragraph | Output as described above                |

---

## Not Tracked or Set By Converter

- **Circumstance Bonus:**  
  - This is a user-only field in the Tableplop sheet, not exported from Pathbuilder.
  - The converter should never populate or alter it.
  - The AC formula may reference it, but only the user should supply a value during play.
- **Initiative:**  
  - Not present in Pathbuilder or the Tableplop Combat Info section by default.
  - Should not be tracked, set, or referenced in the converter or mapping documentation.

---

## Notes

- **Armor Class** should be taken from Pathbuilder's `acTotal.acTotal`.
- **Speed** is from `attributes.speed` (optionally add `speedBonus` if you want to reflect magical/feat increases).
- **Shield values**: Pathbuilder does not output shield stats unless a shield is equipped; if a shield is found in equipment or armor, fill in values accordingly.
- **Languages**: Only languages are included in the Notes section for simplicity and reliability.
- **Planned Shield Bonus Field:**  
  - Add a "Shield Bonus" field to Tableplop's Combat Info section.
  - Set its value from Pathbuilder's `acTotal.shieldBonus`.
  - This field is important for users who regularly Raise Shield in combat.

---

## Next Steps

- For shields, if Pathbuilder equipment includes a shield, attempt to parse and fill in shield fields.
- Add and calculate a Shield Bonus field when updating the Tableplop template.
- Proceed to next section (e.g., Health, Skills, etc.) for further mapping.

---