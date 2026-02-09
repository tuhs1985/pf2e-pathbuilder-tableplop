import type { PathbuilderBuild } from '../pathbuilder'
import type { TableplopProperty } from '../tableplop'
import { makeIdAllocator } from '../idAllocator'

/**
 * Spells tab:
 * - Tradition-based grouping (Arcane, Divine, Occult, Primal)
 * - Per tradition: Spell Attack/DC, Prepared/Spontaneous/Innate sections, Focus spells
 * - Spellbook for prepared casters
 * - Auto-heightening for cantrips and focus spells
 * 
 * ID range: 70000000-89999999
 */

interface SpellEntry {
  name: string
  baseRank: number
}

interface SpellcastingEntry {
  tradition: string
  type: 'prepared' | 'spontaneous' | 'innate' | 'focus'
  casterName: string
  ability: string
  proficiency: number
  spellsByRank: Map<number, SpellEntry[]>
  preparedByRank?: Map<number, Map<string, number>> // spell name -> count
  slotsByRank?: number[] // indexed by rank
  maxRank: number
}

interface TraditionGroup {
  tradition: string
  entries: SpellcastingEntry[]
  maxProficiency: number
}

export function buildSpellsProperties(build: PathbuilderBuild): TableplopProperty[] {
  const newId = makeIdAllocator('Spells')
  const props: TableplopProperty[] = []

  // Create the Spells tab
  const spellsTabId = newId()
  props.push({ 
    id: spellsTabId, 
    parentId: null, 
    type: 'tab-section', 
    data: null, 
    value: 'Spells', 
    rank: -1, 
    characterId: null 
  })

  // Parse spellcasting data
  const traditions = parseSpellcastingData(build)
  
  if (traditions.length === 0) {
    // No spellcasting - add a placeholder
    props.push({
      id: newId(),
      parentId: spellsTabId,
      type: 'paragraph',
      data: null,
      value: '<p>No spellcasting abilities.</p>',
      rank: 0,
      characterId: null
    })
    return props
  }

  // Global focus points (appears at the top once)
  const globalFocusPoints = build.focusPoints ?? 0
  if (globalFocusPoints > 0) {
    const focusPointsId = newId()
    props.push({
      id: focusPointsId,
      parentId: spellsTabId,
      type: 'checkboxes',
      data: null,
      name: 'Focus Points',
      value: 0,
      rank: -10,
      characterId: null
    })
    props.push({
      id: newId(),
      parentId: focusPointsId,
      type: 'number',
      data: null,
      name: 'focus_points-max',
      value: globalFocusPoints,
      rank: 1,
      characterId: null
    })
  }

  // Render each tradition group
  traditions.forEach((group, tradIdx) => {
    renderTraditionGroup(group, spellsTabId, tradIdx, newId, props)
  })

  return props
}

function parseSpellcastingData(build: PathbuilderBuild): TraditionGroup[] {
  const spellCasters = build.spellCasters ?? []
  const focus = build.focus ?? {}
  
  // Map to collect entries by tradition
  const traditionMap = new Map<string, SpellcastingEntry[]>()
  
  // Parse regular spellcasters
  for (const caster of spellCasters) {
    const tradition = (caster.magicTradition || 'arcane').toLowerCase()
    const entry = parseSpellcaster(caster, build.level ?? 1)
    
    if (!traditionMap.has(tradition)) {
      traditionMap.set(tradition, [])
    }
    traditionMap.get(tradition)!.push(entry)
  }
  
  // Parse focus spells
  for (const tradition in focus) {
    const tradLower = tradition.toLowerCase()
    const abilityData = focus[tradition]
    
    for (const ability in abilityData) {
      const focusData = abilityData[ability]
      const entry = parseFocusEntry(tradLower, ability, focusData, build.level ?? 1, spellCasters)
      
      if (!traditionMap.has(tradLower)) {
        traditionMap.set(tradLower, [])
      }
      traditionMap.get(tradLower)!.push(entry)
    }
  }
  
  // Build tradition groups
  const groups: TraditionGroup[] = []
  for (const [tradition, entries] of traditionMap.entries()) {
    const maxProf = Math.max(...entries.map(e => e.proficiency))
    groups.push({ tradition, entries, maxProficiency: maxProf })
  }
  
  // Sort traditions alphabetically
  groups.sort((a, b) => a.tradition.localeCompare(b.tradition))
  
  return groups
}

