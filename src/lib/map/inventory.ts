import type { PathbuilderBuild } from '../pathbuilder'
import type { TableplopProperty } from '../tableplop'
import { makeIdAllocator } from '../idAllocator'

/**
* Inventory tab:
* - Weapon Proficiencies (skill-4 widgets)
* - Weapons (dynamic, one title-section per weapon with message + rune checkboxes)
* - Armor Proficiencies (skill-4 widgets)
* - Armor section (name, AC bonus, item bonus, dex cap, potency/resilient runes, shield)
* - Backpack (paragraph list)
* 
* ID range: 35000000-54999999
*/

// Basic armor lookup table (Name -> {itemBonus, dexCap})
const BASIC_ARMOR_DATA: Record<string, {itemBonus: number, dexCap: number}> = {
  'gi': {itemBonus: 0, dexCap: 5},
  'scroll robes': {itemBonus: 0, dexCap: 5},
  'unarmored': {itemBonus: 0, dexCap: 5},
  'explorer\'s clothing': {itemBonus: 0, dexCap: 5},
  'leaf weave': {itemBonus: 1, dexCap: 4},
  'leather lamellar': {itemBonus: 1, dexCap: 4},
  'armored cloak': {itemBonus: 1, dexCap: 3},
  'padded armor': {itemBonus: 1, dexCap: 3},
  'leather armor': {itemBonus: 1, dexCap: 4},
  'rattan armor': {itemBonus: 1, dexCap: 4},
  'armored coat': {itemBonus: 2, dexCap: 2},
  'buckle armor': {itemBonus: 2, dexCap: 3},
  'mantis shell': {itemBonus: 2, dexCap: 3},
  'quilted armor': {itemBonus: 2, dexCap: 2},
  'studded leather armor': {itemBonus: 2, dexCap: 3},
  'chain shirt': {itemBonus: 2, dexCap: 3},
  'kilted breastplate': {itemBonus: 2, dexCap: 3},
  'sankeit': {itemBonus: 2, dexCap: 3},
  'ceramic plate': {itemBonus: 3, dexCap: 2},
  'coral armor': {itemBonus: 3, dexCap: 2},
  'wooden breastplate': {itemBonus: 3, dexCap: 2},
  'hide armor': {itemBonus: 3, dexCap: 2},
  'scale mail': {itemBonus: 3, dexCap: 2},
  'niyaháat': {itemBonus: 3, dexCap: 2},
  'hellknight breastplate': {itemBonus: 4, dexCap: 1},
  'lamellar breastplate': {itemBonus: 4, dexCap: 1},
  'chain mail': {itemBonus: 4, dexCap: 1},
  'breastplate': {itemBonus: 4, dexCap: 1},
  'lattice armor': {itemBonus: 4, dexCap: 1},
  'hellknight half plate': {itemBonus: 5, dexCap: 1},
  'splint mail': {itemBonus: 5, dexCap: 1},
  'half plate': {itemBonus: 5, dexCap: 1},
  'gray maiden plate': {itemBonus: 6, dexCap: 0},
  'bastion plate': {itemBonus: 6, dexCap: 0},
  'fortress plate': {itemBonus: 6, dexCap: 0},
  'hellknight plate': {itemBonus: 6, dexCap: 0},
  'o-yoroi': {itemBonus: 6, dexCap: 0},
  'full plate': {itemBonus: 6, dexCap: 0}
}

