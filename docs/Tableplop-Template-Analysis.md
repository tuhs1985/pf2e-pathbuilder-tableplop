# Tableplop VTT Character Template Analysis

This document breaks down the JSON structure used by Tableplop (VTT) for storing character data, based on a sample character export. It is intended for use in mapping and converting data from other character builders (such as Pathbuilder).

---

## High-Level Structure

- The character is encapsulated in an object with:
  - `"properties"`: An array of property objects (fields, sections, formulas, etc.)
  - `"private"`: Boolean (visibility)
  - `"type"`: String (e.g., `"tableplop-character-v2"`)

---

## Properties Array

Each entry in `"properties"` describes a single field, checkbox, section, or message on the sheet. The core fields are:

| Field         | Description                                                      |
|---------------|------------------------------------------------------------------|
| id            | Unique integer identifier for this property                      |
| parentId      | Parent property id (null for top-level tabs/sections)            |
| type          | Field type (see below)                                           |
| data          | Additional data (object or null, e.g., subtitles, collapsed)     |
| name          | Canonical field name (for most field types)                      |
| value         | The actual value (number, string, boolean, formula, etc.)        |
| rank          | Sort order within the parent section                             |
| formula       | (Optional) Calculation formula for derived fields (PF2e logic)   |
| characterId   | Internal reference to the owning character                       |
| message       | (Messages only) Descriptive text, rules, or explanations         |
| icon          | (Messages only) URL to an icon for the message                   |
| size          | (Sections only) Section size (numeric)                           |

---

## Property Types

| type                | Description                                                                                         |
|---------------------|-----------------------------------------------------------------------------------------------------|
| tab-section         | Top-level tab (e.g., "Inventory", "Spells", "Character")                                            |
| horizontal-section  | Horizontal split within a tab                                                                      |
| section             | Container section within a tab/horizontal-section                                                  |
| title-section       | Section header                                                                                     |
| heading             | Divider or heading label within a section                                                          |
| skill-4             | Skill, proficiency, or save group with up to 4 pips (trained → legendary), contains checkboxes     |
| checkbox            | Boolean value, usually for proficiency pips ("trained", "expert", etc.)                            |
| number              | Numeric field (e.g., ability score, HP, bonuses)                                                   |
| text                | Short text field (e.g., name, class, ancestry, background)                                         |
| health              | HP fields (current, max, temp)                                                                     |
| ability             | Calculated ability modifier (usually with a formula)                                               |
| checkboxes          | Set of checkboxes (for things like hero points, focus points, consumables)                         |
| message             | Freeform text info (spells, feats, item descriptions, ability explanations)                        |
| appearance          | Appearance block                                                                                   |
| paragraph           | Larger body of formatted text (e.g., notes, backgrounds)                                           |

---

## Hierarchy and Layout

- Each property has an `id` and a `parentId` to form a tree:
    - Top-level: `tab-section` (parentId: null)
    - Under tab: `horizontal-section`, `section`, `title-section`, `heading`
    - Under sections: data fields, messages, skill-4, checkboxes, etc.
- Use of this hierarchy is primarily for layout and display in Tableplop's UI.

---

## Proficiency (Skill/Save/Armor/Weapon) Logic

- Represented as a `skill-4` parent with children checkboxes for each rank:
    - `-trained` (pip 1)
    - `-expert` (pip 2)
    - `-master` (pip 3)
    - `-legendary` (pip 4)
- The parent `skill-4` property has:
    - `name`: the proficiency group (e.g., "light", "athletics", "will")
    - `value`: the calculated bonus
    - `formula`: a string representing PF2e logic, e.g. `(light-trained ? 2+level : 0) + ...`
- A pip is "filled" if its checkbox value is `true`.
    - `trained=true` (pip 1 only)
    - `expert=true` (pips 1 & 2)
    - `master=true` (pips 1-3)
    - `legendary=true` (all 4 pips)

---

## Ability Scores and Modifiers

- `"name": "<ability>-score"`: The raw score (usually type `number`)
- `"name": "<Ability>"`: The modifier (type `ability`, with a formula, e.g., `floor((strength-score-10)/2)`)

---

## Skills, Saves, and Perception

- Stored as `skill-4` parent with checkboxes for proficiency.
- `formula` for each includes the relevant ability modifier and proficiency logic.
- `value` is the calculated bonus.

---

## Weapons, Armor, Equipment

- Not highly structured: usually entered as `message` types with text descriptions.
- Some fields (e.g., "proficiency", "Item-bonus", "dex-cap" for armor) are stored as `number` type.
- Equipment and inventory may be stored as lists, messages, or checkboxes.

---

## Spells and Feats

- Stored as `message` objects under relevant spell/feat sections.
- Each message may include:
    - `name`: Name of the spell/feat
    - `icon`: (Optional) Icon URL
    - `message`: Description text (rules, mechanics, etc.)

---

## Health, Points, and Miscellaneous

- HP and focus points use `health`, `checkboxes`, and `number` types.
- Currency, consumables, and hero points also tracked as numbers or checkboxes.

---

## Notes

- **id**, **parentId**, and **characterId** are for internal organization and display.
- **Formulas** can be included for calculated fields (PF2e logic).
- The hierarchy allows for flexible grouping and presentation but does not affect mechanical calculations.

---

## Example: Proficiency Group

```json
{
  "id": 101,
  "parentId": 50,
  "type": "skill-4",
  "name": "light",
  "value": 5,
  "formula": "(light-trained ? 2+level : 0) + (light-expert ? 2 : 0) + (light-master ? 2 : 0) + (light-legendary ? 2 : 0)"
},
{ "id": 102, "parentId": 101, "type": "checkbox", "name": "light-trained", "value": true },
{ "id": 103, "parentId": 101, "type": "checkbox", "name": "light-expert", "value": true },
{ "id": 104, "parentId": 101, "type": "checkbox", "name": "light-master", "value": false },
{ "id": 105, "parentId": 101, "type": "checkbox", "name": "light-legendary", "value": false }
```

---

## Summary

- Tableplop uses a property-based, hierarchical, and highly flexible JSON format.
- All data is a flat array linked via id/parentId.
- Most core stats are either numbers, checkboxes, or formula-based fields, with messages for descriptive elements.
- Conversion from other systems must map both data and (optionally) hierarchy/layout if preserving UI structure is desired.

---