function parseSpellcaster(caster: any, level: number): SpellcastingEntry {
  const tradition = (caster.magicTradition || 'arcane').toLowerCase()
  const type = (caster.spellcastingType || 'prepared').toLowerCase() as 'prepared' | 'spontaneous' | 'innate'
  const casterName = caster.name || 'Spellcaster'
  const ability = (caster.ability || 'int').toLowerCase()
  const proficiency = caster.proficiency ?? 0
  
  // Parse spells by rank
  const spellsByRank = new Map<number, SpellEntry[]>()
  const spells = caster.spells ?? []
  
  for (const rankGroup of spells) {
    const rank = rankGroup.spellLevel ?? 0
    const spellList = rankGroup.list ?? []
    
    const entries: SpellEntry[] = spellList.map((name: string) => ({
      name,
      baseRank: rank
    }))
    
    if (entries.length > 0) {
      spellsByRank.set(rank, entries)
    }
  }
  
  // Parse prepared spells (for prepared casters only)
  let preparedByRank: Map<number, Map<string, number>> | undefined
  if (type === 'prepared') {
    preparedByRank = new Map()
    const prepared = caster.prepared ?? []
    
    for (const rankGroup of prepared) {
      const rank = rankGroup.spellLevel ?? 0
      const prepList = rankGroup.list ?? []
      
      // Count occurrences
      const countMap = new Map<string, number>()
      for (const spellName of prepList) {
        if (spellName) {
          countMap.set(spellName, (countMap.get(spellName) ?? 0) + 1)
        }
      }
      
      if (countMap.size > 0) {
        preparedByRank.set(rank, countMap)
      }
    }
  }
  
  // Slots per day
  const slotsByRank = caster.perDay ?? []
  
  // Calculate max rank
  const allRanks: number[] = []
  for (const rankGroup of spells) {
    allRanks.push(rankGroup.spellLevel ?? 0)
  }
  if (caster.prepared) {
    for (const rankGroup of caster.prepared) {
      allRanks.push(rankGroup.spellLevel ?? 0)
    }
  }
  slotsByRank.forEach((count: number, idx: number) => {
    if (count > 0 && idx > 0) allRanks.push(idx)
  })
  
  const maxRank = allRanks.length > 0 ? Math.max(...allRanks) : 0
  
  return {
    tradition,
    type,
    casterName,
    ability,
    proficiency,
    spellsByRank,
    preparedByRank,
    slotsByRank,
    maxRank
  }
}

