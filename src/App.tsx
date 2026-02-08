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
    <div className="app-container">
      <div className="app-inner">
        <div className="main-card">
          <h1 className="card-title">Pathbuilder 2e → Tableplop Exporter</h1>
          
          <p className="card-subtitle">
            Enter a Pathbuilder JSON ID. Example: 182461
          </p>
          
          <div className="input-group">
            <input
              value={pbId}
              onChange={e => setPbId(e.target.value)}
              placeholder="Pathbuilder ID"
              inputMode="numeric"
            />
            <button onClick={handleFetch}>
              Fetch & Map
            </button>
            <button onClick={handleDownload} disabled={!preview}>
              Download JSON
            </button>
          </div>
          
          {status && (
            <p className="status-message">{status}</p>
          )}
        </div>

        {preview && (
          <details open className="preview-section">
            <summary>Preview (first 30 properties)</summary>
            <pre>
              {JSON.stringify({ ...preview, properties: preview.properties.slice(0, 30) }, null, 2)}
            </pre>
          </details>
        )}

        <div className="features-card">
          <h2>Features</h2>
          
          <div className="features-grid">
            <div className="feature-section complete">
              <h3>Character Tab (Complete)</h3>
              <ul>
                <li>✅ Character Details (Name, Ancestry, Heritage, Class, Background, Level, Experience)</li>
                <li>✅ Ability Scores (all 6 abilities with formulas)</li>
                <li>✅ Combat Info (HP with Max HP formula, AC, Speed, Saves, Perception, Class DC, Languages)</li>
                <li>✅ Skills (all 16 core skills with proficiency pips)</li>
                <li>✅ Lores (dynamically added from Pathbuilder)</li>
                <li>✅ Max HP formula: (class_hp+con)*level + ancestry_hp + level*hp_per_level + bonus_hp</li>
              </ul>
            </div>

            <div className="feature-section complete">
              <h3>Inventory Tab (Complete)</h3>
              <ul>
                <li>✅ Weapon Proficiencies (Simple, Martial, Advanced, Unarmed)</li>
                <li>✅ Weapons (dynamic weapon entries with runes and damage formulas)</li>
                <li>✅ Armor Proficiencies (Unarmored, Light, Medium, Heavy)</li>
                <li>✅ Armor section (name, bonuses, runes, shield)</li>
                <li>✅ Backpack (equipment list)</li>
              </ul>
            </div>

            <div className="feature-section complete">
              <h3>Feats Tab (Complete)</h3>
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
            </div>

            <div className="feature-section complete">
              <h3>Background Tab (Complete)</h3>
              <ul>
                <li>✅ About section (comprehensive user guide with armor/shield notes)</li>
                <li>✅ Hidden Values (HP modifiers: Ancestry HP, Class HP, HP per Level, Bonus HP)</li>
                <li>✅ Combat Modifiers (Armor-Class field used by AC above tabs, Class dmg bonus, Other dmg bonus)</li>
                <li>✅ Class damage bonus calculated upon conversion from Weapon Specialization</li>
              </ul>
            </div>

            <div className="feature-section coming-soon">
              <h3>Coming Soon</h3>
              <ul>
                <li>Spells tab (Spellcasting and Focus Spells)</li>
              </ul>
            </div>

            <div className="feature-section notes">
              <h3>Notes</h3>
              <ul>
                <li>Uses 8-digit ID ranges (Character: 10M-29M, Inventory: 30M-49M, Feats: 50M-69M, Background: 90M-99M)</li>
                <li>If fetch is blocked by CORS, use a proxy or add a manual JSON paste flow</li>
              </ul>
            </div>
          </div>

          <footer className="app-footer">
            <p>
              Part of the{' '}
              <a 
                href="https://tools.tuhsrpg.com" 
                target="_blank"
                rel="noopener noreferrer"
              >
                TUHS RPG Tools Suite
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}