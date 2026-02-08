type TabKey = 'Character' | 'Actions' | 'Inventory' | 'Feats' | 'Spells' | 'Background'

const TAB_BASE: Record<TabKey, number> = {
  Character: 10000000,
  Actions: 20000000,
  Inventory: 35000000,
  Feats: 55000000,
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