function parseFocusEntry(
  tradition: string, 
  ability: string, 
  focusData: any, 
  level: number,
  spellCasters: any[]
): SpellcastingEntry {
  const proficiency = focusData.proficiency ?? 0
  const focusCantrips = focusData.focusCantrips ?? []
  const focusSpells = focusData.focusSpells ?? []
  
  const spellsByRank = new Map<number, SpellEntry[]>()
  
  // Add cantrips
  if (focusCantrips.length > 0) {
    spellsByRank.set(0, focusCantrips.map((name: string) => ({
      name,
      baseRank: 0
    })))
  }
  
  // Add focus spells (always auto-heighten, store with baseRank > 0)
  const focusEntries: SpellEntry[] = []
  for (const spellName of focusSpells) {
    // Extract rank from name if present (e.g., "Fire Ray (Rank 5)")
    const match = spellName.match(/\(Rank (\d+)\)/)
    const baseRank = match ? parseInt(match[1], 10) : 1
    focusEntries.push({ name: spellName.replace(/\s*\(Rank \d+\)/, ''), baseRank })
  }
  
  if (focusEntries.length > 0) {
    // Group by baseRank
    const grouped = new Map<number, SpellEntry[]>()
    for (const entry of focusEntries) {
      if (!grouped.has(entry.baseRank)) {
        grouped.set(entry.baseRank, [])
      }
      grouped.get(entry.baseRank)!.push(entry)
    }
    
    for (const [rank, entries] of grouped) {
      spellsByRank.set(rank, entries)
    }
  }
  
  // Determine maxRank from same-tradition casters
  const sameTraditionCasters = spellCasters.filter(c => 
    (c.magicTradition || 'arcane').toLowerCase() === tradition
  )
  
  let maxRank = 0
  for (const caster of sameTraditionCasters) {
    const spells = caster.spells ?? []
    for (const rankGroup of spells) {
      maxRank = Math.max(maxRank, rankGroup.spellLevel ?? 0)
    }
  }
  
  // Fallback to global highest rank
  if (maxRank === 0) {
    for (const caster of spellCasters) {
      const spells = caster.spells ?? []
      for (const rankGroup of spells) {
        maxRank = Math.max(maxRank, rankGroup.spellLevel ?? 0)
      }
    }
  }
  
  // If still 0, use level-based fallback
  if (maxRank === 0) {
    maxRank = Math.max(1, Math.floor((level + 1) / 2))
  }
  
  const casterName = `${ability.toUpperCase()}`
  
  return {
    tradition,
    type: 'focus',
    casterName,
    ability,
    proficiency,
    spellsByRank,
    maxRank
  }
}

