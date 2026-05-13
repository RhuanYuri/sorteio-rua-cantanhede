import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import SorteioPage from './pages/SorteioPage'
import DadosPage from './pages/DadosPage'
import MetodologiaPage from './pages/MetodologiaPage'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <p className="brand-name">Sorteio</p>
            <p className="brand-sub">Ruas e bairros</p>
          </div>
        </div>

        <div className="topbar-actions">
          <nav className="nav-links">
            <NavLink to="/sorteio" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Sorteio
            </NavLink>
            <NavLink to="/dados" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Dados gerais
            </NavLink>
            <NavLink
              to="/metodologia"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              Pagina academica
            </NavLink>
          </nav>

          <button type="button" className="theme-btn" onClick={toggleTheme}>
            Tema: {theme === 'light' ? 'Claro' : 'Escuro'}
          </button>
        </div>
      </header>

      <main className="main-content">
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
