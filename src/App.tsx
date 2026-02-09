import React, { useState } from 'react'
import { fetchPathbuilderBuild } from './lib/pathbuilder'
import { buildCharacterExport } from './lib/map/character'
import { downloadJson } from './lib/download'
import { ReturnButton } from './components/ReturnButton'

export function App() {
const [pbId, setPbId] = useState('')
const [status, setStatus] = useState<string>('')
const [preview, setPreview] = useState<any>(null)
const [showFeatures, setShowFeatures] = useState(false)
const [copySuccess, setCopySuccess] = useState(false)
const [showJsonOutput, setShowJsonOutput] = useState(false)

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

  function handleCopyJson() {
    if (!preview) return
    
    const jsonString = JSON.stringify(preview, null, 2)
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }).catch(err => {
      console.error('Failed to copy:', err)
    })
  }

  return (
    <div className="app-container">
      <div className="app-inner">
        <div className="main-card">
          <div className="header-container">
            <ReturnButton />
            <h1 className="card-title">Pathbuilder 2e → Tableplop Exporter</h1>
          </div>
          
          <p className="card-subtitle">
            Enter a Pathbuilder JSON ID. Example: 123456
          </p>
          
          <div className="input-group">
            <input
              value={pbId}
              onChange={e => setPbId(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleFetch()
                }
              }}
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
          <div className="preview-section">
            <div className="preview-header">
              <button 
                className="json-output-toggle"
                onClick={() => setShowJsonOutput(!showJsonOutput)}
              >
                {showJsonOutput ? '▼ Hide JSON Output' : '▶ JSON Output'}
              </button>
              <button 
                className="copy-json-btn"
                onClick={handleCopyJson}
              >
                {copySuccess ? '✓ Copied!' : 'Copy JSON'}
              </button>
            </div>
            
            {showJsonOutput && (
              <pre className="json-output">
                {JSON.stringify(preview, null, 2)}
              </pre>
            )}
          </div>
        )}

        <div className="features-card">
          <button 
            className="features-toggle"
            onClick={() => setShowFeatures(!showFeatures)}
          >
            {showFeatures ? '▼ Hide Features' : '▶ Show Features'}
          </button>
          
          {showFeatures && (
            <div className="features-grid">
              <div className="feature-section">
                <h3>Character Tab</h3>
                <ul>
                  <li>✅ Character Details (Name, Ancestry, Heritage, Class, Background, Level, Experience)</li>
                  <li>✅ Ability Scores (all 6 abilities with formulas)</li>
                  <li>✅ Combat Info (HP with Max HP formula, AC, Speed, Saves, Perception, Class DC, Languages)</li>
                  <li>✅ Skills (all 16 core skills with proficiency pips)</li>
                  <li>✅ Lores (dynamically added from Pathbuilder)</li>
                  <li>✅ Max HP formula: (class_hp+con)*level + ancestry_hp + level*hp_per_level + bonus_hp</li>
                </ul>
              </div>

              <div className="feature-section">
                <h3>Inventory Tab</h3>
                <ul>
                  <li>✅ Weapon Proficiencies (Simple, Martial, Advanced, Unarmed)</li>
                  <li>✅ Weapons (dynamic weapon entries with runes and damage formulas)</li>
                  <li>✅ Armor Proficiencies (Unarmored, Light, Medium, Heavy)</li>
                  <li>✅ Armor section (name, bonuses, runes, shield)</li>
                  <li>✅ Backpack (equipment list)</li>
                </ul>
              </div>

              <div className="feature-section">
                <h3>Actions Tab</h3>
                <ul>
                  <li>✅ Encounter Actions (Attacks from weapons, standard actions, reactions, free actions)</li>
                  <li>✅ Exploration Actions (Avoid Notice, Scout, Search, Detect Magic, etc.)</li>
                  <li>✅ Downtime Actions (Earn Income, Craft, etc.)</li>
                  <li>✅ All actions include filter-list for easy searching</li>
                </ul>
              </div>

              <div className="feature-section">
                <h3>Feats Tab</h3>
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

              <div className="feature-section">
                <h3>Spells Tab</h3>
                <ul>
                  <li>✅ Dynamic tradition grouping (Arcane, Divine, Occult, Primal)</li>
                  <li>✅ Spell Attack & DC per tradition with proficiency pips</li>
                  <li>✅ Prepared Spells with spellbook (source of truth)</li>
                  <li>✅ Spontaneous Spells (known spells)</li>
                  <li>✅ Innate Spellcasting</li>
                  <li>✅ Focus Spells with auto-heightening</li>
                  <li>✅ Cantrips auto-heighten to max spell rank</li>
                  <li>✅ Focus Points tracking</li>
                  <li>✅ Prepared spell duplicates collapsed (x2, x3)</li>
                  <li>✅ Multiple casters per tradition supported</li>
                </ul>
              </div>

              <div className="feature-section">
                <h3>Background Tab</h3>
                <ul>
                  <li>✅ About section (comprehensive user guide with armor/shield notes)</li>
                  <li>✅ Hidden Values (HP modifiers: Ancestry HP, Class HP, HP per Level, Bonus HP)</li>
                  <li>✅ Combat Modifiers (Armor-Class field used by AC above tabs, Class dmg bonus, Other dmg bonus)</li>
                  <li>✅ Class damage bonus calculated upon conversion from Weapon Specialization</li>
                </ul>
              </div>
            </div>
          )}

          <div className="notes-section">
            <h3>Complete Character Export</h3>
            <p>
              This exporter creates a <strong>fully functional Tableplop character sheet</strong> with 6 complete tabs:
            </p>
            <ul>
              <li><strong>Character:</strong> Stats, abilities, skills, saves, combat info</li>
              <li><strong>Actions:</strong> Weapon attacks, standard actions, exploration, downtime</li>
              <li><strong>Inventory:</strong> Weapons, armor, equipment with formulas</li>
              <li><strong>Feats:</strong> All feat types organized by level</li>
              <li><strong>Spells:</strong> Full spellcasting with traditions, focus spells, auto-heightening</li>
              <li><strong>Background:</strong> User guide and hidden formula values</li>
            </ul>

            <h3>Armor Notes</h3>
            <p>
              The exporter recognizes most basic armors from the Core Rulebook. If your armor is not recognized, 
              it defaults to the following values based on category:
            </p>
            <ul>
              <li><strong>Heavy Armor:</strong> Item Bonus +5, Dex Cap +1</li>
              <li><strong>Medium Armor:</strong> Item Bonus +3, Dex Cap +2</li>
              <li><strong>Light Armor:</strong> Item Bonus +1, Dex Cap +4</li>
              <li><strong>Unarmored:</strong> Item Bonus +0, Dex Cap +5</li>
            </ul>
            <p>
              Check your Inventory tab and adjust the Item Bonus and Dex Cap manually if needed for unique armors.
            </p>

            <h3>Shield Notes</h3>
            <p>
              Pathbuilder does not export shield HP or Hardness values. You'll need to manually enter these in the 
              Inventory tab → Armor section → Shield fields. Break Threshold (BT) is automatically calculated from Shield HP Max.
            </p>

            <h3>Hidden Values</h3>
            <p>
              The Hidden Values section in the Background Tab contains fields that are referenced in formulas throughout your character sheet:
            </p>
            <ul>
              <li><strong>HP Modifiers:</strong> Used to calculate your maximum HP automatically in the Character tab.</li>
              <li><strong>Combat Modifiers:</strong> Class damage bonus is calculated upon conversion from Weapon Specialization. 
              The Armor-Class field is used by the AC value displayed above the tabs.</li>
            </ul>
            <p>
              These fields are pre-filled from your Pathbuilder export. You generally won't need to edit them unless you 
              gain new abilities or make manual adjustments.
            </p>
          </div>
        </div>

        <footer className="app-footer">
          <a 
            href="https://github.com/tuhs1985/pf2e-pathbuilder-tableplop" 
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub / Report Issues
          </a>
          
          <p className="paizo-notice">
            This website uses trademarks and/or copyrights owned by Paizo Inc., used under Paizo's Community Use Policy (paizo.com/licenses/communityuse). 
            We are expressly prohibited from charging you to use or access this content. This website is not published, endorsed, or specifically approved by Paizo. 
            For more information about Paizo Inc. and Paizo products, visit{' '}
            <a 
              href="https://paizo.com/" 
              target="_blank"
              rel="noopener noreferrer"
            >
              paizo.com
            </a>.
          </p>
        </footer>
      </div>
    </div>
  )
}