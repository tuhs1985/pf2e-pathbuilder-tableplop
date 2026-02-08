import type { PathbuilderBuild } from '../pathbuilder'
import type { TableplopProperty } from '../tableplop'
import { makeIdAllocator } from '../idAllocator'

/**
 * Actions tab:
 * - Encounter Actions (with subsections: Attacks, Actions, Reactions, Free Actions)
 * - Exploration Actions
 * - Downtime Actions
 * 
 * ID range: 20000000-34999999
 */

interface ActionData {
  name: string
  actionType: string
  description: string
}

// Standard actions data
const ENCOUNTER_ACTIONS: ActionData[] = [
  { name: "Avert Gaze", actionType: "One-Action", description: "You avert your gaze from danger. You gain a +2 circumstance bonus to saves against visual abilities that require you to look at a creature or object, such as a medusa's petrifying gaze. Your gaze remains averted until the start of your next turn." },
  { name: "Crawl", actionType: "One-Action", description: "Requirements You are prone and your Speed is at least 5 feet.\n\nYou move 5 feet by crawling and continue to stay prone." },
  { name: "Delay", actionType: "Free-Action", description: "Trigger Your turn begins.\n\nYou wait for the right moment to act. The rest of your turn doesn't happen yet. Instead, you're removed from the initiative order. You can return to the initiative order as a free action triggered by the end of any other creature's turn. This permanently changes your initiative to the new position. You can't use reactions until you return to the initiative order. If you Delay an entire round without returning to the initiative order, the actions from the Delayed turn are lost, your initiative doesn't change, and your next turn occurs at your original position in the initiative order.\n\nWhen you Delay, any persistent damage or other negative effects that normally occur at the start or end of your turn occur immediately when you use the Delay action. Any beneficial effects that would end at any point during your turn also end. The GM might determine that other effects end when you Delay as well. Essentially, you can't Delay to avoid negative consequences that would happen on your turn or to extend beneficial effects that would end on your turn." },
  { name: "Drop Prone", actionType: "One-Action", description: "You fall prone." },
  { name: "Escape", actionType: "One-Action", description: "You attempt to escape from being grabbed, immobilized, or restrained. Choose one creature, object, spell effect, hazard, or other impediment imposing any of those conditions on you. Attempt a check using your unarmed attack modifier against the DC of the effect. This is typically the Athletics DC of a creature grabbing you, the Thievery DC of a creature who tied you up, the spell DC for a spell effect, or the listed Escape DC of an object, hazard, or other impediment. You can attempt an Acrobatics or Athletics check instead of using your attack modifier if you choose (but this action still has the attack trait).\n\nCritical Success You get free and remove the grabbed, immobilized, and restrained conditions imposed by your chosen target. You can then Stride up to 5 feet.\nSuccess You get free and remove the grabbed, immobilized, and restrained conditions imposed by your chosen target.\nCritical Failure You don't get free, and you can't attempt to Escape again until your next turn." },
  { name: "Interact", actionType: "One-Action", description: "You use your hand or hands to manipulate an object or the terrain. You can grab an unattended or stored object, draw a weapon, swap a held item for another, open a door, or achieve a similar effect. On rare occasions, you might have to attempt a skill check to determine if your Interact action was successful." },
  { name: "Leap", actionType: "One-Action", description: "You take a short horizontal or vertical jump. Jumping a greater distance requires using the Athletics skill for a High Jump or Long Jump.\n- Horizontal Jump up to 10 feet horizontally if your Speed is at least 15 feet, or up to 15 feet horizontally if your Speed is at least 30 feet. You land in the space where your Leap ends (meaning you can typically clear a 5-foot gap, or a 10-foot gap if your Speed is 30 feet or more). You can't make a horizontal Leap if your Speed is less than 15 feet.\n- Vertical Jump up to 3 feet vertically and 5 feet horizontally onto an elevated surface." },
  { name: "Seek", actionType: "One-Action", description: "You scan an area for signs of creatures or objects, possibly including secret doors or hazards. Choose an area to scan. The GM determines the area you can scan with one Seek action—almost always 30 feet or less in any dimension. The GM might impose a penalty if you search far away from you or adjust the number of actions it takes to Seek a particularly cluttered area.\n\nThe GM attempts a single secret Perception check for you and compares the result to the Stealth DCs of any undetected or hidden creatures in the area, or the DC to detect each object in the area (as determined by the GM or by someone Concealing the Object). A creature you detect might remain hidden, rather than becoming observed, if you're using an imprecise sense or if an effect (such as invisibility) prevents the subject from being observed.\n\nCritical Success Any undetected or hidden creature you critically succeeded against becomes observed by you. You learn the location of objects in the area you critically succeeded against.\nSuccess Any undetected creature you succeeded against becomes hidden from you instead of undetected, and any hidden creature you succeeded against becomes observed by you. You learn the location of any object or get a clue to its whereabouts, as determined by the GM." },
  { name: "Sense Motive", actionType: "One-Action", description: "You try to tell whether a creature's behavior is abnormal. Choose one creature and assess it for odd body language, signs of nervousness, and other indicators that it might be trying to deceive someone. The GM attempts a single secret Perception check for you and compares the result to the Deception DC of the creature, the DC of a spell affecting the creature's mental state, or another appropriate DC determined by the GM. You typically can't try to Sense the Motive of the same creature again until the situation changes significantly.\n\nCritical Success You determine the creature's true intentions and get a solid idea of any mental magic affecting it.\nSuccess You can tell whether the creature is behaving normally, but you don't know its exact intentions or what magic might be affecting it.\nFailure You detect what a deceptive creature wants you to believe. If they're not being deceptive, you believe they're behaving normally.\nCritical Failure You get a false sense of the creature's intentions." },
  { name: "Stand", actionType: "One-Action", description: "You stand up from being prone." },
  { name: "Step", actionType: "One-Action", description: "Requirements Your Speed is at least 10 feet.\n\nYou carefully move 5 feet. Unlike most types of movement, Stepping doesn't trigger reactions, such as Reactive Strike, that can be triggered by move actions or upon leaving or entering a square.\n\nYou can't Step into difficult terrain, and you can't Step using a Speed other than your land Speed." },
  { name: "Stride", actionType: "One-Action", description: "You move up to your Speed." },
  { name: "Strike", actionType: "One-Action", description: "You attack with a weapon you're wielding or with an unarmed attack, targeting one creature within your reach (for a melee attack) or within range (for a ranged attack). Roll an attack roll using the attack modifier for the weapon or unarmed attack you're using, and compare the result to the target creature's AC to determine the effect.\n\nCritical Success You make a damage roll according to the weapon or unarmed attack and deal double damage (see Doubling and Halving Damage for rules on doubling damage).\nSuccess You make a damage roll according to the weapon or unarmed attack and deal damage." },
  { name: "Take Cover", actionType: "One-Action", description: "Requirements You are benefiting from cover, are near a feature that allows you to take cover, or are prone.\nYou press yourself against a wall or duck behind an obstacle to take better advantage of cover. If you would have standard cover, you instead gain greater cover, which provides a +4 circumstance bonus to AC; to Reflex saves against area effects; and to Stealth checks to Hide, Sneak, or otherwise avoid detection. Otherwise, you gain the benefits of standard cover (a +2 circumstance bonus instead). This lasts until you move from your current space, use an attack action, become unconscious, or end this effect as a free action." },
  { name: "Ready", actionType: "Two-Actions", description: "You prepare to use an action that will occur outside your turn. Choose a single action or free action you can use, and designate a trigger. Your turn then ends. If the trigger you designated occurs before the start of your next turn, you can use the chosen action as a reaction (provided you still meet the requirements to use it). You can't Ready a free action that already has a trigger.\n\nIf you have a multiple attack penalty and your readied action is an attack action, your readied attack takes the multiple attack penalty you had at the time you used Ready. This is one of the few times the multiple attack penalty applies when it's not your turn." },
]

