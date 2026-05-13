import { useEffect, useState } from 'react'
import { getSummary } from '../api'

export default function DadosPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dados, setDados] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterInput, setFilterInput] = useState('')
  const [appliedFilter, setAppliedFilter] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getSummary({ page, pageSize, filter: appliedFilter })
        setDados(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [page, pageSize, appliedFilter])

  function handleAplicarFiltro() {
    setPage(1)
    setAppliedFilter(filterInput.trim())
  }

  function handleLimparFiltro() {
    setFilterInput('')
    setAppliedFilter('')
    setPage(1)
  }

  if (loading) return <p>Carregando dados gerais...</p>
  if (error) return <p className="error">{error}</p>
  if (!dados) return null

  const colunasTabela = dados.colunas || []
  const linhasTabela = dados.amostra_dataframe || []

  return (
    <section>
      <h2>Dados Gerais do DataFrame</h2>

      <div className="card">
        <p><strong>Arquivo:</strong> {dados.arquivo}</p>
        <p><strong>Total de linhas:</strong> {dados.total_linhas}</p>
        <p><strong>Total de linhas (apos filtro):</strong> {dados.total_linhas_filtradas}</p>
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

      <div className="card">
        <h3>Tabela de dados do DataFrame (amostra)</h3>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Filtrar por qualquer campo..."
            value={filterInput}
            onChange={(event) => setFilterInput(event.target.value)}
          />

          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value))
              setPage(1)
            }}
          >
            <option value={10}>10 por pagina</option>
            <option value={25}>25 por pagina</option>
            <option value={50}>50 por pagina</option>
            <option value={100}>100 por pagina</option>
          </select>

          <button type="button" onClick={handleAplicarFiltro} disabled={loading}>
            Aplicar Filtro
          </button>

          <button type="button" onClick={handleLimparFiltro} disabled={loading}>
            Limpar
          </button>
        </div>

        <p>
          Exibindo {dados.total_linhas_amostra || 0} linhas na pagina {dados.page || 1} de{' '}
          {dados.total_paginas || 1}.
        </p>

        {linhasTabela.length === 0 ? (
          <p>Nenhuma linha disponivel para exibir.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {colunasTabela.map((coluna) => (
                    <th key={coluna}>{coluna}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {linhasTabela.map((linha, index) => (
                  <tr key={`linha-${index}`}>
                    {colunasTabela.map((coluna) => (
                      <td key={`${index}-${coluna}`}>
                        {linha[coluna] === null || linha[coluna] === undefined || linha[coluna] === ''
                          ? '-'
                          : String(linha[coluna])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination-controls">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={loading || (dados.page || 1) <= 1}
          >
            Pagina anterior
          </button>

          <span>
            Pagina {dados.page || 1} de {dados.total_paginas || 1}
          </span>

          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={loading || (dados.page || 1) >= (dados.total_paginas || 1)}
          >
            Proxima pagina
          </button>
        </div>
      </div>
    </section>
  )
}
