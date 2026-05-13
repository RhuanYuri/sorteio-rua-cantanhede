FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copia o monorepo porque o backend pode depender de arquivos na raiz.
COPY . .

# Instala as dependencias do backend.
RUN pip install --no-cache-dir -r apps/backend/requirements.txt

WORKDIR /app/apps/backend

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
