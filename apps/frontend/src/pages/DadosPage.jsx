import { useEffect, useState } from 'react'
import { getSummary } from '../api'

export default function DadosPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dados, setDados] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getSummary()
        setDados(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <p>Carregando dados gerais...</p>
  if (error) return <p className="error">{error}</p>
  if (!dados) return null

  return (
    <section>
      <h2>Dados Gerais do DataFrame</h2>

      <div className="card">
        <p><strong>Arquivo:</strong> {dados.arquivo}</p>
        <p><strong>Total de linhas:</strong> {dados.total_linhas}</p>
        <p><strong>Total de colunas:</strong> {dados.total_colunas}</p>
        <p><strong>Registros residenciais:</strong> {dados.total_registros_residenciais}</p>
        <p><strong>Combinacoes rua+bairro:</strong> {dados.total_combinacoes_rua_bairro}</p>
      </div>

      <div className="card">
        <h3>Top bairros por casas</h3>
        <ul>
          {(dados.top_bairros || []).map((item) => (
            <li key={`${item.bairro}-${item.total_casas}`}>
              {item.bairro}: {item.total_casas}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
