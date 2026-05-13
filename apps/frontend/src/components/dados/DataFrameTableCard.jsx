export default function DataFrameTableCard({
  loading,
  dados,
  colunasTabela,
  linhasTabela,
  filterInput,
  setFilterInput,
  pageSize,
  setPageSize,
  handleAplicarFiltro,
  handleLimparFiltro,
  setPage,
}) {
  return (
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
  )
}
