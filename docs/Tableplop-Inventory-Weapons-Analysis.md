# Tableplop "Inventory" Tab: Weapons Section Analysis

This document specifies how to convert Pathbuilder weapon data into Tableplop weapon entries for the Inventory tab’s "Weapons" section.

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
- name: Weapon name (e.g., "Longsword")  
- icon: Always use this URL for weapon entries: `https://tableplop-files-prod.nyc3.cdn.digitaloceanspaces.com/3e8d3ced9cfa576fed53fbad963487ea.png`  
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
  "message": "Melee; Staff Strike {1d20+8} (two-hand d8), Damage {1d4+3} bludgeoning",
  "characterId": 1261035
}
```

---

## Pathbuilder Fields Used

Read these from each weapon object (field names/examples may vary by export version):

- name: "Longsword"  
- attack: numeric total to hit (includes level/proficiency/ability/potency)  
- damage or die: e.g., damage "1d8+4 slashing" and/or die "d8"  
- str: striking rune level: "", "striking", "greaterStriking", "majorStriking"  
- pot: potency rune (0–3); already included in attack  
- damage type letter: B (bludgeoning), S (slashing), P (piercing); or spelled-out type  
- traits: array of strings; may include “two-hand d8”, “ranged”, “thrown 20 ft.”, “reload 0”, “deadly d10”, “fatal d12”, “versatile P”, etc.  
- range: numeric range in feet (if present on ranged weapons)  
- damageMod: optional numeric damage modifier; if absent, parse from damage string  
- extraDamage: array of strings like ["1d6 Fire", "1d6 Cold"]

---

## Message Format and Rules

Canonical format:
{Mode}; {Name} Strike {1d20+Attack}{ (trait notes)}, Damage {XdDie[+Mod]} {type}{ + {XdY} extraType...}

1) Mode (Melee vs Ranged)
- Ranged if:
  - weapon.range > 0, or
  - traits include “ranged” or “thrown …”
- Otherwise Melee.

2) Strike
- Always “Strike {1d20+Attack}”
- Attack = Pathbuilder’s computed attack bonus (includes level, proficiency, ability, potency).

3) Parenthesized notes after Strike (optional, comma-separated)
Include when available and relevant:
- two-hand dX (e.g., “two-hand d8”)
- reload N (e.g., “reload 0”)
- thrown N ft. (e.g., “thrown 20 ft.”)
- deadly dX, fatal dX (display only; not rolled in base damage)
- range N ft. (for bows/crossbows when not otherwise clear)
- versatile T (optional display to remind of alternate type)

4) Base Damage Dice
- Die type:
  - Prefer weapon.die (e.g., "d10"); otherwise parse from damage string.
- Number of dice from striking rune (str):
  - "" → 1
  - "striking" → 2
  - "greaterStriking" → 3
  - "majorStriking" → 4

5) Damage Modifier
- Prefer a dedicated numeric (e.g., damageMod) if provided by Pathbuilder.
- Else parse the +X from the damage string if present (e.g., "1d8+4 slashing" → +4).
- If none is present, omit the +X.

6) Damage Type
- Map letters to full:
  - B → bludgeoning
  - S → slashing
  - P → piercing
- If letter not present, use the final word of the damage string (lowercased).

7) Extra Damage
- For each entry in extraDamage (e.g., "1d6 Fire"):
  - Append “ + {1d6} fire”
- Multiple entries chain: “ + {1d6} fire + {1d6} cold”
- Preserve dice; lowercase the type text.

---

## Examples

1) Staff (melee, no striking, STR +3, bludgeoning, two-hand option)
- Output:
Melee; Staff Strike {1d20+8} (two-hand d8), Damage {1d4+3} bludgeoning

2) Longsword (melee, greater striking, STR +4, slashing, with extra fire and cold)
- Output:
Melee; Longsword Strike {1d20+16}, Damage {3d8+4} slashing + {1d6} fire + {1d6} cold

3) Longbow (ranged, striking, DEX +5, piercing, reload 0)
- Output:
Ranged; Longbow Strike {1d20+18} (reload 0), Damage {2d8+5} piercing

4) Javelin (thrown, no striking)
- Output:
Ranged; Javelin Strike {1d20+X} (thrown 30 ft.), Damage {1d6+Y} piercing

Notes:
- X/Y are Pathbuilder-provided totals (attack and damage modifier).
- Deadly/Fatal and similar traits are surfaced in parentheses for player awareness but not included in the base damage formula.

---

## Algorithm (Pseudocode)

- diceCountByStr = {"":1,"striking":2,"greaterStriking":3,"majorStriking":4}
- typeMap = {B:"bludgeoning", S:"slashing", P:"piercing"}

- mode = (range > 0 || traits has "ranged" || traits has /^thrown/i) ? "Ranged" : "Melee"
- traitNotes = []
  - if traits has /^two-hand d\d+/i → push normalized "two-hand dX"
  - if traits has /^reload \d+/i → push "reload N"
  - if traits has /^thrown \d+/i → push "thrown N ft."
  - if traits has /^deadly d\d+/i → push "deadly dX"
  - if traits has /^fatal d\d+/i → push "fatal dX"
  - optionally if traits has /^versatile \w/i → push "versatile T"
  - notes = traitNotes.length ? ` (${traitNotes.join(", ")})` : ""
- diceCount = diceCountByStr[str || ""] || 1
- die = weapon.die || parseDie(weapon.damage)
- mod = weapon.damageMod ?? parseDamageMod(weapon.damage) ?? 0
- type = typeMap[weapon.damageTypeLetter] || parseType(weapon.damage) || "bludgeoning"
- base = `{${diceCount}${die}${mod ? "+"+mod : ""}} ${type}`

- extras = (extraDamage || [])
  .map(s => s.match(/(\d+d\d+)\s+(.*)/i))
  .filter(Boolean)
  .map(([,dice,t]) => ` + {${dice}} ${t.toLowerCase()}`)
  .join("")

- message = `${mode}; ${name} Strike {1d20+${attack}}${notes}, Damage ${base}${extras}`

---

## Implementation Tips

- Trust Pathbuilder’s attack and damage modifier totals; avoid re-deriving unless missing.
- Normalize trait strings (lowercase, consistent spacing) before matching/printing.
- Preserve order: show “two-hand” and “reload” before “deadly/fatal/versatile” if multiple notes exist.
- Icon:
  - Always set `icon` to `https://tableplop-files-prod.nyc3.cdn.digitaloceanspaces.com/3e8d3ced9cfa576fed53fbad963487ea.png` for weapon entries.
- IDs:
  - If generating offline, set id = (max existing id) + 1 for each new weapon; otherwise let Tableplop assign via UI.
