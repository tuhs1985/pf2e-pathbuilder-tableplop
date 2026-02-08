import type { PathbuilderBuild } from '../pathbuilder'
import type { TableplopProperty } from '../tableplop'
import { makeIdAllocator } from '../idAllocator'

/**
 * Feats tab:
 * - Class & Ancestry Features (paragraph list from specials)
 * - Class Feats (text fields by level)
 * - Archetype (text fields by level, from "Free Archetype" slot)
 * - Ancestry Paragon (text fields by level, from "Ancestry Paragon" slot)
 * - Skill Feats (text fields by level)
 * - General Feats (text fields by level)
 * - Ancestry Feats (text fields by level)
 * - Bonus Feats (text fields for other awarded feats)
 */

interface ProcessedFeat {
  name: string
  subChoice: string | null
  type: string
  level: number
  slot: string
  section: 'class' | 'archetype' | 'ancestryParagon' | 'skill' | 'general' | 'ancestry' | 'bonus'
  isParent?: boolean
  childName?: string
}

export function buildFeatsProperties(build: PathbuilderBuild): TableplopProperty[] {
  const newId = makeIdAllocator('Feats')
  const props: TableplopProperty[] = []

  // Create the Feats tab first (ID 50000001)
  const featsTabId = newId()
  props.push({ id: featsTabId, parentId: null, type: 'tab-section', data: {}, value: 'Feats', rank: -2, characterId: null })

  // Main horizontal-section (parented to feats tab)
  const mainRowId = newId()
  const leftColId = newId()
  const rightColId = newId()
  props.push({ id: mainRowId, parentId: featsTabId, type: 'horizontal-section', rank: -1, characterId: null })
  props.push({ id: leftColId, parentId: mainRowId, type: 'section', data: {}, size: 50, rank: 0, characterId: null })
  props.push({ id: rightColId, parentId: mainRowId, type: 'section', data: {}, size: 50, rank: 1, characterId: null })

  // ===== LEFT COLUMN =====

  // Class & Ancestry Features (from specials array)
  const featuresId = newId()
  props.push({ id: featuresId, parentId: leftColId, type: 'title-section', data: { collapsed: true }, value: 'Class & Ancestry Features', rank: 0, characterId: null })

  const specials = build.specials ?? []
  if (specials.length > 0) {
    const items = specials.map(s => `<li>${s}</li>`).join('')
    const html = `<ul>${items}</ul>`
    props.push({ id: newId(), parentId: featuresId, type: 'paragraph', data: null, value: html, rank: 0, characterId: null })
  } else {
    props.push({ id: newId(), parentId: featuresId, type: 'paragraph', data: null, value: '<ul><li>None</li></ul>', rank: 0, characterId: null })
  }

  // Process feats from Pathbuilder
  const feats = build.feats ?? []
  const processedFeats: ProcessedFeat[] = []
  const parentChildMap = new Map<string, string>() // parentSlot -> childFeatName
  const childFeats = new Set<string>() // Track child feat names to skip them

  // First pass: identify parent-child relationships and child feats to skip
  feats.forEach(feat => {
    const [name, subChoice, type, level, slot, choiceType, parentSlot] = feat
    if (choiceType === 'childChoice') {
      // This is a child feat, mark it to be skipped
      childFeats.add(name)
      
      // The 7th element (parentSlot) contains the parent's slot for child feats
      if (parentSlot) {
        parentChildMap.set(parentSlot, name)
      }
    }
  })

  // Second pass: process feats into sections
  feats.forEach(feat => {
    const [name, subChoice, type, level, slot, choiceType] = feat
    
    // Skip child feats (they're added as part of their parent)
    if (childFeats.has(name)) return

    // Ensure slot is a string (defensive check)
    const slotStr = slot || ''

    // Determine section based on TYPE first (most reliable)
    let section: ProcessedFeat['section'] = 'bonus'
    
    if (slotStr.includes('Free Archetype')) {
      section = 'archetype'
    } else if (slotStr.includes('Ancestry Paragon')) {
      section = 'ancestryParagon'
    } else if (type === 'Skill Feat') {
      section = 'skill'
    } else if (type === 'General Feat') {
      section = 'general'
    } else if (type === 'Ancestry Feat' || type === 'Heritage') {
      // Heritage feats are treated as Ancestry feats
      section = 'ancestry'
    } else if (type === 'Class Feat') {
      section = 'class'
    }

    // Check if this is a parent feat
    const childName = parentChildMap.get(slotStr)
    
    processedFeats.push({
      name,
      subChoice,
      type,
      level,
      slot: slotStr,
      section,
      isParent: !!childName,
      childName
    })
  })

  // Group feats by section and level
  const sections = {
    class: new Map<number, ProcessedFeat[]>(),
    archetype: new Map<number, ProcessedFeat[]>(),
    ancestryParagon: new Map<number, ProcessedFeat[]>(),
    skill: new Map<number, ProcessedFeat[]>(),
    general: new Map<number, ProcessedFeat[]>(),
    ancestry: new Map<number, ProcessedFeat[]>(),
    bonus: new Map<number, ProcessedFeat[]>()
  }

  processedFeats.forEach(feat => {
    const sectionMap = sections[feat.section]
    if (!sectionMap.has(feat.level)) {
      sectionMap.set(feat.level, [])
    }
    sectionMap.get(feat.level)!.push(feat)
  })

  // Helper to format feat value
  function formatFeatValue(feat: ProcessedFeat): string {
    let value = feat.name
    
    // Add child feat in parentheses for parent-child feats (e.g., "Advanced Defender (Taunting Strike)")
    if (feat.isParent && feat.childName) {
      value += ` (${feat.childName})`
    }
    // Add sub-choice in parentheses if no child (e.g., "Assurance (Athletics)")
    else if (feat.subChoice) {
      value += ` (${feat.subChoice})`
    }
    
    return value
  }

  // Helper to extract class name from slot
  function getClassNameFromSlot(slot: string): string {
    // Extract class name from slot like "Magus Feat 8" -> "Magus"
    const match = slot.match(/^([A-Za-z]+) Feat \d+/)
    return (match && match[1]) ? match[1] : 'Class'
  }

  // Class Feats (only if there are class feats)
  if (sections.class.size > 0) {
    const classFeatsId = newId()
    props.push({ id: classFeatsId, parentId: leftColId, type: 'title-section', data: { collapsed: true }, value: 'Class Feats', rank: 1, characterId: null })

    const classLevels = Array.from(sections.class.keys()).sort((a, b) => a - b)
    classLevels.forEach(level => {
      const feats = sections.class.get(level)!
      feats.forEach(feat => {
        const className = getClassNameFromSlot(feat.slot)
        const name = `${className} ${level}`
        const value = formatFeatValue(feat)
        props.push({ id: newId(), parentId: classFeatsId, type: 'text', data: null, name, value, rank: level, characterId: null })
      })
    })
  }

  // Archetype Feats (only if there are archetype feats)
  if (sections.archetype.size > 0) {
    const archetypeId = newId()
    props.push({ id: archetypeId, parentId: leftColId, type: 'title-section', data: { collapsed: true }, value: 'Archetype Feat', rank: 2, characterId: null })

    const archetypeLevels = Array.from(sections.archetype.keys()).sort((a, b) => a - b)
    archetypeLevels.forEach(level => {
      const feats = sections.archetype.get(level)!
      feats.forEach(feat => {
        const name = `Archetype ${level}`
        const value = formatFeatValue(feat)
        props.push({ id: newId(), parentId: archetypeId, type: 'text', data: null, name, value, rank: level, characterId: null })
      })
    })
  }

  // ===== RIGHT COLUMN =====

  // General Feats (only if there are general feats)
  if (sections.general.size > 0) {
    const generalId = newId()
    props.push({ id: generalId, parentId: rightColId, type: 'title-section', data: { collapsed: true }, value: 'General Feat', rank: 0, characterId: null })

    const generalLevels = Array.from(sections.general.keys()).sort((a, b) => a - b)
    generalLevels.forEach(level => {
      const feats = sections.general.get(level)!
      feats.forEach(feat => {
        const name = `General ${level}`
        const value = formatFeatValue(feat)
        props.push({ id: newId(), parentId: generalId, type: 'text', data: null, name, value, rank: level, characterId: null })
      })
    })
  }

  // Skill Feats (only if there are skill feats)
  if (sections.skill.size > 0) {
    const skillId = newId()
    props.push({ id: skillId, parentId: rightColId, type: 'title-section', data: { collapsed: true }, value: 'Skill Feat', rank: 1, characterId: null })

    const skillLevels = Array.from(sections.skill.keys()).sort((a, b) => a - b)
    skillLevels.forEach(level => {
      const feats = sections.skill.get(level)!
      feats.forEach(feat => {
        const name = `Skill ${level}`
        const value = formatFeatValue(feat)
        props.push({ id: newId(), parentId: skillId, type: 'text', data: null, name, value, rank: level, characterId: null })
      })
    })
  }

  // Ancestry Feats (only if there are ancestry feats)
  if (sections.ancestry.size > 0) {
    const ancestryId = newId()
    props.push({ id: ancestryId, parentId: rightColId, type: 'title-section', data: { collapsed: true }, value: 'Ancestry Feat', rank: 2, characterId: null })

    const ancestryLevels = Array.from(sections.ancestry.keys()).sort((a, b) => a - b)
    ancestryLevels.forEach(level => {
      const feats = sections.ancestry.get(level)!
      feats.forEach(feat => {
        const name = `Ancestry ${level}`
        const value = formatFeatValue(feat)
        props.push({ id: newId(), parentId: ancestryId, type: 'text', data: null, name, value, rank: level, characterId: null })
      })
    })
  }

  // Ancestry Paragon (only if there are ancestry paragon feats)
  if (sections.ancestryParagon.size > 0) {
    const ancestryParagonId = newId()
    props.push({ id: ancestryParagonId, parentId: rightColId, type: 'title-section', data: { collapsed: true }, value: 'Ancestry Paragon', rank: 3, characterId: null })

    const ancestryParagonLevels = Array.from(sections.ancestryParagon.keys()).sort((a, b) => a - b)
    ancestryParagonLevels.forEach(level => {
      const feats = sections.ancestryParagon.get(level)!
      feats.forEach(feat => {
        const name = `Ancestry Paragon ${level}`
        const value = formatFeatValue(feat)
        props.push({ id: newId(), parentId: ancestryParagonId, type: 'text', data: null, name, value, rank: level, characterId: null })
      })
    })
  }

  // Bonus Feats
  if (sections.bonus.size > 0) {
    const bonusId = newId()
    props.push({ id: bonusId, parentId: rightColId, type: 'title-section', data: { collapsed: true }, value: 'Bonus Feats', rank: 4, characterId: null })

    const bonusLevels = Array.from(sections.bonus.keys()).sort((a, b) => a - b)
    bonusLevels.forEach(level => {
      const feats = sections.bonus.get(level)!
      feats.forEach(feat => {
        const name = `Bonus ${level}`
        const value = formatFeatValue(feat)
        props.push({ id: newId(), parentId: bonusId, type: 'text', data: null, name, value, rank: level, characterId: null })
      })
    })
  }

  return props
}
