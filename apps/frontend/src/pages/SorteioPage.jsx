import { useState } from 'react'
import { getRandomStreet } from '../api'

export default function SorteioPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)
  const [historico, setHistorico] = useState([])

  async function handleSortear() {
    setLoading(true)
    setError('')
    try {
      const data = await getRandomStreet()
      setResultado(data)
      setHistorico((current) => [data, ...current].slice(0, 5))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">Sortear rua</h2>
        <p className="page-desc">Clique no botao para sortear aleatoriamente uma combinacao de rua e bairro.</p>
      </div>

      <div className="panel card">
        <div className="draw-center">
          <button type="button" className="draw-btn" onClick={handleSortear} disabled={loading}>
            <span className={`draw-icon${loading ? ' spinning' : ''}`} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="8" cy="8" r="1.6" fill="currentColor" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                <circle cx="16" cy="16" r="1.6" fill="currentColor" />
                <circle cx="8" cy="16" r="1.6" fill="currentColor" />
                <circle cx="16" cy="8" r="1.6" fill="currentColor" />
              </svg>
            </span>
            <span className="draw-label">{loading ? 'Sorteando...' : 'Sortear'}</span>
          </button>

          {error && <p className="error">{error}</p>}

          <div className={`result-card${resultado ? ' show' : ''}`}>
            <span className="result-badge">Resultado</span>
            <p className="result-street">{resultado?.rua || '-'}</p>
            <p className="result-neighborhood">{resultado?.bairro || '-'}</p>
            <p className="result-meta">Total de casas: {resultado?.total_casas ?? 0}</p>
            <p className="result-meta">Coordenadas: {resultado?.coordenadas?.length || 0}</p>
            <p className="result-meta">
              Numeros: {resultado?.numeros?.slice(0, 20).join(', ') || '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Ultimos sorteios</h3>
        {historico.length === 0 ? (
          <p className="muted-text">Nenhum sorteio realizado ainda.</p>
        ) : (
          <div className="history-list">
            {historico.map((item, index) => (
              <div key={`${item.rua}-${item.bairro}-${index}`} className="history-item">
                <span className="history-street">{item.rua}</span>
                <span className="history-neighborhood">{item.bairro}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
