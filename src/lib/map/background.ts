import type { PathbuilderBuild } from '../pathbuilder'
import type { TableplopProperty } from '../tableplop'
import { makeIdAllocator } from '../idAllocator'

/**
 * Background tab:
 * - About section (paragraph with character background/story)
 * - Hidden Values section (HP modifiers, Combat modifiers)
 */

export function buildBackgroundProperties(build: PathbuilderBuild): TableplopProperty[] {
  const newId = makeIdAllocator('Background')
  const props: TableplopProperty[] = []

  // Create the Background tab (ID 90000001)
  const backgroundTabId = newId()
  props.push({ id: backgroundTabId, parentId: null, type: 'tab-section', data: null, value: 'Background', rank: 0, characterId: null })

  // About heading
  props.push({ id: newId(), parentId: backgroundTabId, type: 'heading', data: {}, value: 'About', rank: -19, characterId: null })

  // About paragraph - comprehensive instructions
  const instructionsHtml = `<p><strong>Pathbuilder 2e ? Tableplop Exporter - User Guide</strong></p>
<p>&nbsp;</p>
<p><strong>Background Story:</strong></p>
<p>This section is for your character's background story and roleplay notes. Pathbuilder does not export background text, so you'll need to add it manually here. Feel free to replace this entire section with your character's backstory, personality traits, goals, or any other notes.</p>
<p>&nbsp;</p>
<p><strong>Armor Notes:</strong></p>
<p>The exporter recognizes most basic armors from the Core Rulebook. If your armor is not recognized, it defaults to the following values based on category:</p>
<ul>
<li><strong>Heavy Armor:</strong> Item Bonus +5, Dex Cap +1</li>
<li><strong>Medium Armor:</strong> Item Bonus +3, Dex Cap +2</li>
<li><strong>Light Armor:</strong> Item Bonus +1, Dex Cap +4</li>
<li><strong>Unarmored:</strong> Item Bonus +0, Dex Cap +5</li>
</ul>
<p>Check your Inventory tab and adjust the Item Bonus and Dex Cap manually if needed for unique armors.</p>
<p>&nbsp;</p>
<p><strong>Shield Notes:</strong></p>
<p>Pathbuilder does not export shield HP or Hardness values. You'll need to manually enter these in the Inventory tab ? Armor section ? Shield fields. Break Threshold (BT) is automatically calculated from Shield HP Max.</p>
<p>&nbsp;</p>
<p><strong>Hidden Values:</strong></p>
<p>The Hidden Values section below contains fields that are referenced in formulas throughout your character sheet:</p>
<ul>
<li><strong>HP Modifiers:</strong> Used to calculate your maximum HP automatically in the Character tab.</li>
<li><strong>Combat Modifiers:</strong> Class damage bonus is calculated upon conversion from Weapon Specialization. The Armor-Class field is used by the AC value displayed above the tabs.</li>
</ul>
<p>These fields are pre-filled from your Pathbuilder export. You generally won't need to edit them unless you gain new abilities or make manual adjustments.</p>
<p>&nbsp;</p>
<p><em>Delete these instructions once you've read them and added your character's background story above.</em></p>`
  props.push({ id: newId(), parentId: backgroundTabId, type: 'paragraph', data: {}, value: instructionsHtml, rank: -17, characterId: null })

  // Hidden Values section
  const hiddenValuesId = newId()
  props.push({ id: hiddenValuesId, parentId: backgroundTabId, type: 'title-section', data: { collapsed: false }, private: true, value: 'Hidden Values', rank: -12, characterId: null })

  // Horizontal section for two columns
  const hiddenRowId = newId()
  const leftColId = newId()
  const rightColId = newId()
  props.push({ id: hiddenRowId, parentId: hiddenValuesId, type: 'horizontal-section', data: null, rank: 6, characterId: null })
  props.push({ id: leftColId, parentId: hiddenRowId, type: 'section', data: null, rank: 0, size: 50, characterId: null })
  props.push({ id: rightColId, parentId: hiddenRowId, type: 'section', data: null, rank: 1, size: 50, characterId: null })

  // ===== LEFT COLUMN: HP Modifiers =====
  const hpModsId = newId()
  props.push({ id: hpModsId, parentId: leftColId, type: 'title-section', data: null, value: 'Hit Point Modifiers', rank: -1, characterId: null })

  // Ancestry HP
  const ancestryHp = build.attributes?.ancestryhp ?? 0
  props.push({ id: newId(), parentId: hpModsId, type: 'number', data: null, name: 'Ancestry HP', value: ancestryHp, rank: 0, characterId: null })

  // Class HP
  const classHp = build.attributes?.classhp ?? 0
  props.push({ id: newId(), parentId: hpModsId, type: 'number', data: null, name: 'Class HP', value: classHp, rank: 1, characterId: null })

  // HP per level (checkboxes widget - each check = 1 hp/level)
  const bonusHpPerLevel = build.attributes?.bonushpPerLevel ?? 0
  const hpPerLevelId = newId()
  props.push({ id: hpPerLevelId, parentId: hpModsId, type: 'checkboxes', data: null, name: 'HP per Level', value: bonusHpPerLevel, rank: 2, characterId: null })
  props.push({ id: newId(), parentId: hpPerLevelId, type: 'number', data: null, name: 'hp_per_level-max', value: 4, rank: 1, characterId: null })

  // Bonus HP
  const bonusHp = build.attributes?.bonushp ?? 0
  props.push({ id: newId(), parentId: hpModsId, type: 'number', data: null, name: 'Bonus HP', value: bonusHp, rank: 5, characterId: null })

  // ===== RIGHT COLUMN: Combat Modifiers =====
  const combatModsId = newId()
  props.push({ id: combatModsId, parentId: rightColId, type: 'title-section', data: null, value: 'Combat Modifiers', rank: 3, characterId: null })

  // AC heading and value
  props.push({ id: newId(), parentId: combatModsId, type: 'heading', data: null, value: 'Armor Class Value - Do not delete', rank: -2, characterId: null })
  props.push({ id: newId(), parentId: combatModsId, type: 'number', data: null, name: 'Armor-Class', value: 10, rank: -1, formula: '10+ac_bonus+(Shield_Raised ? shield_circumstance_bonus : 0)', characterId: null })

  // Class damage bonus - calculate from Weapon Specialization
  const classDmgBonus = calculateClassDamageBonus(build)
  props.push({ id: newId(), parentId: combatModsId, type: 'number', data: null, name: 'Class dmg bonus', value: classDmgBonus, rank: 3, characterId: null })

  // Other damage bonus (player-managed)
  props.push({ id: newId(), parentId: combatModsId, type: 'number', data: null, name: 'Other dmg bonus', value: 0, rank: 4, characterId: null })

  return props
}

