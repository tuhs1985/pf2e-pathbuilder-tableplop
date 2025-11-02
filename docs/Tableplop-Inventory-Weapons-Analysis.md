# Tableplop "Inventory" Tab: Weapons Section Analysis

This document specifies how to convert Pathbuilder weapon data into Tableplop weapon entries for the Inventory tab’s “Weapons” section.

- Tab: Inventory (`id: 77228044`)
- Section: Weapons (`id: 77227920`)

Each weapon is represented as a single Tableplop property of type `message` under the Weapons section. The `message` field holds a concise, roll-ready string with the weapon’s strike and damage.

---

## Target Tableplop Property (per weapon)

Canonical property order and fields to use:

1) id  
2) parentId  
3) type  
4) data  
5) name  
6) icon  
7) rank  
8) message  
9) characterId

- type: `message`  
- parentId: `77227920` (Weapons section)  
- data: `null`  
- name: Weapon name (e.g., “Longsword”)  
- icon: Always set to `https://tableplop-files-prod.nyc3.cdn.digitaloceanspaces.com/3e8d3ced9cfa576fed53fbad963487ea.png`  
- rank: Optional ordering integer  
- message: See “Message format and rules”  
- characterId: The owning character’s id  
- id: Unique per property (if importing programmatically, increment from max id found; otherwise let Tableplop assign)

Example (order preserved):
```json
{
  "id": 77227959,
  "parentId": 77227920,
  "type": "message",
  "data": null,
  "name": "Staff",
  "icon": "https://tableplop-files-prod.nyc3.cdn.digitaloceanspaces.com/3e8d3ced9cfa576fed53fbad963487ea.png",
  "rank": 0,
  "message": "Melee/Ranged; Staff Strike {1d20+8}, Damage {1d4+3} bludgeoning",
  "characterId": 1261035
}
```

Note: The template may include trait notes in parentheses (e.g., “(two-hand d8)”). The converter does not emit trait-based notes and will omit this portion when generating new entries.

---

## Pathbuilder Fields Used

Read these from each weapon object (field names/examples may vary by export version):

- name: "Longsword"  
- attack: numeric total to hit (includes level/proficiency/ability/potency)  
- die: base damage die string (e.g., "d8", "d10")  
- str: striking rune level: "", "striking", "greaterStriking", "majorStriking"  
- pot: potency rune (0–3); already included in attack  
- damage type letter: B (bludgeoning), S (slashing), P (piercing); or spelled-out type  
- damageBonus: numeric damage modifier computed by Pathbuilder (use this directly; do not derive from ability scores)  
- extraDamage: array of strings like ["1d6 Fire", "1d6 Cold"]

Traits are not consumed; ignore any trait-dependent logic. Mode is not inferred (see below).

---

## Message Format and Rules

Canonical format (no trait notes, Mode is a literal placeholder):
Melee/Ranged; {Name} Strike {1d20+Attack}, Damage {XdDie[+Mod]} {type}{ + {XdY} extraType...}

1) Mode
- Always emit the literal placeholder text: `Melee/Ranged;`
- Pathbuilder does not directly specify melee vs ranged; do not attempt to infer.

2) Strike
- Always “Strike {1d20+Attack}”
- Attack = Pathbuilder’s computed attack bonus (includes level, proficiency, ability, potency).

3) Base Damage Dice
- Die type from `die` (e.g., "d10").
- Number of dice from striking rune (str):
  - "" → 1
  - "striking" → 2
  - "greaterStriking" → 3
  - "majorStriking" → 4

4) Damage Modifier
- Use `damageBonus` from Pathbuilder as the damage modifier.
- Do NOT derive from STR/DEX or parse from a text string.

5) Damage Type
- Map letters to full:
  - B → bludgeoning
  - S → slashing
  - P → piercing
- If a spelled-out type is provided, use it as-is (lowercased).

6) Extra Damage
- For each entry in extraDamage (e.g., "1d6 Fire"):
  - Append “ + {1d6} fire”
- Multiple entries chain: “ + {1d6} fire + {1d6} cold”
- Preserve dice; lowercase the type text.

No parenthesized trait notes are included in the message.

---

## Examples

1) Staff (no striking, damageBonus +3, bludgeoning)
- Output:
Melee/Ranged; Staff Strike {1d20+8}, Damage {1d4+3} bludgeoning

2) Longsword (greater striking, damageBonus +4, slashing, with extra fire and cold)
- Output:
Melee/Ranged; Longsword Strike {1d20+16}, Damage {3d8+4} slashing + {1d6} fire + {1d6} cold

3) Longbow (striking, damageBonus +5, piercing)
- Output:
Melee/Ranged; Longbow Strike {1d20+18}, Damage {2d8+5} piercing

4) Javelin (damageBonus from Pathbuilder, piercing)
- Output:
Melee/Ranged; Javelin Strike {1d20+X}, Damage {1d6+Y} piercing

Notes:
- X/Y are Pathbuilder-provided totals (attack and damage modifier).
- Trait-based details like two-hand, reload, thrown distance, deadly/fatal, and versatile are intentionally omitted.

---

## Template Overlay and Defaults

- Baseline: Load the Tableplop character template as-is.
- Overlay from Pathbuilder (Weapons only):
  - Create entries under Weapons (77227920) from Pathbuilder data using the rules above.
  - Do not modify unrelated template sections or properties.
- Placeholders:
  - Keep template placeholders like “Staff” in Weapons if Pathbuilder does not provide a matching weapon.
  - If a Pathbuilder weapon has the same name as a template item, you may update that item instead of appending; otherwise append as a new entry.
- Defaults:
  - Any section/field not provided by Pathbuilder remains exactly as in the template (including `data: null`, fixed `icon` URL, and existing items).

### Section Exclusions

- On Person (`id: 77227962`): Excluded from conversion. Leave all entries exactly as they are in the template so the player can edit them.

---

## Algorithm (Pseudocode)

- diceCountByStr = {"":1,"striking":2,"greaterStriking":3,"majorStriking":4}
- typeMap = {B:"bludgeoning", S:"slashing", P:"piercing"}

- mode = "Melee/Ranged"  // constant placeholder
- diceCount = diceCountByStr[str || ""] || 1
- die = weapon.die
- mod = weapon.damageBonus ?? 0
- type = typeMap[weapon.damageTypeLetter] || (weapon.damageType || "bludgeoning").toLowerCase()
- base = `{${diceCount}${die}${mod ? "+"+mod : ""}} ${type}`

- extras = (extraDamage || [])
  .map(s => s.match(/(\d+d\d+)\s+(.*)/i))
  .filter(Boolean)
  .map(([,dice,t]) => ` + {${dice}} ${t.toLowerCase()}`)
  .join("")

- message = `${mode}; ${name} Strike {1d20+${attack}}, Damage ${base}${extras}`

---

## Implementation Tips

- Trust Pathbuilder’s attack and damage modifier totals; avoid re-deriving unless missing.
- Do not apply DEX to damage unless Pathbuilder already included it in `damageBonus`.
- Icon:
  - Always set `icon` to `https://tableplop-files-prod.nyc3.cdn.digitaloceanspaces.com/3e8d3ced9cfa576fed53fbad963487ea.png` for weapon entries.
- IDs:
  - If generating offline, set id = (max existing id) + 1 for each new weapon; otherwise let Tableplop assign via UI.