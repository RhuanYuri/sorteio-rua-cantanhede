import { useState } from 'react'
import { getRandomStreet } from '../api'

export default function SorteioPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)

  async function handleSortear() {
    setLoading(true)
    setError('')
    try {
      const data = await getRandomStreet()
      setResultado(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Tela de Sorteio</h2>
      <p>Sorteie uma combinacao de rua + bairro com casas.</p>

      <button onClick={handleSortear} disabled={loading}>
        {loading ? 'Sorteando...' : 'Sortear Rua + Bairro'}
      </button>

      {error && <p className="error">{error}</p>}

      {resultado && (
        <div className="card">
          <h3>Resultado</h3>
          <p><strong>Rua:</strong> {resultado.rua}</p>
          <p><strong>Bairro:</strong> {resultado.bairro}</p>
          <p><strong>Total de casas:</strong> {resultado.total_casas}</p>
          <p><strong>Numeros:</strong> {resultado.numeros?.slice(0, 30).join(', ')}</p>
          <p><strong>Coordenadas:</strong> {resultado.coordenadas?.length || 0}</p>
        </div>
      )}
    </section>
  )
}
