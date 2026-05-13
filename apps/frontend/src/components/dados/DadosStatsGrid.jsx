export default function DadosStatsGrid({ dados }) {
  return (
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
  )
}
