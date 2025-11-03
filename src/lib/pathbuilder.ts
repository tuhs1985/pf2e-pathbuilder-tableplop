export interface PathbuilderBuild {
  name: string
  class: string
  ancestry: string
  heritage: string
  background: string
  level: number
  xp?: number
  abilities: {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
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