/**
 * Calculate class damage bonus based on Weapon Specialization
 * - Weapon Specialization: +2 (expert), +3 (master), +4 (legendary)
 * - Greater Weapon Specialization: +4 (expert), +6 (master), +8 (legendary)
 */
function calculateClassDamageBonus(build: PathbuilderBuild): number {
  const specials = build.specials ?? []
  const prof = build.proficiencies ?? {}
  
  // Check if character has Weapon Specialization or Greater Weapon Specialization
  const hasWeaponSpec = specials.some(s => s.toLowerCase().includes('weapon specialization') && !s.toLowerCase().includes('greater'))
  const hasGreaterWeaponSpec = specials.some(s => s.toLowerCase().includes('greater weapon specialization'))
  
  if (!hasWeaponSpec && !hasGreaterWeaponSpec) {
    return 0
  }
  
  // Find highest weapon proficiency level
  const weaponProfs = [
    prof.simple ?? 0,
    prof.martial ?? 0,
    prof.advanced ?? 0,
    prof.unarmed ?? 0
  ]
  const highestProf = Math.max(...weaponProfs)
  
  // Determine damage bonus based on specialization type and proficiency
  if (hasGreaterWeaponSpec) {
    // Greater Weapon Specialization
    if (highestProf >= 8) return 8 // Legendary
    if (highestProf >= 6) return 6 // Master
    if (highestProf >= 4) return 4 // Expert
    return 0
  } else if (hasWeaponSpec) {
    // Regular Weapon Specialization
    if (highestProf >= 8) return 4 // Legendary
    if (highestProf >= 6) return 3 // Master
    if (highestProf >= 4) return 2 // Expert
    return 0
  }
  
  return 0
}