function renderTraditionGroup(
  group: TraditionGroup,
  parentId: number,
  groupIdx: number,
  newId: () => number,
  props: TableplopProperty[]
) {
  const traditionName = capitalize(group.tradition)
  
  // Tradition container title-section
  const traditionId = newId()
  props.push({
    id: traditionId,
    parentId,
    type: 'title-section',
    data: { collapsed: false },
    value: `${traditionName} Spellcasting`,
    rank: groupIdx,
    characterId: null
  })
  
  // Top row: Spell Attack and Spell DC (horizontal-section with 2 columns)
  const topRowId = newId()
  const leftColId = newId()
  const rightColId = newId()
  
  props.push({
    id: topRowId,
    parentId: traditionId,
    type: 'horizontal-section',
    data: null,
    rank: -3,
    characterId: null
  })
  props.push({
    id: leftColId,
    parentId: topRowId,
    type: 'section',
    data: null,
    rank: 0,
    size: 50,
    characterId: null
  })
  props.push({
    id: rightColId,
    parentId: topRowId,
    type: 'section',
    data: null,
    rank: 1,
    size: 50,
    characterId: null
  })
  
  // Determine ability from entries (use first entry's ability)
  const firstEntry = group.entries[0]
  if (!firstEntry) {
    // No entries, skip rendering
    return
  }
  const ability = firstEntry.ability
  const abilityShort = ability.substring(0, 3)
  const proficiency = group.maxProficiency
  
  // Spell Attack (skill-4 with proficiency pips)
  const attackId = newId()
  const attackName = `${group.tradition}_spell_attack`
  const attackFormula = `${abilityShort} + level + (${attackName}-trained ? 2 : 0) + (${attackName}-expert ? 2 : 0) + (${attackName}-master ? 2 : 0) + (${attackName}-legendary ? 2 : 0)`
  
  props.push({
    id: attackId,
    parentId: leftColId,
    type: 'skill-4',
    data: { subtitle: '' },
    name: `${traditionName} Spell Attack`,
    value: 0,
    rank: 1,
    message: `${traditionName} Spell Attack: {1d20 + ${attackName}}`,
    formula: attackFormula,
    characterId: null
  })
  
  const trained = proficiency >= 2
  const expert = proficiency >= 4
  const master = proficiency >= 6
  const legendary = proficiency >= 8
  
  props.push({ id: newId(), parentId: attackId, type: 'checkbox', data: null, name: `${attackName}-trained`, value: trained, rank: 1, characterId: null })
  props.push({ id: newId(), parentId: attackId, type: 'checkbox', data: null, name: `${attackName}-expert`, value: expert, rank: 2, characterId: null })
  props.push({ id: newId(), parentId: attackId, type: 'checkbox', data: null, name: `${attackName}-master`, value: master, rank: 3, characterId: null })
  props.push({ id: newId(), parentId: attackId, type: 'checkbox', data: null, name: `${attackName}-legendary`, value: legendary, rank: 4, characterId: null })
  
  // Spell DC (text with formula)
  const dcName = `${group.tradition}_spell_dc`
  props.push({
    id: newId(),
    parentId: rightColId,
    type: 'text',
    data: null,
    name: `${traditionName} Spell DC`,
    value: '10',
    rank: 0,
    message: `${traditionName} Spell DC: {${dcName}}`,
    formula: `${attackName}+10`,
    characterId: null
  })
  
  // Separator
  props.push({
    id: newId(),
    parentId: leftColId,
    type: 'heading',
    data: null,
    value: '===================',
    rank: -2,
    characterId: null
  })
  props.push({
    id: newId(),
    parentId: rightColId,
    type: 'heading',
    data: null,
    value: '===================',
    rank: -1,
    characterId: null
  })
  
  // Group entries by type
  const prepared = group.entries.filter(e => e.type === 'prepared')
  const spontaneous = group.entries.filter(e => e.type === 'spontaneous')
  const innate = group.entries.filter(e => e.type === 'innate')
  const focus = group.entries.filter(e => e.type === 'focus')
  
  let sectionRank = -1
  
  // Render Prepared sections
  if (prepared.length > 0) {
    const prepRowId = newId()
    const prepLeftId = newId()
    const prepRightId = newId()
    
    props.push({
      id: prepRowId,
      parentId: traditionId,
      type: 'horizontal-section',
      data: null,
      rank: sectionRank++,
      characterId: null
    })
    props.push({
      id: prepLeftId,
      parentId: prepRowId,
      type: 'section',
      data: null,
      rank: 0,
      size: 50,
      characterId: null
    })
    props.push({
      id: prepRightId,
      parentId: prepRowId,
      type: 'section',
      data: null,
      rank: 1,
      size: 50,
      characterId: null
    })
    
    // Separator
    props.push({
      id: newId(),
      parentId: prepLeftId,
      type: 'heading',
      data: null,
      value: '===================',
      rank: -2,
      characterId: null
    })
    
    prepared.forEach((entry, idx) => {
      const suffix = prepared.length > 1 ? ` - ${entry.casterName}` : ''
      renderPreparedSection(entry, prepLeftId, suffix, newId, props)
      renderSpellbookSection(entry, prepRightId, suffix, newId, props)
      
      if (idx < prepared.length - 1) {
        // Add separator between multiple prepared casters
        props.push({
          id: newId(),
          parentId: prepLeftId,
          type: 'heading',
          data: null,
          value: '===================',
          rank: 100 + idx,
          characterId: null
        })
        props.push({
          id: newId(),
          parentId: prepRightId,
          type: 'heading',
          data: null,
          value: '===================',
          rank: 100 + idx,
          characterId: null
        })
      }
    })
  }
  
  // Render Spontaneous/Innate sections (no spellbook)
  if (spontaneous.length > 0 || innate.length > 0) {
    const spRowId = newId()
    const spLeftId = newId()
    const spRightId = newId()
    
    props.push({
      id: spRowId,
      parentId: traditionId,
      type: 'horizontal-section',
      data: null,
      rank: sectionRank++,
      characterId: null
    })
    props.push({
      id: spLeftId,
      parentId: spRowId,
      type: 'section',
      data: null,
      rank: 0,
      size: 50,
      characterId: null
    })
    props.push({
      id: spRightId,
      parentId: spRowId,
      type: 'section',
      data: null,
      rank: 1,
      size: 50,
      characterId: null
    })
    
    // Separator
    props.push({
      id: newId(),
      parentId: spLeftId,
      type: 'heading',
      data: null,
      value: '===================',
      rank: -2,
      characterId: null
    })
    props.push({
      id: newId(),
      parentId: spRightId,
      type: 'heading',
      data: null,
      value: '===================',
      rank: -1,
      characterId: null
    })
    
    let colIdx = 0
    const columns = [spLeftId, spRightId]
    
    spontaneous.forEach((entry, idx) => {
      const colId = columns[colIdx % 2]
      if (colId === undefined) return
      colIdx++
      
      const suffix = spontaneous.length > 1 ? ` - ${entry.casterName}` : ''
      renderSpontaneousSection(entry, colId, suffix, newId, props)
      
      if (idx < spontaneous.length - 1) {
        props.push({
          id: newId(),
          parentId: colId,
          type: 'heading',
          data: null,
          value: '===================',
          rank: 100 + idx,
          characterId: null
        })
      }
    })
    
    innate.forEach((entry, idx) => {
      const colId = columns[colIdx % 2]
      if (colId === undefined) return
      colIdx++
      
      const suffix = innate.length > 1 ? ` - ${entry.casterName}` : ''
      renderInnateSection(entry, colId, suffix, newId, props)
      
      if (idx < innate.length - 1) {
        props.push({
          id: newId(),
          parentId: colId,
          type: 'heading',
          data: null,
          value: '===================',
          rank: 100 + idx,
          characterId: null
        })
      }
    })
  }
  
  // Render Focus sections
  if (focus.length > 0) {
    const focusRowId = newId()
    const focusLeftId = newId()
    const focusRightId = newId()
    
    props.push({
      id: focusRowId,
      parentId: traditionId,
      type: 'horizontal-section',
      data: null,
      rank: sectionRank++,
      characterId: null
    })
    props.push({
      id: focusLeftId,
      parentId: focusRowId,
      type: 'section',
      data: null,
      rank: 0,
      size: 50,
      characterId: null
    })
    props.push({
      id: focusRightId,
      parentId: focusRowId,
      type: 'section',
      data: null,
      rank: 1,
      size: 50,
      characterId: null
    })
    
    // Separator
    props.push({
      id: newId(),
      parentId: focusLeftId,
      type: 'heading',
      data: null,
      value: '===================',
      rank: -1,
      characterId: null
    })
    props.push({
      id: newId(),
      parentId: focusRightId,
      type: 'heading',
      data: null,
      value: '===================',
      rank: -1,
      characterId: null
    })
    
    let colIdx = 0
    const columns = [focusLeftId, focusRightId]
    
    focus.forEach((entry, idx) => {
      const colId = columns[colIdx % 2]
      if (colId === undefined) return
      colIdx++
      
      const suffix = focus.length > 1 ? ` - ${entry.casterName}` : ''
      renderFocusSection(entry, colId, suffix, newId, props)
      
      if (idx < focus.length - 1) {
        props.push({
          id: newId(),
          parentId: colId,
          type: 'heading',
          data: null,
          value: '===================',
          rank: 100 + idx,
          characterId: null
        })
      }
    })
  }
}

