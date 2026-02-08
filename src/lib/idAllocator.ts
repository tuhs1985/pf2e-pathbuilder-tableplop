type TabKey = 'Character' | 'Inventory' | 'Feats' | 'Spells' | 'Background'

const TAB_BASE: Record<TabKey, number> = {
  Character: 10000000,
  Inventory: 30000000,
  Feats: 50000000,
  Spells: 70000000,
  Background: 90000000,
}

export function makeIdAllocator(tab: TabKey, step = 1) {
  let next = TAB_BASE[tab]
  return () => {
    next += step
    return next
  }
}