import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import SorteioPage from './pages/SorteioPage'
import DadosPage from './pages/DadosPage'
import MetodologiaPage from './pages/MetodologiaPage'

export default function App() {
  return (
    <div className="layout">
      <header className="header">
        <h1>Sorteio de Ruas e Bairros</h1>
        <nav>
          <NavLink to="/sorteio" className={({ isActive }) => (isActive ? 'active' : '')}>
            Sorteio
          </NavLink>
          <NavLink to="/dados" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dados Gerais
          </NavLink>
          <NavLink to="/metodologia" className={({ isActive }) => (isActive ? 'active' : '')}>
            Pagina Academica
          </NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/sorteio" replace />} />
          <Route path="/sorteio" element={<SorteioPage />} />
          <Route path="/dados" element={<DadosPage />} />
          <Route path="/metodologia" element={<MetodologiaPage />} />
        </Routes>
      </main>
    </div>
  )
}