function renderPreparedSection(
  entry: SpellcastingEntry,
  parentId: number,
  suffix: string,
  newId: () => number,
  props: TableplopProperty[]
) {
  const traditionName = capitalize(entry.tradition)
  const sectionId = newId()
  
  props.push({
    id: sectionId,
    parentId,
    type: 'title-section',
    data: { collapsed: false },
    value: `${traditionName} Prepared Spells${suffix}`,
    rank: -1,
    characterId: null
  })
  
  // Get prepared spells by rank
  const preparedByRank = entry.preparedByRank ?? new Map()
  const ranks = Array.from(preparedByRank.keys()).sort((a, b) => a - b)
  
  // Render cantrips first (rank 0)
  if (preparedByRank.has(0)) {
    renderRankSection(0, preparedByRank.get(0)!, entry.maxRank, sectionId, newId, props, true)
  }
  
  // Render other ranks
  for (const rank of ranks) {
    if (rank > 0) {
      const slots = entry.slotsByRank?.[rank] ?? 0
      renderRankSection(rank, preparedByRank.get(rank)!, entry.maxRank, sectionId, newId, props, false, slots)
    }
  }
}

function renderSpellbookSection(
  entry: SpellcastingEntry,
  parentId: number,
  suffix: string,
  newId: () => number,
  props: TableplopProperty[]
) {
  const traditionName = capitalize(entry.tradition)
  const sectionId = newId()
  
  props.push({
    id: sectionId,
    parentId,
    type: 'title-section',
    data: { collapsed: false },
    value: `${traditionName} Spell Book${suffix}`,
    rank: 0,
    characterId: null
  })
  
  // Render all spells by rank
  const ranks = Array.from(entry.spellsByRank.keys()).sort((a, b) => a - b)
  
  for (const rank of ranks) {
    const spells = entry.spellsByRank.get(rank) ?? []
    if (spells.length > 0) {
      renderSpellbookRank(rank, spells, entry.maxRank, sectionId, newId, props)
    }
  }
}