const REACTIONS: ActionData[] = [
  { name: "Aid", actionType: "Reaction", description: "Trigger An ally is about to use an action that requires a skill check or attack roll.\nRequirements The ally is willing to accept your aid, and you have prepared to help (see below).\nYou try to help your ally with a task. To use this reaction, you must first prepare to help, usually by using an action during your turn. You must explain to the GM exactly how you're trying to help, and they determine whether you can Aid your ally.\n\nWhen you use your Aid reaction, attempt a skill check or attack roll of a type decided by the GM. The typical DC is 15, but the GM might adjust this DC for particularly hard or easy tasks. The GM can add any relevant traits to your preparatory action or to your Aid reaction depending on the situation, or even allow you to Aid checks other than skill checks and attack rolls.\n\nCritical Success You grant your ally a +2 circumstance bonus to the triggering check. If you're a master with the check you attempted, the bonus is +3, and if you're legendary, it's +4.\nSuccess You grant your ally a +1 circumstance bonus to the triggering check.\nCritical Failure Your ally takes a –1 circumstance penalty to the triggering check." },
]

const EXPLORATION_ACTIONS: ActionData[] = [
  { name: "Avoid Notice", actionType: "Exploration", description: "You attempt a Stealth check to avoid notice while traveling at half speed. If you're Avoiding Notice at the start of an encounter, you usually roll a Stealth check instead of a Perception check both to determine your initiative and to see if the enemies notice you (based on their Perception DCs, as normal for Sneak, regardless of their initiative check results)." },
  { name: "Defend", actionType: "Exploration", description: "You move at half your travel speed with your shield raised. If combat breaks out, you gain the benefits of Raising a Shield before your first turn begins." },
  { name: "Detect Magic", actionType: "Exploration", description: "You cast detect magic at regular intervals. You move at half your travel speed or slower. You have no chance of accidentally overlooking a magic aura at a travel speed up to 300 feet per minute, but must be traveling no more than 150 feet per minute to detect magic auras before the party moves into them." },
  { name: "Follow the Expert", actionType: "Exploration", description: "Choose an ally attempting a recurring skill check while exploring, such as climbing, or performing a different exploration tactic that requires a skill check (like Avoiding Notice). The ally must be at least an expert in that skill and must be willing to provide assistance. While Following the Expert, you match their tactic or attempt similar skill checks." },
  { name: "Hustle", actionType: "Exploration", description: "You strain yourself to move at double your travel speed. You can Hustle only for a number of minutes equal to your Constitution modifier × 10 (minimum 10 minutes). If you are in a group that is Hustling, use the lowest Constitution modifier among everyone to determine how fast the group can Hustle together." },
  { name: "Investigate", actionType: "Exploration", description: "You seek out information about your surroundings while traveling at half speed. You use Recall Knowledge as a secret check to discover clues among the various things you can see and engage with as you journey along. You can use any skill that has a Recall Knowledge action while Investigating, but the GM determines whether the skill is relevant to the clues you could find." },
  { name: "Repeat a Spell", actionType: "Exploration", description: "You repeatedly cast the same spell while moving at half speed. Typically, this spell is a cantrip that you want to have in effect in the event a combat breaks out, and it must be one you can cast in 2 actions or fewer. Repeating a spell that requires making complex decisions, such as figment, can make you fatigued, as determined by the GM." },
  { name: "Scout", actionType: "Exploration", description: "You scout ahead and behind the group to watch danger, moving at half speed. At the start of the next encounter, every creature in your party gains a +1 circumstance bonus to their initiative rolls." },
  { name: "Search", actionType: "Exploration", description: "You Seek meticulously for hidden doors, concealed hazards, and so on. You can usually make an educated guess as to which locations are best to check and move at half speed, but if you want to be thorough and guarantee you checked everything, you need to travel at a Speed of no more than 300 feet per minute, or 150 feet per minute to ensure you check everything before you walk into it. You can always move more slowly while Searching to cover the area more thoroughly, and the Expeditious Search feat increases these maximum Speeds. If you come across a secret door, item, or hazard while Searching, the GM will attempt a free secret check to Seek to see if you notice the hidden object or hazard. In locations with many objects to search, you have to stop and spend significantly longer to search thoroughly." },
]

