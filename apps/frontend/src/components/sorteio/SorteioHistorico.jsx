export default function SorteioHistorico({ historico, formatCep }) {
  if (historico.length === 0) {
    return <p className="muted-text">Nenhum sorteio realizado ainda.</p>
  }

  return (
    <div className="history-list">
      {historico.map((item, index) => (
        <div key={`${item.rua}-${item.bairro}-${index}`} className="history-item">
          <span className="history-street">Rua: {item.rua || '-'}</span>
          <span className="history-neighborhood">Bairro: {item.bairro || '-'}</span>
          <span className="history-neighborhood">CEP: {formatCep(item.cep)}</span>
        </div>
      ))}
    </div>
  )
}