function renderSpontaneousSection(
  entry: SpellcastingEntry,
  parentId: number,
  suffix: string,
  newId: () => number,
  props: TableplopProperty[]
) {
  const traditionName = capitalize(entry.tradition)
  const sectionId = newId()
  
  props.push({
    id: sectionId,
    parentId,
    type: 'title-section',
    data: { collapsed: false },
    value: `${traditionName} Spontaneous Spells${suffix}`,
    rank: 0,
    characterId: null
  })
  
  // Render all spells by rank with slots
  const ranks = Array.from(entry.spellsByRank.keys()).sort((a, b) => a - b)
  
  for (const rank of ranks) {
    const spells = entry.spellsByRank.get(rank) ?? []
    if (spells.length > 0) {
      const slots = entry.slotsByRank?.[rank] ?? 0
      const countMap = new Map<string, number>()
      spells.forEach(s => countMap.set(s.name, 1))
      renderRankSection(rank, countMap, entry.maxRank, sectionId, newId, props, rank === 0, slots)
    }
  }
}

function renderInnateSection(
  entry: SpellcastingEntry,
  parentId: number,
  suffix: string,
  newId: () => number,
  props: TableplopProperty[]
) {
  const traditionName = capitalize(entry.tradition)
  const sectionId = newId()
  
  props.push({
    id: sectionId,
    parentId,
    type: 'title-section',
    data: { collapsed: false },
    value: `${traditionName} Innate Spellcasting${suffix}`,
    rank: 0,
    characterId: null
  })
  
  // Render all spells by rank
  const ranks = Array.from(entry.spellsByRank.keys()).sort((a, b) => a - b)
  
  for (const rank of ranks) {
    const spells = entry.spellsByRank.get(rank) ?? []
    if (spells.length > 0) {
      const countMap = new Map<string, number>()
      spells.forEach(s => countMap.set(s.name, 1))
      renderRankSection(rank, countMap, entry.maxRank, sectionId, newId, props, rank === 0)
    }
  }
}