export function buildInventoryProperties(build: PathbuilderBuild): TableplopProperty[] {
const newId = makeIdAllocator('Inventory')
const level = build.level ?? 1
const prof = build.proficiencies ?? {}

const props: TableplopProperty[] = []

// Create the Inventory tab first (ID 30000001)
const inventoryTabId = newId()
props.push({ id: inventoryTabId, parentId: null, type: 'tab-section', data: {}, value: 'Inventory', rank: -3, characterId: null })

// Main horizontal-section (parented to inventory tab)
const mainRowId = newId()
const leftColId = newId()
const rightColId = newId()
props.push({ id: mainRowId, parentId: inventoryTabId, type: 'horizontal-section', rank: -16, characterId: null })
props.push({ id: leftColId, parentId: mainRowId, type: 'section', data: {}, size: 50, rank: 0, characterId: null })
props.push({ id: rightColId, parentId: mainRowId, type: 'section', data: {}, size: 50, rank: 1, characterId: null })

  // ===== LEFT COLUMN =====

  // Weapon Proficiencies
  const weaponProfId = newId()
  props.push({ id: weaponProfId, parentId: leftColId, type: 'title-section', data: { collapsed: false }, value: 'Weapon Proficiencies', rank: 0, characterId: null })

  function addWeaponProf(label: string, key: string, profValue: number, rank: number) {
    const profId = newId()
    const formula = `level*(${key}-trained ? 1 : 0) + (${key}-trained ? 2 : 0) + (${key}-expert ? 2 : 0) + (${key}-master ? 2 : 0) + (${key}-legendary ? 2 : 0)`
    const bonus = profValue > 0 ? level + profValue : 0
    props.push({ id: profId, parentId: weaponProfId, type: 'skill-4', data: { subtitle: '' }, name: label, value: bonus, rank, formula, characterId: null })
    const trained = profValue >= 2
    const expert = profValue >= 4
    const master = profValue >= 6
    const legendary = profValue >= 8
    props.push({ id: newId(), parentId: profId, type: 'checkbox', data: null, name: `${key}-trained`, value: trained, rank: 1, characterId: null })
    props.push({ id: newId(), parentId: profId, type: 'checkbox', data: null, name: `${key}-expert`, value: expert, rank: 2, characterId: null })
    props.push({ id: newId(), parentId: profId, type: 'checkbox', data: null, name: `${key}-master`, value: master, rank: 3, characterId: null })
    props.push({ id: newId(), parentId: profId, type: 'checkbox', data: null, name: `${key}-legendary`, value: legendary, rank: 4, characterId: null })
  }

  addWeaponProf('Simple Weapons', 'simple_weapons', prof.simple ?? 0, 0)
  addWeaponProf('Martial Weapons', 'martial_weapons', prof.martial ?? 0, 1)
  addWeaponProf('Advanced Weapons', 'advanced_weapons', prof.advanced ?? 0, 2)
  addWeaponProf('Unarmed Attacks', 'unarmed_attacks', prof.unarmed ?? 0, -1)

  // Weapons section
  const weaponsId = newId()
  props.push({ id: weaponsId, parentId: leftColId, type: 'title-section', data: { collapsed: false }, value: 'Weapons', rank: 2, characterId: null })

  // Add each weapon from Pathbuilder
  const weapons = build.weapons ?? []
  weapons.forEach((weapon, index) => {
    const weaponNum = index + 1
    const weaponTitleId = newId()
    
    // Build weapon display name with runes
    const baseName = weapon.name || `Weapon ${weaponNum}`
    const potency = weapon.pot ?? 0
    const strikingMap: Record<string, string> = { '': '', 'striking': 'Striking', 'greaterStriking': 'Greater Striking', 'majorStriking': 'Major Striking' }
    const strikingName = strikingMap[weapon.str || ''] || ''
    const propertyRunes = weapon.runes || []
    
    // Build full name: "+1 Striking Flaming Frost Longsword"
    const nameParts: string[] = []
    if (potency > 0) nameParts.push(`+${potency}`)
    if (strikingName) nameParts.push(strikingName)
    propertyRunes.forEach(rune => {
      // Capitalize first letter of rune name
      const runeName = rune.charAt(0).toUpperCase() + rune.slice(1)
      nameParts.push(runeName)
    })
    nameParts.push(baseName)
    const fullWeaponName = nameParts.join(' ')
    
    props.push({ id: weaponTitleId, parentId: weaponsId, type: 'title-section', data: null, value: `Weapon ${weaponNum}`, rank: -3 + index, characterId: null })

    // Weapon message (attack macro)
    // Message format: "WeaponName: To hit {1d20+Str+Martial+potency_Rune_X}, Damage: {@:striking_rune_X+1:d8+Str+class_dmg+other_dmg}"
    const profType = weapon.prof === 'simple' ? 'Simple' : weapon.prof === 'martial' ? 'Martial' : weapon.prof === 'advanced' ? 'Advanced' : 'Unarmed'
    
    // Build damage formula with extraDamage
    const die = weapon.die || 'd8'
    let damageFormula = `{@:striking_rune_${weaponNum}+1:${die}+Str+class_dmg+other_dmg}`
    
    // Add extra damage dice
    const extraDamage = weapon.extraDamage || []
    extraDamage.forEach(extra => {
      // Parse "1d6 fire" into dice and type
      const match = extra.match(/^(\d+d\d+)\s+(.+)$/i)
      if (match) {
        const dice = match[1]
        const damageType = match[2]
        damageFormula += ` + {${dice}}${damageType}`
      }
    })
    
    const message = `${fullWeaponName}: To hit {1d20+Str+${profType}+potency_Rune_${weaponNum}}, Damage: ${damageFormula}`
    props.push({ id: newId(), parentId: weaponTitleId, type: 'message', data: null, name: fullWeaponName, message, icon: '/images/message.png', rank: 0, characterId: null })

    // Property runes text field (below message)
    const propertyRunesText = propertyRunes.length > 0 ? propertyRunes.join(', ') : ''
    props.push({ id: newId(), parentId: weaponTitleId, type: 'text', data: null, name: 'Property Runes', value: propertyRunesText, rank: 1, characterId: null })

    // Horizontal-section for runes
    const runeRowId = newId()
    const runeLeftId = newId()
    const runeRightId = newId()
    props.push({ id: runeRowId, parentId: weaponTitleId, type: 'horizontal-section', rank: 2, characterId: null })
    props.push({ id: runeLeftId, parentId: runeRowId, type: 'section', data: {}, size: 50, rank: 0, characterId: null })
    props.push({ id: runeRightId, parentId: runeRowId, type: 'section', data: {}, size: 50, rank: 1, characterId: null })

    // Potency Rune checkboxes
    const potencyId = newId()
    const potencyValue = weapon.pot ?? 0
    props.push({ id: potencyId, parentId: runeLeftId, type: 'checkboxes', data: null, name: `Potency Rune ${weaponNum}`, value: potencyValue, rank: 0, characterId: null })
    props.push({ id: newId(), parentId: potencyId, type: 'number', data: null, name: `potency_rune_${weaponNum}-max`, value: 3, rank: 1, characterId: null })

    // Striking Rune checkboxes
    const strikingId = newId()
    const strikingValueMap: Record<string, number> = { '': 0, 'striking': 1, 'greaterStriking': 2, 'majorStriking': 3 }
    const strikingValue = strikingValueMap[weapon.str || ''] ?? 0
    props.push({ id: strikingId, parentId: runeRightId, type: 'checkboxes', data: null, name: `Striking Rune ${weaponNum}`, value: strikingValue, rank: 0, characterId: null })
    props.push({ id: newId(), parentId: strikingId, type: 'number', data: null, name: `striking_rune_${weaponNum}-max`, value: 3, rank: 1, characterId: null })
  })

  // Add default Fist attack if no weapons
  if (weapons.length === 0) {
    const fistTitleId = newId()
    props.push({ id: fistTitleId, parentId: weaponsId, type: 'title-section', data: null, value: 'Weapon 1', rank: -3, characterId: null })

    // Fist message - uses higher of Str or Dex
    const fistMessage = 'Fist: To hit {1d20+(str>dex?str:dex)+unarmed_attacks+potency_rune_1}, Damage: {@:striking_rune_1+1:1d4+(str>dex?str:dex)+class_dmg+other_dmg}'
    props.push({ id: newId(), parentId: fistTitleId, type: 'message', data: null, name: 'Fist', message: fistMessage, icon: '/images/message.png', rank: 0, characterId: null })

    // No property runes for default fist
    props.push({ id: newId(), parentId: fistTitleId, type: 'text', data: null, name: 'Property Runes', value: '', rank: 1, characterId: null })

    // Horizontal-section for runes
    const runeRowId = newId()
    const runeLeftId = newId()
    const runeRightId = newId()
    props.push({ id: runeRowId, parentId: fistTitleId, type: 'horizontal-section', rank: 2, characterId: null })
    props.push({ id: runeLeftId, parentId: runeRowId, type: 'section', data: {}, size: 50, rank: 0, characterId: null })
    props.push({ id: runeRightId, parentId: runeRowId, type: 'section', data: {}, size: 50, rank: 1, characterId: null })

    // Potency Rune checkboxes (default 0)
    const potencyId = newId()
    props.push({ id: potencyId, parentId: runeLeftId, type: 'checkboxes', data: null, name: 'Potency Rune 1', value: 0, rank: 0, characterId: null })
    props.push({ id: newId(), parentId: potencyId, type: 'number', data: null, name: 'potency_rune_1-max', value: 3, rank: 1, characterId: null })

    // Striking Rune checkboxes (default 0)
    const strikingId = newId()
    props.push({ id: strikingId, parentId: runeRightId, type: 'checkboxes', data: null, name: 'Striking Rune 1', value: 0, rank: 0, characterId: null })
    props.push({ id: newId(), parentId: strikingId, type: 'number', data: null, name: 'striking_rune_1-max', value: 3, rank: 1, characterId: null })
  }

  // ===== RIGHT COLUMN =====

  // Armor Proficiencies
  const armorProfId = newId()
  props.push({ id: armorProfId, parentId: rightColId, type: 'title-section', data: null, value: 'Armor Proficiencies', rank: 3, characterId: null })

  function addArmorProf(label: string, key: string, profValue: number, rank: number) {
    const profId = newId()
    const formula = `level*(${key}-trained ? 1 : 0) + (${key}-trained ? 2 : 0) + (${key}-expert ? 2 : 0) + (${key}-master ? 2 : 0) + (${key}-legendary ? 2 : 0)`
    const bonus = profValue > 0 ? level + profValue : 0
    props.push({ id: profId, parentId: armorProfId, type: 'skill-4', data: { subtitle: '' }, name: label, value: bonus, rank, formula, characterId: null })
    const trained = profValue >= 2
    const expert = profValue >= 4
    const master = profValue >= 6
    const legendary = profValue >= 8
    props.push({ id: newId(), parentId: profId, type: 'checkbox', data: null, name: `${key}-trained`, value: trained, rank: 1, characterId: null })
    props.push({ id: newId(), parentId: profId, type: 'checkbox', data: null, name: `${key}-expert`, value: expert, rank: 2, characterId: null })
    props.push({ id: newId(), parentId: profId, type: 'checkbox', data: null, name: `${key}-master`, value: master, rank: 3, characterId: null })
    props.push({ id: newId(), parentId: profId, type: 'checkbox', data: null, name: `${key}-legendary`, value: legendary, rank: 4, characterId: null })
  }

  addArmorProf('Unarmored', 'unarmored', prof.unarmored ?? 0, -1)
  addArmorProf('Light Armor', 'light_armor', prof.light ?? 0, 0)
  addArmorProf('Medium Armor', 'medium_armor', prof.medium ?? 0, 2)
  addArmorProf('Heavy Armor', 'heavy_armor', prof.heavy ?? 0, 3)

  // Armor section
  const armorSectionId = newId()
  props.push({ id: armorSectionId, parentId: rightColId, type: 'title-section', data: null, value: 'Armor', rank: 4, characterId: null })

  // Armor heading
  props.push({ id: newId(), parentId: armorSectionId, type: 'heading', data: null, value: 'Armor', rank: -6, characterId: null })

  // Find worn armor (exclude shields)
  const armorArray = build.armor ?? []
  const wornArmor = armorArray.find(a => a.worn && a.prof !== 'shield')
  const armorName = wornArmor?.display || wornArmor?.name || ''
  props.push({ id: newId(), parentId: armorSectionId, type: 'text', data: null, name: 'Armor Name', value: armorName, rank: -5, characterId: null })

  // Armor type checkboxes (horizontal-section)
  const armorTypeRowId = newId()
  const armorTypeLeftId = newId()
  const armorTypeRightId = newId()
  props.push({ id: armorTypeRowId, parentId: armorSectionId, type: 'horizontal-section', rank: -4, characterId: null })
  props.push({ id: armorTypeLeftId, parentId: armorTypeRowId, type: 'section', data: {}, size: 50, rank: 0, characterId: null })
  props.push({ id: armorTypeRightId, parentId: armorTypeRowId, type: 'section', data: {}, size: 50, rank: 1, characterId: null })

  // Determine armor type
  const armorProf = wornArmor?.prof || 'unarmored'
  props.push({ id: newId(), parentId: armorTypeLeftId, type: 'checkbox', data: null, name: 'Light-Armor', value: armorProf === 'light', rank: 0, characterId: null })
  props.push({ id: newId(), parentId: armorTypeLeftId, type: 'checkbox', data: null, name: 'Not-Armor', value: armorProf === 'unarmored', rank: 1, characterId: null })
  props.push({ id: newId(), parentId: armorTypeRightId, type: 'checkbox', data: null, name: 'Heavy-Armor', value: armorProf === 'heavy', rank: 0, characterId: null })
  props.push({ id: newId(), parentId: armorTypeRightId, type: 'checkbox', data: null, name: 'Medium-Armor', value: armorProf === 'medium', rank: 1, characterId: null })

  // AC Bonus (calculated from formula)
  props.push({ id: newId(), parentId: armorSectionId, type: 'number', data: null, name: 'AC Bonus', value: 0, rank: -3, formula: 'item_bonus+ (dexterity>dexterity_cap ?dexterity_cap : dexterity) +not-armor*unarmored+light-armor*light_+medium-armor*medium_+heavy-armor*heavy_+armor_potency', characterId: null })
  
  // Item Bonus - lookup from table or use fallback based on proficiency
  let baseItemBonus = 0
  let baseDexCap = 5
  
  // Use 'name' field for lookup (no rune prefix), not 'display'
  const armorLookupName = (wornArmor?.name || '').toLowerCase()
  const armorData = BASIC_ARMOR_DATA[armorLookupName]
  
  if (armorData) {
    // Found in table
    baseItemBonus = armorData.itemBonus
    baseDexCap = armorData.dexCap
  } else {
    // Fallback based on proficiency
    const fallbackMap: Record<string, {itemBonus: number, dexCap: number}> = {
      'heavy': {itemBonus: 5, dexCap: 1},
      'medium': {itemBonus: 3, dexCap: 2},
      'light': {itemBonus: 1, dexCap: 4},
      'unarmored': {itemBonus: 0, dexCap: 5}
    }
    const fallback = fallbackMap[armorProf] || {itemBonus: 0, dexCap: 5}
    baseItemBonus = fallback.itemBonus
    baseDexCap = fallback.dexCap
  }
  
  // Item bonus is just the base armor bonus (formula will add armor_potency)
  props.push({ id: newId(), parentId: armorSectionId, type: 'number', data: null, name: 'Item Bonus', value: baseItemBonus, rank: -2, characterId: null })

  // Dexterity Cap
  props.push({ id: newId(), parentId: armorSectionId, type: 'number', data: null, name: 'Dexterity Cap', value: baseDexCap, rank: -1, characterId: null })

  // Armor Potency Rune
  const armorPotency = wornArmor?.pot ?? 0
  const armorPotencyId = newId()
  props.push({ id: armorPotencyId, parentId: armorSectionId, type: 'checkboxes', data: null, name: 'Armor Potency Rune', value: armorPotency, rank: 0, characterId: null })
  props.push({ id: newId(), parentId: armorPotencyId, type: 'number', data: null, name: 'armor_potency_rune-max', value: 3, rank: 1, characterId: null })

  // Resilient Rune (from armor runes array)
  const resilientValue = wornArmor?.runes?.includes('resilient') ? 1 : wornArmor?.runes?.includes('greaterResilient') ? 2 : wornArmor?.runes?.includes('majorResilient') ? 3 : 0
  const resilientId = newId()
  props.push({ id: resilientId, parentId: armorSectionId, type: 'checkboxes', data: null, name: 'Resilient Rune', value: resilientValue, rank: 1, characterId: null })
  props.push({ id: newId(), parentId: resilientId, type: 'number', data: null, name: 'resilient_rune-max', value: 3, rank: 1, characterId: null })

  // Other Runes (placeholder paragraph)
  props.push({ id: newId(), parentId: armorSectionId, type: 'paragraph', data: null, value: '<ul><li>Other Runes</li></ul>', rank: 2, characterId: null })

  // Shield heading
  props.push({ id: newId(), parentId: armorSectionId, type: 'heading', data: null, value: 'Shield', rank: 3, characterId: null })

  // Find worn shield
  const wornShield = armorArray.find(a => a.worn && a.prof === 'shield')
  const shieldName = wornShield?.name || ''
  props.push({ id: newId(), parentId: armorSectionId, type: 'text', data: null, name: 'Shield Name', value: shieldName, rank: 4, characterId: null })

  // Shield Circumstance Bonus (from acTotal.shieldBonus)
  const shieldBonusRaw = build.acTotal?.shieldBonus
  const shieldBonus = typeof shieldBonusRaw === 'number' ? shieldBonusRaw : parseInt(shieldBonusRaw || '0') || 2
  props.push({ id: newId(), parentId: armorSectionId, type: 'number', data: null, name: 'Shield Circumstance Bonus', value: shieldBonus, rank: 6, characterId: null })

  // Shield HP Max (player-fillable)
  props.push({ id: newId(), parentId: armorSectionId, type: 'number', data: null, name: 'Shield HP Max', value: 0, rank: 7, characterId: null })

  // Shield Hardness (player-fillable)
  props.push({ id: newId(), parentId: armorSectionId, type: 'number', data: null, name: 'Shield Hardness', value: 0, rank: 8, characterId: null })

  // Backpack
  const backpackId = newId()
  props.push({ id: backpackId, parentId: rightColId, type: 'title-section', data: { collapsed: false }, value: 'Backpack', rank: 5, characterId: null })

  // Collect all backpack items
  const backpackItems: string[] = []
  
  // Add unworn armor and shields (append " Armor" to armor)
  armorArray.forEach(armorItem => {
    if (!armorItem.worn) {
      let itemName = armorItem.display || armorItem.name || 'Unknown'
      // Append " Armor" to armor (not shields)
      if (armorItem.prof !== 'shield' && !itemName.toLowerCase().includes('armor')) {
        itemName += ' Armor'
      }
      backpackItems.push(itemName)
    }
  })
  
  // Add equipment
  const equipment = build.equipment ?? []
  equipment.forEach(item => {
    const name = Array.isArray(item) ? item[0] : item
    backpackItems.push(name)
  })

  // Generate backpack HTML
  if (backpackItems.length > 0) {
    const items = backpackItems.map(item => `<li>${item}</li>`).join('')
    const backpackHTML = `<ul>${items}</ul>`
    props.push({ id: newId(), parentId: backpackId, type: 'paragraph', data: null, value: backpackHTML, rank: 0, characterId: null })
  } else {
    props.push({ id: newId(), parentId: backpackId, type: 'paragraph', data: null, value: '<ul><li>Empty</li></ul>', rank: 0, characterId: null })
  }

  return props
}
