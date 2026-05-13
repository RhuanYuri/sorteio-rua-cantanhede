export default function SorteioResultCard({ resultado, formatCep }) {
  return (
    <div className={`result-card${resultado ? ' show' : ''}`}>
      <span className="result-badge">Resultado</span>
      <p className="result-street">Rua: {resultado?.rua || '-'}</p>
      <p className="result-neighborhood">Bairro: {resultado?.bairro || '-'}</p>
      <p className="result-meta">CEP: {formatCep(resultado?.cep)}</p>
      <p className="result-meta">Total de casas: {resultado?.total_casas ?? 0}</p>
      <p className="result-meta">Coordenadas: {resultado?.coordenadas?.length || 0}</p>
      <p className="result-meta">Numeros: {resultado?.numeros?.slice(0, 20).join(', ') || '-'}</p>
    </div>
  )
}
