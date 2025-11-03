export type TableplopType =
  | 'tab-section'
  | 'horizontal-section'
  | 'section'
  | 'title-section'
  | 'text'
  | 'number'
  | 'ability'

export interface TableplopProperty {
  id: number
  parentId: number | null
  type: TableplopType
  data?: any
  name?: string
  value?: any
  rank?: number
  size?: number
  formula?: string
  message?: string
  icon?: string
  characterId: null
}

export interface TableplopCharacter {
  type: 'tableplop-character-v2'
  private: boolean
  properties: TableplopProperty[]
}