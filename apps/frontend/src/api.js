const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function getSummary() {
  const response = await fetch(`${API_BASE}/api/summary`)
  if (!response.ok) {
    throw new Error('Falha ao carregar resumo do dataframe')
  }
  return response.json()
}

export async function getRandomStreet() {
  const response = await fetch(`${API_BASE}/api/random`)
  if (!response.ok) {
    throw new Error('Falha ao sortear rua+bairro')
  }
  return response.json()
}
