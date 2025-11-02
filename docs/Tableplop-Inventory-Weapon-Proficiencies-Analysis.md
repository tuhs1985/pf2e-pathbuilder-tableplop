# Tableplop "Inventory" Tab: Weapon Proficiencies Section Analysis

This document describes the structure and conversion logic for the "Weapon Proficiencies" section (`id: 77227860`) in the Tableplop Inventory tab (`id: 77228044`), focusing on data mapping from Pathbuilder JSON.

---

## Hierarchy

- **Tab:** "Inventory" (`id: 77228044`)
  - **Section:** "Weapon Proficiencies" (`id: 77227860`)
    - **Properties:** Weapon proficiency groups (Simple, Martial, Advanced, Unarmed, plus custom).

---

## Tableplop "Weapon Proficiencies" Section

Each proficiency group is represented as a `skill-4` property (with up to 4 pips for Trained, Expert, Master, Legendary), similar to skills/saves.

- **Standard Types:**  
  - "simple" (Simple Weapons)
  - "martial" (Martial Weapons)
  - "advanced" (Advanced Weapons)
  - "unarmed" (Unarmed Attacks)
- **Custom/Group Types:**  
  - Specific weapons or groups (e.g., "longsword", "katana", etc.) if present in Pathbuilder output.

Each has:
- A `skill-4` parent property (with formula and value)
- Four child `checkbox` properties for the proficiency pips

---

## Pathbuilder → Tableplop Mapping

| Pathbuilder Field                    | Tableplop Name   | Type     | Notes                      |
|--------------------------------------|------------------|----------|----------------------------|
| proficiencies.weapons.simple         | simple           | skill-4  | Set pips/bonus per rank    |
| proficiencies.weapons.martial        | martial          | skill-4  |                            |
| proficiencies.weapons.advanced       | advanced         | skill-4  |                            |
| proficiencies.weapons.unarmed        | unarmed          | skill-4  |                            |
| proficiencies.weapons.<custom>       | <custom>         | skill-4  | e.g., "longsword", "rapier"|

- Each proficiency value is numeric: 0 (Untrained), 2 (Trained), 4 (Expert), 6 (Master), 8 (Legendary).

### Proficiency Pip Mapping

| PB Value | Tableplop Pips               |
|----------|------------------------------|
| 0        | none                         |
| 2        | trained                      |
| 4        | trained, expert              |
| 6        | trained, expert, master      |
| 8        | trained, expert, master, legendary |

---

## Example Tableplop Properties

```json
{
  "type": "skill-4",
  "parentId": 77227860,
  "name": "simple",
  "value": 16,
  "formula": "(simple-trained ? 2+level : 0) + (simple-expert ? 2 : 0) + (simple-master ? 2 : 0) + (simple-legendary ? 2 : 0) + proficiency-bonus",
  "characterId": 1261035
},
{ "type": "checkbox", "parentId": <simple-id>, "name": "simple-trained", "value": true, "characterId": 1261035 },
{ "type": "checkbox", "parentId": <simple-id>, "name": "simple-expert", "value": false, "characterId": 1261035 },
...  
```

---

## Notes

- **Value:** Use Pathbuilder’s calculated total for each group (can be derived from proficiency + level + ability mod if needed).
- **Custom Weapons:** If Pathbuilder outputs proficiency for specific weapons (e.g., deity favored weapons), add those as additional `skill-4` entries.
- **Formula:** Copy Tableplop’s existing formula for consistency.
- **Pips:** Set checkboxes per proficiency rank.

---

## Next Steps

- Map all standard and custom weapon proficiencies from Pathbuilder.
- Add each as a `skill-4` group with checkboxes under the Weapon Proficiencies section.
- Continue to the next section (Armor Proficiencies, Equipment, etc.) after this mapping.

---