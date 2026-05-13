import { useState } from 'react'
import { getRandomStreet } from '../api'
import PageHeader from '../components/PageHeader'
import SorteioResultCard from '../components/sorteio/SorteioResultCard'
import SorteioHistorico from '../components/sorteio/SorteioHistorico'

function formatCep(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8)
  if (!digits) return '-'
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

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
      <PageHeader
        title="Sortear rua"
        description="Clique no botao para sortear aleatoriamente uma combinacao de rua e bairro."
      />

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

          <SorteioResultCard resultado={resultado} formatCep={formatCep} />
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Ultimos sorteios</h3>
        <SorteioHistorico historico={historico} formatCep={formatCep} />
      </div>
    </section>
  )
}
