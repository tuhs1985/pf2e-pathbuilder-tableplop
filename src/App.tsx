import React, { useState } from 'react'
import { fetchPathbuilderBuild } from './lib/pathbuilder'
import { buildCharacterExport } from './lib/map/character'
import { downloadJson } from './lib/download'

export function App() {
  const [pbId, setPbId] = useState('')
  const [status, setStatus] = useState<string>('')
  const [preview, setPreview] = useState<any>(null)

  async function handleFetch() {
    setStatus('Fetching...')
    setPreview(null)
    try {
      const build = await fetchPathbuilderBuild(pbId.trim())
      setStatus('Mapping...')
      const tableplop = buildCharacterExport(build)
      setPreview(tableplop)
      setStatus('Ready')
    } catch (e: any) {
      setStatus(`Error: ${e?.message || String(e)}`)
    }
  }

  function handleDownload() {
    if (!preview) return
    
    // Extract character name from preview
    const nameProp = preview.properties?.find((p: any) => p.name === 'Name')
    const characterName = nameProp?.value || 'Character'
    
    // Sanitize character name for filename (remove/replace invalid characters)
    const sanitizedName = characterName
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove invalid Windows filename characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .trim()
      .substring(0, 50) // Limit length to avoid overly long filenames
    
    const filename = `tableplop_${sanitizedName}_${pbId || 'export'}.json`
    downloadJson(preview, filename)
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Pathbuilder 2e → Tableplop Exporter</h1>
      <p>Enter a Pathbuilder JSON ID. Example: 182461</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={pbId}
          onChange={e => setPbId(e.target.value)}
          placeholder="Pathbuilder ID"
          inputMode="numeric"
          style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
        />
        <button onClick={handleFetch} style={{ padding: '0.5rem 1rem' }}>Fetch & Map</button>
        <button onClick={handleDownload} disabled={!preview} style={{ padding: '0.5rem 1rem' }}>
          Download JSON
        </button>
      </div>
      <p>{status}</p>
      {preview && (
        <details open>
          <summary>Preview (first 30 properties)</summary>
          <pre style={{ background: '#111', color: '#ddd', padding: '1rem', overflow: 'auto', maxHeight: '50vh' }}>
            {JSON.stringify({ ...preview, properties: preview.properties.slice(0, 30) }, null, 2)}
          </pre>
        </details>
      )}
      <hr/>
      <p><strong>Character Tab (Complete)</strong></p>
      <ul>
        <li>✅ Character Details (Name, Ancestry, Heritage, Class, Background, Level, Experience)</li>
        <li>✅ Ability Scores (all 6 abilities with formulas)</li>
        <li>✅ Combat Info (HP, AC, Speed, Saves, Perception, Class DC, Languages)</li>
        <li>✅ Skills (all 16 core skills with proficiency pips)</li>
        <li>✅ Lores (dynamically added from Pathbuilder)</li>
      </ul>
      <p><strong>Inventory Tab (Complete)</strong></p>
      <ul>
        <li>✅ Weapon Proficiencies (Simple, Martial, Advanced, Unarmed)</li>
        <li>✅ Weapons (dynamic weapon entries with runes and damage formulas)</li>
        <li>✅ Armor Proficiencies (Unarmored, Light, Medium, Heavy)</li>
        <li>✅ Armor section (name, bonuses, runes, shield)</li>
        <li>✅ Backpack (equipment list)</li>
      </ul>
      <p><strong>Feats Tab (Complete)</strong></p>
      <ul>
        <li>✅ Class & Ancestry Features (from specials)</li>
        <li>✅ Class Feats (organized by level)</li>
        <li>✅ Archetype (Free Archetype feats)</li>
        <li>✅ Ancestry Paragon (special ancestry feats)</li>
        <li>✅ Skill Feats (organized by level)</li>
        <li>✅ General Feats (organized by level)</li>
        <li>✅ Ancestry Feats (organized by level)</li>
        <li>✅ Bonus Feats (awarded feats)</li>
      </ul>
      <p><strong>Coming Soon</strong></p>
      <ul>
        <li>Spells tab (Spellcasting and Focus Spells)</li>
        <li>Background tab (Background story/notes)</li>
      </ul>
      <p><strong>Notes</strong></p>
      <ul>
        <li>Uses 8-digit ID ranges (Character: 10M-29M, Inventory: 30M-49M, Feats: 50M-69M).</li>
        <li>If fetch is blocked by CORS, use a proxy or add a manual JSON paste flow.</li>
      </ul>
    </div>
  )
}