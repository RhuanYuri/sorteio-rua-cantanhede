export default function TopBairrosCard({ topBairros }) {
  return (
    <div className="card">
      <h3 className="section-title">Top bairros por casas</h3>
      <div className="neighborhood-list">
        {topBairros.map((item) => {
          const max = topBairros[0]?.total_casas || 1
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
  )
}
