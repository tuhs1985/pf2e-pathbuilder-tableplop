export interface PathbuilderBuild {
name: string
class: string
ancestry: string
heritage: string
background: string
level: number
xp?: number
keyability?: string
languages?: string[]
  abilities: {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
  }
  attributes?: {
    speed?: number
    speedBonus?: number
    ancestryhp?: number
    classhp?: number
    bonushp?: number
    bonushpPerLevel?: number
  }
  proficiencies?: {
    classDC?: number
    perception?: number
    fortitude?: number
    reflex?: number
    will?: number
    acrobatics?: number
    arcana?: number
    athletics?: number
    crafting?: number
    deception?: number
    diplomacy?: number
    intimidation?: number
    medicine?: number
    nature?: number
    occultism?: number
    performance?: number
    religion?: number
    society?: number
    stealth?: number
    survival?: number
    thievery?: number
    [key: string]: number | undefined
  }
  acTotal?: {
    acTotal?: number
    shieldBonus?: number | null
  }
  lores?: Array<[string, number]>
  weapons?: Array<{
    name: string
    qty?: number
    prof?: string // 'simple', 'martial', 'advanced', 'unarmed'
    die?: string // 'd8', 'd10', etc.
    pot?: number // potency rune 0-3
    str?: string // striking rune: '', 'striking', 'greaterStriking', 'majorStriking'
    mat?: string | null
    display?: string
    runes?: string[]
    damageType?: string
    attack?: number
    damageBonus?: number
    extraDamage?: string[]
    increasedDice?: boolean
    isInventor?: boolean
  }>
  armor?: Array<{
    name: string
    qty?: number
    prof?: string // 'unarmored', 'light', 'medium', 'heavy'
    pot?: number // potency rune 0-3
    res?: string // resilient rune
    mat?: string | null
    display?: string
    worn?: boolean
    runes?: string[]
  }>
  equipment?: Array<string | [string, number] | [string, number, string]>
  feats?: Array<[string, string | null, string, number, string, string, string | null]>
  specials?: string[]
  spellCasters?: Array<{
    name: string
    magicTradition?: string
    spellcastingType?: string
    ability?: string
    proficiency?: number
    focusPoints?: number
    innate?: boolean
    perDay?: number[]
    spells?: Array<{
      spellLevel: number
      list: string[]
    }>
    prepared?: Array<{
      spellLevel: number
      list: string[]
    }>
    blendedSpells?: any[]
  }>
  focusPoints?: number
  focus?: {
    [tradition: string]: {
      [ability: string]: {
        abilityBonus?: number
        proficiency?: number
        itemBonus?: number
        focusCantrips?: string[]
        focusSpells?: string[]
      }
    }
  }
}

export async function fetchPathbuilderBuild(id: string): Promise<PathbuilderBuild> {
  if (!/^\d+$/.test(id)) throw new Error('ID must be numeric')
  const url = `https://pathbuilder2e.com/json.php?id=${encodeURIComponent(id)}`
  const res = await fetch(url, { mode: 'cors' })
  if (!res.ok) throw new Error(`Pathbuilder fetch failed (${res.status})`)
  const data = await res.json()
  const build = data?.build
  if (!build) throw new Error('Invalid Pathbuilder JSON shape')
  return build as PathbuilderBuild
}