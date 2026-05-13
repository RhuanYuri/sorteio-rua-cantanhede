import { useEffect, useState } from 'react'
import { getCsvDownloadUrl, getSummary } from '../api'
import PageHeader from '../components/PageHeader'
import DadosStatsGrid from '../components/dados/DadosStatsGrid'
import TopBairrosCard from '../components/dados/TopBairrosCard'
import DataFrameTableCard from '../components/dados/DataFrameTableCard'

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
        <PageHeader title="Dados gerais" description="Resumo do dataset e tabela paginada." />
        <div className="card">
          <p className="muted-text">Carregando dados gerais...</p>
        </div>
      </section>
    )
  }

  if (error && !dados) {
    return (
      <section>
        <PageHeader title="Dados gerais" description="Resumo do dataset e tabela paginada." />
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
      <PageHeader
        title="Dados gerais"
        description="Resumo do DataFrame com filtros por colunas especificas e paginacao."
      />

      {error && <p className="error">{error}</p>}

      <DadosStatsGrid dados={dados} />

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

      <TopBairrosCard topBairros={dados.top_bairros || []} />

      <DataFrameTableCard
        loading={loading}
        dados={dados}
        colunasTabela={colunasTabela}
        linhasTabela={linhasTabela}
        filterInput={filterInput}
        setFilterInput={setFilterInput}
        pageSize={pageSize}
        setPageSize={setPageSize}
        handleAplicarFiltro={handleAplicarFiltro}
        handleLimparFiltro={handleLimparFiltro}
        setPage={setPage}
      />
    </section>
  )
}