const DOWNTIME_ACTIONS: ActionData[] = [
  { name: "Earn Income", actionType: "Downtime", description: "You use one of your skills to make money during downtime. The GM assigns a task level representing the most lucrative job available. You can search for lower-level tasks, with the GM determining whether you find any. Sometimes you can attempt to find better work than the initial offerings, though this takes time and requires using the Diplomacy skill to Gather Information, doing some research, or socializing.\n\nWhen you take on a job, the GM secretly sets the DC of your skill check. After your first day of work, you roll to determine your earnings. You gain an amount of income based on your result, the task's level, and your proficiency rank (as listed on the Income Earned table).\n\nYou can continue working at the task on subsequent days without needing to roll again. For each day you spend after the first, you earn the same amount as the first day, up until the task's completion. The GM determines how long you can work at the task. Most tasks last a week or two, though some can take months or even years.\n\nCritical Success You do outstanding work. Gain the amount of currency listed for the task level + 1 and your proficiency rank.\n\nSuccess You do competent work. Gain the amount of currency listed for the task level and your proficiency rank.\n\nFailure You do shoddy work and get paid the bare minimum for your time. Gain the amount of currency listed in the failure column for the task level. The GM will likely reduce how long you can continue at the task.\n\nCritical Failure You earn nothing for your work and are fired immediately. You can't continue at the task. Your reputation suffers, potentially making it difficult for you to find rewarding jobs in that community in the future." },
]

