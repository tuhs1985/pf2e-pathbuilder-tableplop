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
    downloadJson(preview, `tableplop-character-${pbId || 'export'}.json`)
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>PF2e → Tableplop Exporter (Character tab MVP)</h1>
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
      <p><strong>Notes</strong></p>
      <ul>
        <li>Uses 8-digit ID ranges (Character: 10000000–29999999).</li>
        <li>Only Character tab → Character Details + Ability Scores for now.</li>
        <li>If fetch is blocked by CORS, you can proxy or add a manual JSON paste flow.</li>
      </ul>
    </div>
  )
}