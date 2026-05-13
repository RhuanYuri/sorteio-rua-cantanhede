import { useEffect, useState } from 'react'
import { getCsvDownloadUrl, getSummary } from '../api'

export default function DadosPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dados, setDados] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterInput, setFilterInput] = useState('')
  const [appliedFilter, setAppliedFilter] = useState('')
  const downloadUrl = getCsvDownloadUrl()

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

  if (loading && !dados) {
    return (
      <section>
        <div className="page-header">
          <h2 className="page-title">Dados gerais</h2>
          <p className="page-desc">Resumo do dataset e tabela paginada.</p>
        </div>
        <div className="card">
          <p className="muted-text">Carregando dados gerais...</p>
        </div>
      </section>
    )
  }

  if (error && !dados) {
    return (
      <section>
        <div className="page-header">
          <h2 className="page-title">Dados gerais</h2>
          <p className="page-desc">Resumo do dataset e tabela paginada.</p>
        </div>
        <div className="card">
          <p className="error">{error}</p>
        </div>
      </section>
    )
  }

  if (!dados) return null

  const colunasTabela = dados.colunas || []
  const linhasTabela = dados.amostra_dataframe || []

  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">Dados gerais</h2>
        <p className="page-desc">Resumo do DataFrame com filtros por colunas especificas e paginacao.</p>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total de linhas</p>
          <p className="stat-value">{dados.total_linhas}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Linhas apos filtro</p>
          <p className="stat-value">{dados.total_linhas_filtradas}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Registros residenciais</p>
          <p className="stat-value">{dados.total_registros_residenciais}</p>
        </div>
      </div>

      <div className="card">
        <p><strong>Arquivo:</strong> {dados.arquivo}</p>
        <p><strong>Total de colunas:</strong> {dados.total_colunas}</p>
        <p><strong>Combinacoes rua+bairro:</strong> {dados.total_combinacoes_rua_bairro}</p>
        <p>
          <a className="action-link" href={downloadUrl} target="_blank" rel="noreferrer">
            Baixar CSV completo
          </a>
        </p>
      </div>

      <div className="card">
        <h3 className="section-title">Top bairros por casas</h3>
        <div className="neighborhood-list">
          {(dados.top_bairros || []).map((item) => {
            const max = dados.top_bairros?.[0]?.total_casas || 1
            const largura = Math.max(4, Math.round((item.total_casas / max) * 100))
            return (
              <div key={`${item.bairro}-${item.total_casas}`} className="neighborhood-item">
                <div className="neighborhood-row">
                  <span className="neighborhood-name">{item.bairro}</span>
                  <span className="neighborhood-count">{item.total_casas}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${largura}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Tabela de dados do DataFrame</h3>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Filtrar por CEP, localidade e logradouro..."
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
            Aplicar filtro
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