function formatActionName(name: string, actionType: string): string {
  const typeMap: Record<string, string> = {
    'One-Action': '[One-Action]',
    'Two-Actions': '[Two-Actions]',
    'Three-Actions': '[Three-Actions]',
    'Free-Action': '[Free-Action]',
    'Reaction': '[Reaction]',
    'Exploration': '',
    'Downtime': '[Downtime]',
  }
  const prefix = typeMap[actionType] || ''
  return prefix ? `${prefix} ${name}` : name
}

export function buildActionsProperties(build: PathbuilderBuild): TableplopProperty[] {
  const newId = makeIdAllocator('Actions')
  const props: TableplopProperty[] = []

  // Create Actions tab (rank -4)
  const actionsTabId = newId()
  props.push({ id: actionsTabId, parentId: null, type: 'tab-section', data: null, value: 'Actions', rank: -4, characterId: null })

  // ===== ENCOUNTER ACTIONS =====
  const encounterActionsId = newId()
  props.push({ id: encounterActionsId, parentId: actionsTabId, type: 'title-section', data: { collapsed: false }, value: 'Encounter Actions', rank: -1, characterId: null })

  // Attacks subsection
  const attacksSubsectionId = newId()
  props.push({ id: attacksSubsectionId, parentId: encounterActionsId, type: 'title-section', data: { collapsed: true }, value: 'Attacks', rank: 0, characterId: null })
  
  const attacksFilterId = newId()
  props.push({ id: attacksFilterId, parentId: attacksSubsectionId, type: 'filter-list', data: null, rank: -1, characterId: null })

  // Add weapon attacks from Pathbuilder (duplicates from inventory)
  const weapons = build.weapons || []
  weapons.forEach((weapon, idx) => {
    const weaponName = weapon.name || weapon.display || 'Weapon'
    const profKey = weapon.prof || 'Martial'
    
    // Build attack formula similar to inventory
    const die = weapon.die || 'd8'
    const dieCount = weapon.die && weapon.die.startsWith('1d') ? 1 : (weapon.die && weapon.die.startsWith('2d') ? 2 : 1)
    const strikeRune = weapon.strike || 0
    const potencyRune = weapon.pot || 0
    
    const attackFormula = `{1d20+Str+${profKey}+potency_Rune_${potencyRune}}`
    const damageFormula = `{@:striking_rune_${strikeRune}+${dieCount}:${die}+Str+class_dmg+other_dmg}`
    const message = `${weaponName}: To hit ${attackFormula}, Damage: ${damageFormula}`
    
    props.push({
      id: newId(),
      parentId: attacksFilterId,
      type: 'message',
      data: null,
      name: weaponName,
      icon: '/images/message.png',
      rank: idx,
      message: message,
      characterId: null
    })
  })

  // Actions subsection (One-Action, Two-Actions, Three-Actions only)
  const actionsSubsectionId = newId()
  props.push({ id: actionsSubsectionId, parentId: encounterActionsId, type: 'title-section', data: { collapsed: true }, value: 'Actions', rank: 1, characterId: null })
  
  const actionsFilterId = newId()
  props.push({ id: actionsFilterId, parentId: actionsSubsectionId, type: 'filter-list', data: null, rank: -1, characterId: null })
  
  // Only add non-free-action encounter actions
  ENCOUNTER_ACTIONS.filter(a => a.actionType !== 'Free-Action').forEach((action, idx) => {
    props.push({
      id: newId(),
      parentId: actionsFilterId,
      type: 'message',
      data: null,
      name: formatActionName(action.name, action.actionType),
      icon: '/images/message.png',
      rank: idx,
      message: action.description,
      characterId: null
    })
  })

  // Reactions subsection
  const reactionsSubsectionId = newId()
  props.push({ id: reactionsSubsectionId, parentId: encounterActionsId, type: 'title-section', data: { collapsed: true }, value: 'Reactions', rank: 2, characterId: null })
  
  const reactionsFilterId = newId()
  props.push({ id: reactionsFilterId, parentId: reactionsSubsectionId, type: 'filter-list', data: null, rank: 0, characterId: null })
  
  REACTIONS.forEach((action, idx) => {
    props.push({
      id: newId(),
      parentId: reactionsFilterId,
      type: 'message',
      data: null,
      name: formatActionName(action.name, action.actionType),
      icon: '/images/message.png',
      rank: idx,
      message: action.description,
      characterId: null
    })
  })

  // Free Actions subsection
  const freeActionsSubsectionId = newId()
  props.push({ id: freeActionsSubsectionId, parentId: encounterActionsId, type: 'title-section', data: { collapsed: true }, value: 'Free Actions', rank: 4, characterId: null })
  
  const freeActionsFilterId = newId()
  props.push({ id: freeActionsFilterId, parentId: freeActionsSubsectionId, type: 'filter-list', data: null, rank: 0, characterId: null })
  
  // Add free actions from ENCOUNTER_ACTIONS
  ENCOUNTER_ACTIONS.filter(a => a.actionType === 'Free-Action').forEach((action, idx) => {
    props.push({
      id: newId(),
      parentId: freeActionsFilterId,
      type: 'message',
      data: null,
      name: formatActionName(action.name, action.actionType),
      icon: '/images/message.png',
      rank: idx,
      message: action.description,
      characterId: null
    })
  })

  // ===== EXPLORATION ACTIONS =====
  const explorationActionsId = newId()
  props.push({ id: explorationActionsId, parentId: actionsTabId, type: 'title-section', data: { collapsed: false }, value: 'Exploration Actions', rank: 2, characterId: null })
  
  const explorationFilterId = newId()
  props.push({ id: explorationFilterId, parentId: explorationActionsId, type: 'filter-list', data: null, rank: 0, characterId: null })
  
  EXPLORATION_ACTIONS.forEach((action, idx) => {
    props.push({
      id: newId(),
      parentId: explorationFilterId,
      type: 'message',
      data: null,
      name: formatActionName(action.name, action.actionType),
      icon: '/images/message.png',
      rank: idx,
      message: action.description,
      characterId: null
    })
  })

  // ===== DOWNTIME ACTIONS =====
  const downtimeActionsId = newId()
  props.push({ id: downtimeActionsId, parentId: actionsTabId, type: 'title-section', data: { collapsed: true }, value: 'Downtime Actions', rank: 3, characterId: null })
  
  const downtimeFilterId = newId()
  props.push({ id: downtimeFilterId, parentId: downtimeActionsId, type: 'filter-list', data: null, rank: 0, characterId: null })
  
  DOWNTIME_ACTIONS.forEach((action, idx) => {
    props.push({
      id: newId(),
      parentId: downtimeFilterId,
      type: 'message',
      data: null,
      name: formatActionName(action.name, action.actionType),
      icon: '/images/message.png',
      rank: idx,
      message: action.description,
      characterId: null
    })
  })

  return props
}

