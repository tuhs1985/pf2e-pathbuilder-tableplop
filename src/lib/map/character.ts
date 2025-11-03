import type { PathbuilderBuild } from '../pathbuilder'
import type { TableplopCharacter, TableplopProperty } from '../tableplop'
import { makeIdAllocator } from '../idAllocator'

/**
 * Character tab MVP:
 * - Containers (tab → row → columns)
 * - Character Details
 * - Ability Scores (with formulas preserved per template)
 * Ranks use human-friendly gaps.
 */
export function buildCharacterExport(build: PathbuilderBuild): TableplopCharacter {
  const newId = makeIdAllocator('Character')

  // Containers
  const tabId = newId()          // e.g., 10000001
  const rowId = newId()          // e.g., 10000002
  const leftColId = newId()      // e.g., 10000003
  const rightColId = newId()     // e.g., 10000004

  const props: TableplopProperty[] = [
    { id: tabId, parentId: null, type: 'tab-section', data: {}, value: 'Character', rank: -5, characterId: null },
    { id: rowId, parentId: tabId, type: 'horizontal-section', rank: -4, characterId: null },
    { id: leftColId, parentId: rowId, type: 'section', size: 62.76995305164285, rank: 0, characterId: null },
    { id: rightColId, parentId: rowId, type: 'section', size: 37.23004694835691, rank: 1, characterId: null },
  ]

  // Character Details
  const charDetailsId = newId()
  props.push({ id: charDetailsId, parentId: leftColId, type: 'title-section', data: { collapsed: false }, value: 'Character Details', rank: -100, characterId: null })

  props.push(
    { id: newId(), parentId: charDetailsId, type: 'text', name: 'Name', value: build.name || '', rank: -100, characterId: null },
    { id: newId(), parentId: charDetailsId, type: 'text', name: 'Ancestry', value: build.ancestry || '', rank: -90, characterId: null },
    { id: newId(), parentId: charDetailsId, type: 'text', name: 'Heritage', value: build.heritage || '', rank: -80, characterId: null },
    { id: newId(), parentId: charDetailsId, type: 'text', name: 'Class', value: build.class || '', rank: -70, characterId: null },
    { id: newId(), parentId: charDetailsId, type: 'text', name: 'Background', value: build.background || '', rank: -60, characterId: null },
    { id: newId(), parentId: charDetailsId, type: 'number', name: 'Experience', value: build.xp ?? 0, rank: -20, characterId: null },
    { id: newId(), parentId: charDetailsId, type: 'number', name: 'Level', value: build.level ?? 1, rank: -10, characterId: null },
  )

  // Ability Scores (title)
  const abilityTitleId = newId()
  props.push({ id: abilityTitleId, parentId: leftColId, type: 'title-section', data: { collapsed: false }, value: 'Ability Scores', rank: 0, characterId: null })

  // Helper to add an ability parent with child score number; formulas preserved
  function addAbility(abilityName: 'Strength'|'Dexterity'|'Constitution'|'Intelligence'|'Wisdom'|'Charisma', scoreName: string, scoreValue: number, rank: number) {
    const parentId = newId()
    props.push({
      id: parentId,
      parentId: abilityTitleId,
      type: 'ability',
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
      name: scoreName,
      value: scoreValue,
      rank: 0,
      characterId: null
    })
  }

  // Use best-practice ordering with gaps; Pathbuilder scores from build.abilities
  addAbility('Strength', 'strength-score', build.abilities?.str ?? 10, -1)
  addAbility('Dexterity', 'dexterity-score', build.abilities?.dex ?? 10, 0)
  addAbility('Constitution', 'constitution-score', build.abilities?.con ?? 10, 1)
  addAbility('Intelligence', 'intelligence-score', build.abilities?.int ?? 10, 2)
  addAbility('Wisdom', 'wisdom-score', build.abilities?.wis ?? 10, 3)
  addAbility('Charisma', 'charisma-score', build.abilities?.cha ?? 10, 4)

  const character = {
    type: 'tableplop-character-v2' as const,
    private: false,
    properties: props
  }
  return character
}