function renderFocusSection(
  entry: SpellcastingEntry,
  parentId: number,
  suffix: string,
  newId: () => number,
  props: TableplopProperty[]
) {
  const traditionName = capitalize(entry.tradition)
  const sectionId = newId()
  
  props.push({
    id: sectionId,
    parentId,
    type: 'title-section',
    data: { collapsed: true },
    value: `${traditionName} Focus Spells${suffix}`,
    rank: 0,
    characterId: null
  })
  
  // Render cantrips and focus spells separately
  const cantrips = entry.spellsByRank.get(0) ?? []
  const focusSpells = Array.from(entry.spellsByRank.entries()).filter(([r]) => r > 0)
  
  if (cantrips.length > 0) {
    const cantripId = newId()
    props.push({
      id: cantripId,
      parentId: sectionId,
      type: 'title-section',
      data: null,
      value: 'Cantrip',
      rank: 1,
      characterId: null
    })
    
    cantrips.forEach((spell, idx) => {
      const displayName = `Rank ${entry.maxRank} ${spell.name}`
      props.push({
        id: newId(),
        parentId: cantripId,
        type: 'message',
        data: null,
        name: displayName,
        icon: '/images/message.png',
        rank: idx,
        message: 'This saved message can be sent in the scene using "!m message-name"',
        characterId: null
      })
    })
  }
  
  if (focusSpells.length > 0) {
    const focusSpellId = newId()
    props.push({
      id: focusSpellId,
      parentId: sectionId,
      type: 'title-section',
      data: null,
      value: 'Focus Spell',
      rank: 2,
      characterId: null
    })
    
    // Focus spells auto-heighten to maxRank
    let msgIdx = 0
    for (const [, spells] of focusSpells) {
      for (const spell of spells) {
        const displayName = `Rank ${entry.maxRank} ${spell.name}`
        props.push({
          id: newId(),
          parentId: focusSpellId,
          type: 'message',
          data: null,
          name: displayName,
          icon: '/images/message.png',
          rank: msgIdx++,
          message: 'This saved message can be sent in the scene using "!m message-name"',
          characterId: null
        })
      }
    }
  }
}

function renderRankSection(
  rank: number,
  spellCounts: Map<string, number>,
  maxRank: number,
  parentId: number,
  newId: () => number,
  props: TableplopProperty[],
  isCantrip: boolean = false,
  slots?: number
) {
  const effectiveRank = isCantrip ? maxRank : rank
  const label = isCantrip ? 'Cantrip' : `Rank ${rank}`
  
  const rankId = newId()
  props.push({
    id: rankId,
    parentId,
    type: 'title-section',
    data: { collapsed: isCantrip ? true : false },
    value: label,
    rank: isCantrip ? 0 : rank,
    characterId: null
  })
  
  // Add slot indicator if applicable
  if (!isCantrip && slots !== undefined && slots > 0) {
    props.push({
      id: newId(),
      parentId: rankId,
      type: 'paragraph',
      data: null,
      value: `<p>Spell Slots: ${slots}</p>`,
      rank: 0,
      characterId: null
    })
  }
  
  // Render spells
  const spellNames = Array.from(spellCounts.keys()).sort()
  spellNames.forEach((spellName, idx) => {
    const count = spellCounts.get(spellName)!
    const displayName = count > 1 
      ? `Rank ${effectiveRank} ${spellName} (x${count})`
      : `Rank ${effectiveRank} ${spellName}`
    
    props.push({
      id: newId(),
      parentId: rankId,
      type: 'message',
      data: null,
      name: displayName,
      icon: '/images/message.png',
      rank: idx + 1,
      message: 'This saved message can be sent in the scene using "!m message-name"',
      characterId: null
    })
  })
}

function renderSpellbookRank(
  rank: number,
  spells: SpellEntry[],
  maxRank: number,
  parentId: number,
  newId: () => number,
  props: TableplopProperty[]
) {
  const isCantrip = rank === 0
  const effectiveRank = isCantrip ? maxRank : rank
  const label = isCantrip ? 'Cantrips' : `Rank ${rank}`
  
  const rankId = newId()
  props.push({
    id: rankId,
    parentId,
    type: 'title-section',
    data: isCantrip ? { collapsed: true } : null,
    value: label,
    rank: isCantrip ? -1 : rank,
    characterId: null
  })
  
  // Use filter-list for spellbook
  const filterListId = newId()
  props.push({
    id: filterListId,
    parentId: rankId,
    type: 'filter-list',
    data: null,
    rank: -1,
    characterId: null
  })
  
  // Sort spells alphabetically
  const sortedSpells = [...spells].sort((a, b) => a.name.localeCompare(b.name))
  
  sortedSpells.forEach((spell, idx) => {
    const displayName = `${spell.name}`
    props.push({
      id: newId(),
      parentId: filterListId,
      type: 'message',
      data: null,
      name: displayName,
      icon: '/images/message.png',
      rank: idx,
      message: 'This saved message can be sent in the scene using "!m message-name"',
      characterId: null
    })
  })
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
