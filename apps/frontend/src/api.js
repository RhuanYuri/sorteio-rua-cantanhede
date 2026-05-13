const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function getSummary({ page = 1, pageSize = 25, filter = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    filter,
  })

  const response = await fetch(`${API_BASE}/summary?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Falha ao carregar resumo do dataframe')
  }
  return response.json()
}

export async function getRandomStreet() {
  const response = await fetch(`${API_BASE}/random`)
  if (!response.ok) {
    throw new Error('Falha ao sortear rua+bairro')
  }
  return response.json()
}

export function getCsvDownloadUrl() {
  return `${API_BASE}/download-csv`
}
