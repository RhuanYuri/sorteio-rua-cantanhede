export default function MetodologiaPage() {
  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">Pagina academica</h2>
        <p className="page-desc">Explicacao metodologica do mecanismo de sorteio usado pelo sistema.</p>
      </div>

      <div className="card">
        <h3 className="section-title">Objetivo</h3>
        <p>
          Esta pagina descreve, em termos tecnicos, como o sistema seleciona uma combinacao de
          rua e bairro para apoio ao trabalho de campo.
        </p>
      </div>

      <div className="card">
        <h3 className="section-title">Base de dados e pre-processamento</h3>
        <ol>
          <li>O arquivo CSV e carregado com separador ponto e virgula e codificacao latin-1.</li>
          <li>O conjunto e filtrado para registros residenciais (COD_ESPECIE = 1).</li>
          <li>Linhas sem nome de rua sao removidas.</li>
          <li>Bairros vazios sao padronizados para o valor "SEM BAIRRO".</li>
          <li>As combinacoes unicas de rua + bairro sao extraidas sem repeticao.</li>
        </ol>
      </div>

      <div className="card">
        <h3 className="section-title">Regra de sorteio</h3>
        <p>
          O sorteio ocorre por amostragem aleatoria simples sobre o conjunto de combinacoes unicas
          de rua e bairro. Cada combinacao possui a mesma probabilidade de selecao em uma rodada.
        </p>
        <p>
          Portanto, o mecanismo e <strong>equiprovavel por combinacao</strong>, e nao ponderado pelo
          numero de casas da combinacao.
        </p>
      </div>

      <div className="card">
        <h3 className="section-title">Saida produzida</h3>
        <p>Para a combinacao sorteada, o sistema retorna:</p>
        <ul>
          <li>Rua e bairro selecionados.</li>
          <li>Total de casas na combinacao.</li>
          <li>Lista de numeros de endereco (quando disponivel).</li>
          <li>Conjunto de coordenadas geograficas unicas (latitude/longitude).</li>
        </ul>
      </div>

      <div className="card info-card">
        <h3 className="section-title">Interpretacao estatistica</h3>
        <p>
          Como a unidade de amostragem e a combinacao rua+bairro, combinacoes pequenas e grandes
          possuem a mesma chance de serem escolhidas. Se o objetivo for refletir proporcionalmente
          o total de domicilios, o modelo deve evoluir para sorteio ponderado por total de casas.
        </p>
      </div>
    </section>
  )
}