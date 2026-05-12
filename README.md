# Sorteio Monorepo

Monorepo com:
- Backend em Python (FastAPI + pandas)
- Frontend em React (Vite)

## Estrutura

- `apps/backend`: API para sorteio de rua+bairro e resumo do dataframe
- `apps/frontend`: Interface com duas telas
  - Sorteio
  - Dados gerais

## Requisitos

- Python 3.10+
- Node.js 18+

## 1) Rodar o backend

A partir da raiz `sorteio-monorepo`:

```bash
pip install -r apps/backend/requirements.txt
python -m uvicorn src.main:app --reload --app-dir apps/backend
```

A API sobe em `http://localhost:8000`.

## 2) Rodar o frontend

Em outro terminal, na raiz `sorteio-monorepo`:

```bash
npm --prefix apps/frontend install
npm --prefix apps/frontend run dev
```

O frontend sobe em `http://localhost:5173`.

## Observacoes sobre o CSV

Por padrao, o backend tenta carregar o arquivo:

- `../2103208_CHAPADINHA.csv` (um nivel acima da pasta do monorepo)

Voce pode mudar com variavel de ambiente:

```bash
export DATA_CSV_PATH="/caminho/para/2103208_CHAPADINHA.csv"
```
