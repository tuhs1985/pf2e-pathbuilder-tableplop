import type { PathbuilderBuild } from '../pathbuilder'
import type { TableplopCharacter, TableplopProperty } from '../tableplop'
import { makeIdAllocator } from '../idAllocator'
import { buildInventoryProperties } from './inventory'
import { buildFeatsProperties } from './feats'
import { buildBackgroundProperties } from './background'

/**
 * Character tab (full):
 * - Containers (tab → row → columns)
 * - Character Details
 * - Ability Scores
 * - Combat Info (HP, AC, Speed, Saves, Perception, Class DC, Languages)
 * - Skills (all 16 core skills)
 * - Lores (dynamic from Pathbuilder)
 */
export function buildCharacterExport(build: PathbuilderBuild): TableplopCharacter {
  const newId = makeIdAllocator('Character')
  const level = build.level ?? 1

  // Ability mods
  const mods = {
    str: Math.floor((build.abilities.str - 10) / 2),
    dex: Math.floor((build.abilities.dex - 10) / 2),
    con: Math.floor((build.abilities.con - 10) / 2),
    int: Math.floor((build.abilities.int - 10) / 2),
    wis: Math.floor((build.abilities.wis - 10) / 2),
    cha: Math.floor((build.abilities.cha - 10) / 2),
  }

  // Calculate bonuses
  function calcBonus(prof: number, abilityMod: number, itemBonus = 0): number {
    if (prof === 0) return abilityMod + itemBonus
    return level + prof + abilityMod + itemBonus
  }

  const prof = build.proficiencies ?? {}

  // Containers - match example structure (67% left, 33% right)
  const tabId = newId()
  const rowId = newId()
  const leftColId = newId()
  const rightColId = newId()

  const props: TableplopProperty[] = [
    { id: tabId, parentId: null, type: 'tab-section', data: {}, value: 'Character', rank: -4, characterId: null },
    { id: rowId, parentId: tabId, type: 'horizontal-section', rank: -2, characterId: null },
    { id: leftColId, parentId: rowId, type: 'section', data: {}, size: 67, rank: 11, characterId: null },
    { id: rightColId, parentId: rowId, type: 'section', data: {}, size: 33, rank: 11, characterId: null },
  ]

  // ===== LEFT COLUMN =====

  // Hero Points (at the top, rank -28)
  const heroPointsId = newId()
  props.push({ id: heroPointsId, parentId: leftColId, type: 'checkboxes', data: null, name: 'Heropoints', value: 1, rank: -28, characterId: null })
  props.push({ id: newId(), parentId: heroPointsId, type: 'number', data: null, name: 'heropoints-max', value: 3, rank: 1, characterId: null })

  // Character Details (rank -27)
  const charDetailsId = newId()
  props.push({ id: charDetailsId, parentId: leftColId, type: 'title-section', data: { collapsed: false }, value: 'Character Details', rank: -27, characterId: null })
  
  // Character Details has its own horizontal-section with two columns
  const charDetailsRowId = newId()
  const charDetailsLeftId = newId()
  const charDetailsRightId = newId()
  props.push({ id: charDetailsRowId, parentId: charDetailsId, type: 'horizontal-section', rank: 0, characterId: null })
  props.push({ id: charDetailsLeftId, parentId: charDetailsRowId, type: 'section', data: {}, size: 50, rank: 0, characterId: null })
  props.push({ id: charDetailsRightId, parentId: charDetailsRowId, type: 'section', data: {}, size: 50, rank: 1, characterId: null })
  
  // Left side fields
  props.push({ id: newId(), parentId: charDetailsLeftId, type: 'number', data: {}, name: 'Level', value: level, rank: -2, characterId: null })
  props.push({ id: newId(), parentId: charDetailsLeftId, type: 'text', data: null, name: 'Name', value: build.name || '', rank: 0, characterId: null })
  props.push({ id: newId(), parentId: charDetailsLeftId, type: 'text', data: null, name: 'Ancestry', value: build.ancestry || '', rank: 1, characterId: null })
  props.push({ id: newId(), parentId: charDetailsLeftId, type: 'text', data: null, name: 'Background', value: build.background || '', rank: 3, characterId: null })
  
  // Right side fields
  props.push({ id: newId(), parentId: charDetailsRightId, type: 'number', data: null, name: 'Experience', value: build.xp ?? 0, rank: -2, characterId: null })
  props.push({ id: newId(), parentId: charDetailsRightId, type: 'text', data: null, name: 'Class', value: build.class || '', rank: 0, characterId: null })
  props.push({ id: newId(), parentId: charDetailsRightId, type: 'text', data: null, name: 'Heritage', value: build.heritage || '', rank: 1, characterId: null })
  props.push({ id: newId(), parentId: charDetailsRightId, type: 'text', data: null, name: 'Nationality', value: '', rank: 2, characterId: null })

  // Ability Scores (rank -25)
  const abilityTitleId = newId()
  props.push({ id: abilityTitleId, parentId: leftColId, type: 'title-section', data: { collapsed: false }, value: 'Ability Scores', rank: -25, characterId: null })

  function addAbility(abilityName: 'Strength'|'Dexterity'|'Constitution'|'Intelligence'|'Wisdom'|'Charisma', scoreName: string, scoreValue: number, rank: number, abilityKey: string) {
    const parentId = newId()
    props.push({
      id: parentId,
      parentId: abilityTitleId,
      type: 'ability',
      data: null,
      name: abilityName,
      value: 0,
      rank,
      formula: `floor ((${scoreName} - 10) / 2)`,
      characterId: null
    })
    props.push({
      id: newId(),
      parentId,
      type: 'number',
      data: null,
      name: scoreName,
      value: scoreValue,
      rank: 0,
      characterId: null
    })
    // Key ability checkbox
    const isKeyAbility = (build.keyability?.toLowerCase() === abilityKey.toLowerCase())
    const keyAbName = `KeyAb${abilityKey.charAt(0).toUpperCase() + abilityKey.slice(1)}`
    props.push({
      id: newId(),
      parentId,
      type: 'checkbox',
      data: null,
      name: keyAbName,
      value: isKeyAbility,
      rank: 1,
      characterId: null
    })
  }

  addAbility('Strength', 'strength-score', build.abilities.str, -1, 'str')
  addAbility('Dexterity', 'dexterity-score', build.abilities.dex, 0, 'dex')
  addAbility('Constitution', 'constitution-score', build.abilities.con, 1, 'con')
  addAbility('Intelligence', 'intelligence-score', build.abilities.int, 2, 'int')
  addAbility('Wisdom', 'wisdom-score', build.abilities.wis, 3, 'wis')
  addAbility('Charisma', 'charisma-score', build.abilities.cha, 4, 'cha')

  // Dying/Wounded horizontal-section (rank 12 under Ability Scores)
  const dyingWoundedRowId = newId()
  const dyingColId = newId()
  const woundedColId = newId()
  props.push({ id: dyingWoundedRowId, parentId: abilityTitleId, type: 'horizontal-section', rank: 12, characterId: null })
  props.push({ id: dyingColId, parentId: dyingWoundedRowId, type: 'section', data: {}, size: 50, rank: 0, characterId: null })
  props.push({ id: woundedColId, parentId: dyingWoundedRowId, type: 'section', data: {}, size: 50, rank: 1, characterId: null })

  const dyingId = newId()
  props.push({ id: dyingId, parentId: dyingColId, type: 'checkboxes', data: null, name: 'Dieing', value: 0, rank: 0, message: 'Death Save: {1d20 > @:10+dieing:}', characterId: null })
  props.push({ id: newId(), parentId: dyingId, type: 'number', data: null, name: 'dieing-max', value: 4, rank: 1, characterId: null })

  const woundedId = newId()
  props.push({ id: woundedId, parentId: woundedColId, type: 'checkboxes', data: null, name: 'Wounded', value: 0, rank: 1, characterId: null })
  props.push({ id: newId(), parentId: woundedId, type: 'number', data: null, name: 'wounded-max', value: 4, rank: 1, characterId: null })

  // Combat Info (rank -21, nested under left column)
  const combatInfoId = newId()
  props.push({ id: combatInfoId, parentId: leftColId, type: 'title-section', data: { collapsed: false }, value: 'Combat Info', rank: -21, characterId: null })

  // Combat Info has its own horizontal-section with two columns
  const combatRowId = newId()
  const combatLeftId = newId()
  const combatRightId = newId()
  props.push({ id: combatRowId, parentId: combatInfoId, type: 'horizontal-section', rank: 0, characterId: null })
  props.push({ id: combatLeftId, parentId: combatRowId, type: 'section', data: {}, size: 50, rank: 0, characterId: null })
  props.push({ id: combatRightId, parentId: combatRowId, type: 'section', data: {}, size: 50, rank: 1, characterId: null })

  // Immunities/Resistance/Weakness horizontal-section (rank 1 under Combat Info)
  const irrRowId = newId()
  props.push({ id: irrRowId, parentId: combatInfoId, type: 'horizontal-section', rank: 1, characterId: null })
  
  // Create the two columns
  const irrLeftColId = newId()
  const irrRightColId = newId()
  props.push({ id: irrLeftColId, parentId: irrRowId, type: 'section', data: {}, size: 33.19, rank: 0, characterId: null })
  props.push({ id: irrRightColId, parentId: irrRowId, type: 'section', data: {}, size: 66.81, rank: 1, characterId: null })
  
  // Immunities (in left column)
  const immunitiesId = newId()
  props.push({ id: immunitiesId, parentId: irrLeftColId, type: 'title-section', data: { collapsed: false }, value: 'Immunities', rank: 0, characterId: null })
  props.push({ id: newId(), parentId: immunitiesId, type: 'paragraph', data: null, value: '<p>None</p>', rank: 0, characterId: null })
  
  // Right column has another horizontal-section for Resistance and Weakness
  const rrRowId = newId()
  props.push({ id: rrRowId, parentId: irrRightColId, type: 'horizontal-section', rank: 0, characterId: null })
  
  const resColId = newId()
  const weakColId = newId()
  props.push({ id: resColId, parentId: rrRowId, type: 'section', data: {}, size: 50, rank: 0, characterId: null })
  props.push({ id: weakColId, parentId: rrRowId, type: 'section', data: {}, size: 50, rank: 1, characterId: null })
  
  // Resistance
  const resistanceId = newId()
  props.push({ id: resistanceId, parentId: resColId, type: 'title-section', data: { collapsed: false }, value: 'Resistance', rank: 0, characterId: null })
  props.push({ id: newId(), parentId: resistanceId, type: 'paragraph', data: null, value: '<p>None</p>', rank: 0, characterId: null })
  
  // Weakness
  const weaknessId = newId()
  props.push({ id: weaknessId, parentId: weakColId, type: 'title-section', data: { collapsed: false }, value: 'Weakness', rank: 0, characterId: null })
  props.push({ id: newId(), parentId: weaknessId, type: 'paragraph', data: null, value: '<p>None</p>', rank: 0, characterId: null })

  // Left combat column: HP, Class DC, Perception, Precise Senses, Saves
  // HP
  const ancestryHP = build.attributes?.ancestryhp ?? 10
  const classHP = build.attributes?.classhp ?? 8
  const bonusHP = build.attributes?.bonushp ?? 0
  const bonusHPPerLevel = build.attributes?.bonushpPerLevel ?? 0
  const maxHP = ancestryHP + (classHP + mods.con + bonusHPPerLevel) * level + bonusHP
  const hpId = newId()
  const hpMaxId = newId()
  const hpTempId = newId()
  props.push({ id: hpId, parentId: combatLeftId, type: 'health', data: null, name: 'hit-points', value: maxHP, rank: -10, characterId: null })
  props.push({ id: hpMaxId, parentId: hpId, type: 'number', data: null, name: 'hit-points-maximum', value: maxHP, rank: 1, formula: '(class_hp+con)*level + ancestry_hp + level*hp_per_level + bonus_hp', characterId: null })
  props.push({ id: hpTempId, parentId: hpId, type: 'number', data: null, name: 'hit-points-temporary', value: 0, rank: 2, characterId: null })

  // Class DC Modifier (as skill-4 with proficiency pips)
  const classDcProf = prof.classDC ?? 0
  const classDcBonus = calcBonus(classDcProf, 0, 0) // Will be recalculated by formula
  const classDcId = newId()
  // Formula checks key ability (we'll use a simplified version that just adds the appropriate ability based on keyability from Pathbuilder)
  const classDcFormula = `(keyAbStr ? str : 0) + (keyAbDex ? dex : 0) + (keyAbCon ? con : 0) + (keyAbInt ? int : 0) + (keyAbWis ? wis : 0) + (keyAbCha ? cha : 0) + level*(class_dc_modifier-trained ? 1 : 0) + (class_dc_modifier-trained ? 2 : 0) + (class_dc_modifier-expert ? 2 : 0) + (class_dc_modifier-master ? 2 : 0) + (class_dc_modifier-legendary ? 2 : 0)`
  props.push({ id: classDcId, parentId: combatLeftId, type: 'skill-4', data: { subtitle: '' }, name: 'Class DC Modifier', value: classDcBonus, rank: -9, formula: classDcFormula, characterId: null })
  const classDcTrained = classDcProf >= 2
  const classDcExpert = classDcProf >= 4
  const classDcMaster = classDcProf >= 6
  const classDcLegendary = classDcProf >= 8
  props.push({ id: newId(), parentId: classDcId, type: 'checkbox', data: null, name: 'class_dc_modifier-trained', value: classDcTrained, rank: 1, characterId: null })
  props.push({ id: newId(), parentId: classDcId, type: 'checkbox', data: null, name: 'class_dc_modifier-expert', value: classDcExpert, rank: 2, characterId: null })
  props.push({ id: newId(), parentId: classDcId, type: 'checkbox', data: null, name: 'class_dc_modifier-master', value: classDcMaster, rank: 3, characterId: null })
  props.push({ id: newId(), parentId: classDcId, type: 'checkbox', data: null, name: 'class_dc_modifier-legendary', value: classDcLegendary, rank: 4, characterId: null })

  // Perception (as skill-4)
  const perceptionBonus = calcBonus(prof.perception ?? 0, mods.wis)
  addSave('Perception', 'perception', perceptionBonus, prof.perception ?? 0, 'wisdom', combatLeftId, -8, 'Perception : {1d20 + per}')

  // Precise Senses - extract vision types from specials
  const specials = build.specials ?? []
  const visionTypes = specials.filter(s => 
    s.toLowerCase().includes('darkvision') || 
    s.toLowerCase().includes('low-light vision') ||
    s.toLowerCase().includes('lowlight vision') ||
    s.toLowerCase().includes('low light vision')
  )
  const preciseSensesValue = visionTypes.join(', ')
  props.push({ id: newId(), parentId: combatLeftId, type: 'text', data: null, name: 'Precise Senses', value: preciseSensesValue, rank: -7, characterId: null })

  // Saves (with -save suffix and updated ranks)
  const fortBonus = calcBonus(prof.fortitude ?? 0, mods.con)
  const refBonus = calcBonus(prof.reflex ?? 0, mods.dex)
  const willBonus = calcBonus(prof.will ?? 0, mods.wis)
  addSave('Fortitude-Save', 'fortitude-save', fortBonus, prof.fortitude ?? 0, 'constitution', combatLeftId, -6, 'Fort save: {1d20 + fortitude-save}')
  addSave('Will-Save', 'will-save', willBonus, prof.will ?? 0, 'wisdom', combatLeftId, -5, 'Will save: {1d20 + will-save}')
  addSave('Reflex-Save', 'reflex-save', refBonus, prof.reflex ?? 0, 'dexterity', combatLeftId, -4, 'Reflex save: {1d20 + reflex-save}')

  function addSave(label: string, name: string, bonus: number, profValue: number, abilityKey: string, parentId: number, rank: number, message?: string) {
    const saveId = newId()
    const abilityName = abilityKey.toLowerCase().substring(0, 3) // 'wis', 'con', 'dex', etc.
    const formula = `level + ${abilityName} + (${name}-trained ? 2 : 0) + (${name}-expert ? 2 : 0) + (${name}-master ? 2 : 0) + (${name}-legendary ? 2 : 0) + resilient_rune`
    props.push({ id: saveId, parentId, type: 'skill-4', data: { subtitle: '' }, name: label, value: bonus, rank, formula, message, characterId: null })
    const trained = profValue >= 2
    const expert = profValue >= 4
    const master = profValue >= 6
    const legendary = profValue >= 8
    props.push({ id: newId(), parentId: saveId, type: 'checkbox', data: null, name: `${name}-trained`, value: trained, rank: 1, characterId: null })
    props.push({ id: newId(), parentId: saveId, type: 'checkbox', data: null, name: `${name}-expert`, value: expert, rank: 2, characterId: null })
    props.push({ id: newId(), parentId: saveId, type: 'checkbox', data: null, name: `${name}-master`, value: master, rank: 3, characterId: null })
    props.push({ id: newId(), parentId: saveId, type: 'checkbox', data: null, name: `${name}-legendary`, value: legendary, rank: 4, characterId: null })
  }

  // Right combat column: Shield HP, Hardness, Break Threshold, AC, Shield Raised, Speed, Movement
  // Shield
  const shieldHPId = newId()
  props.push({ id: shieldHPId, parentId: combatRightId, type: 'health', data: null, name: 'Shield-hit-points', value: 0, rank: -5, characterId: null })
  props.push({ id: newId(), parentId: shieldHPId, type: 'number', data: null, name: 'shield-hit-points-maximum', value: 0, rank: 1, formula: 'shield_hp_max', characterId: null })
  props.push({ id: newId(), parentId: combatRightId, type: 'number', data: null, name: 'Hardness', value: 0, rank: -3, formula: 'shield_hardness', characterId: null })
  props.push({ id: newId(), parentId: combatRightId, type: 'number', data: null, name: 'Break Threshold', value: 0, rank: -2, formula: 'shield_hp_max/2', characterId: null })

  // AC
  const ac = build.acTotal?.acTotal ?? 10
  props.push({ id: newId(), parentId: combatRightId, type: 'number', data: null, name: 'Armor Class', value: ac, rank: 0, formula: '10+ac_bonus+(Shield_Raised ? shield_circumstance_bonus : 0)', characterId: null })
  
  // Shield Raised (below AC)
  props.push({ id: newId(), parentId: combatRightId, type: 'checkbox', data: null, name: 'Shield Raised', value: false, rank: 2, characterId: null })

  // Speed
  const speed = (build.attributes?.speed ?? 30) + (build.attributes?.speedBonus ?? 0)
  props.push({ id: newId(), parentId: combatRightId, type: 'number', data: null, name: 'Speed', value: speed, rank: 3, characterId: null })
  
  // Additional movement speeds (player-fillable paragraph)
  props.push({ id: newId(), parentId: combatRightId, type: 'paragraph', data: null, value: '<p>Climb speed 0; Fly speed 0; Swim speed 0</p>', rank: 4, characterId: null })

  // Languages (rank -19 under left column)
  const languagesId = newId()
  props.push({ id: languagesId, parentId: leftColId, type: 'title-section', data: { collapsed: false }, value: 'Languages', rank: -19, characterId: null })
  const languages = build.languages?.filter(l => l && l !== 'None selected') ?? []
  const langHTML = languages.length > 0 ? `<p>${languages.join(', ')}</p>` : '<p>Common</p>'
  props.push({ id: newId(), parentId: languagesId, type: 'paragraph', data: null, value: langHTML, rank: 0, characterId: null })

  // Notes section (rank -18, player-fillable)
  props.push({ id: newId(), parentId: leftColId, type: 'paragraph', data: null, value: '<h3>Notes:</h3><p>(Example: +5 Speed from Fleet)</p>', rank: -18, characterId: null })

  // ===== RIGHT COLUMN =====

  // Skills (rank 22)
  const skillsId = newId()
  props.push({ id: skillsId, parentId: rightColId, type: 'title-section', data: { collapsed: false }, value: 'Skills', rank: 22, characterId: null })

  const skills: Array<{name: string, key: string, ability: keyof typeof mods, rank: number}> = [
    { name: 'Acrobatics', key: 'acrobatics', ability: 'dex', rank: -18 },
    { name: 'Arcana', key: 'arcana', ability: 'int', rank: -17 },
    { name: 'Athletics', key: 'athletics', ability: 'str', rank: -16 },
    { name: 'Crafting', key: 'crafting', ability: 'int', rank: -15 },
    { name: 'Deception', key: 'deception', ability: 'cha', rank: -14 },
    { name: 'Diplomacy', key: 'diplomacy', ability: 'cha', rank: -13 },
    { name: 'Intimidation', key: 'intimidation', ability: 'cha', rank: -12 },
    { name: 'Medicine', key: 'medicine', ability: 'wis', rank: -7 },
    { name: 'Nature', key: 'nature', ability: 'wis', rank: -6 },
    { name: 'Occultism', key: 'occultism', ability: 'int', rank: -5 },
    { name: 'Performance', key: 'performance', ability: 'cha', rank: -4 },
    { name: 'Religion', key: 'religion', ability: 'wis', rank: -3 },
    { name: 'Society', key: 'society', ability: 'int', rank: -2 },
    { name: 'Stealth', key: 'stealth', ability: 'dex', rank: -1 },
    { name: 'Survival', key: 'survival', ability: 'wis', rank: 1 },
    { name: 'Thievery', key: 'thievery', ability: 'dex', rank: 2 },
  ]

  for (const skill of skills) {
    const profVal = prof[skill.key] ?? 0
    const bonus = calcBonus(profVal, mods[skill.ability])
    addSkill(skill.name, skill.key, skill.ability, bonus, profVal, skill.rank)
  }

  function addSkill(label: string, key: string, abilityKey: string, bonus: number, profValue: number, rank: number) {
    const skillId = newId()
    const formula = `${abilityKey} + level*(${key}-trained ? 1 : 0) + (${key}-trained ? 2 : 0) + (${key}-expert ? 2 : 0) + (${key}-master ? 2 : 0) + (${key}-legendary ? 2 : 0)`
    const message = `${label}: {1d20 + ${key.substring(0, 4)}}`
    props.push({ id: skillId, parentId: skillsId, type: 'skill-4', data: { subtitle: '' }, name: label, value: bonus, rank, formula, message, characterId: null })
    const trained = profValue >= 2
    const expert = profValue >= 4
    const master = profValue >= 6
    const legendary = profValue >= 8
    props.push({ id: newId(), parentId: skillId, type: 'checkbox', data: null, name: `${key}-trained`, value: trained, rank: 1, characterId: null })
    props.push({ id: newId(), parentId: skillId, type: 'checkbox', data: null, name: `${key}-expert`, value: expert, rank: 2, characterId: null })
    props.push({ id: newId(), parentId: skillId, type: 'checkbox', data: null, name: `${key}-master`, value: master, rank: 3, characterId: null })
    props.push({ id: newId(), parentId: skillId, type: 'checkbox', data: null, name: `${key}-legendary`, value: legendary, rank: 4, characterId: null })
  }

  // Lores (rank 23, after Skills)
  if (build.lores && build.lores.length > 0) {
    const loresId = newId()
    props.push({ id: loresId, parentId: rightColId, type: 'title-section', data: { collapsed: false }, value: 'Lores', rank: 23, characterId: null })
    
    for (const [loreName, loreProf] of build.lores) {
      const loreKey = loreName.toLowerCase().replace(/\s+/g, '_') + '_lore'
      const loreBonus = calcBonus(loreProf, mods.int)
      const loreId = newId()
      const formula = `intelligence + level*(${loreKey}-trained ? 1 : 0) + (${loreKey}-trained ? 2 : 0) + (${loreKey}-expert ? 2 : 0) + (${loreKey}-master ? 2 : 0) + (${loreKey}-legendary ? 2 : 0)`
      const message = `${loreName} Lore: {1d20 + ${loreKey}}`
      props.push({ id: loreId, parentId: loresId, type: 'skill-4', data: { subtitle: '' }, name: `${loreName} Lore`, value: loreBonus, rank: 0, formula, message, characterId: null })
      const trained = loreProf >= 2
      const expert = loreProf >= 4
      const master = loreProf >= 6
      const legendary = loreProf >= 8
      props.push({ id: newId(), parentId: loreId, type: 'checkbox', data: null, name: `${loreKey}-trained`, value: trained, rank: 1, characterId: null })
      props.push({ id: newId(), parentId: loreId, type: 'checkbox', data: null, name: `${loreKey}-expert`, value: expert, rank: 2, characterId: null })
      props.push({ id: newId(), parentId: loreId, type: 'checkbox', data: null, name: `${loreKey}-master`, value: master, rank: 3, characterId: null })
      props.push({ id: newId(), parentId: loreId, type: 'checkbox', data: null, name: `${loreKey}-legendary`, value: legendary, rank: 4, characterId: null })
    }
  }

  // Appearance widget (rank 24, after Lores)
  props.push({ id: newId(), parentId: rightColId, type: 'appearance', data: { appearances: [] }, rank: 24, characterId: null })

  // Add Inventory tab and its properties
  const inventoryProps = buildInventoryProperties(build)
  inventoryProps.forEach(prop => props.push(prop))

  // Add Feats tab and its properties
  const featsProps = buildFeatsProperties(build)
  featsProps.forEach(prop => props.push(prop))

  // Add Background tab and its properties
  const backgroundProps = buildBackgroundProperties(build)
  backgroundProps.forEach(prop => props.push(prop))

  const character = {
    type: 'tableplop-character-v2' as const,
    private: false,
    properties: props
  }
  return character
}