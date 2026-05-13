from __future__ import annotations

import os
import random
from pathlib import Path
from typing import Any

import pandas as pd

COL_RUA = "NOM_SEGLOGR"
COL_BAIRRO = "DSC_LOCALIDADE"
COL_CEP = "CEP"
COL_NUMERO = "NUM_ENDERECO"
COL_ESPECIE = "COD_ESPECIE"
COL_LAT = "LATITUDE"
COL_LON = "LONGITUDE"
FILTER_COLUMNS = [
    "CEP",
    "DSC_LOCALIDADE",
    "NOM_TIPO_SEGLOGR",
    "NOM_TITULO_SEGLOGR",
    "NOM_SEGLOGR",
    "NOM_COMP_ELEM1",
]


def default_csv_path() -> Path:
    project_root = Path(__file__).resolve().parents[4]
    workspace_root = project_root.parent
    backend_root = Path(__file__).resolve().parents[2]

    candidates = [
        Path("/data/2103208_CHAPADINHA.csv"),
        backend_root / "2103208_CHAPADINHA.csv",
        backend_root / "data" / "2103208_CHAPADINHA.csv",
        workspace_root / "2103208_CHAPADINHA.csv",
        project_root / "2103208_CHAPADINHA.csv",
    ]

    for candidate in candidates:
        if candidate.exists():
            return candidate

    # Mantem um caminho previsivel para a mensagem de erro quando o arquivo nao existir.
    return candidates[0]


def csv_path() -> Path:
    value = os.getenv("DATA_CSV_PATH")
    return Path(value) if value else default_csv_path()


def load_df() -> pd.DataFrame:
    path = csv_path()
    if not path.exists():
        raise FileNotFoundError(
            "CSV nao encontrado: "
            f"{path}. "
            "Defina DATA_CSV_PATH no ambiente ou monte o arquivo em /data/2103208_CHAPADINHA.csv."
        )

    return pd.read_csv(path, sep=";", encoding="latin-1")


def casas_df(df: pd.DataFrame) -> pd.DataFrame:
    if COL_ESPECIE not in df.columns:
        raise KeyError(f"Coluna obrigatoria ausente: {COL_ESPECIE}")

    casas = df[df[COL_ESPECIE] == 1].copy()

    for col in [COL_RUA, COL_BAIRRO, COL_NUMERO]:
        if col not in casas.columns:
            casas[col] = ""

    casas[COL_RUA] = casas[COL_RUA].fillna("").astype(str).str.strip()
    casas[COL_BAIRRO] = casas[COL_BAIRRO].fillna("SEM BAIRRO").astype(str).str.strip()
    casas.loc[casas[COL_BAIRRO] == "", COL_BAIRRO] = "SEM BAIRRO"

    casas = casas[casas[COL_RUA] != ""]
    return casas


def combinacoes_rua_bairro(casas: pd.DataFrame) -> list[dict[str, str]]:
    return (
        casas[[COL_RUA, COL_BAIRRO]]
        .drop_duplicates()
        .sort_values([COL_RUA, COL_BAIRRO])
        .to_dict("records")
    )


def detalhes_rua_bairro(casas: pd.DataFrame, rua: str, bairro: str) -> dict[str, Any]:
    dados = casas[(casas[COL_RUA] == rua) & (casas[COL_BAIRRO] == bairro)].copy()

    cep = "SEM CEP"
    if COL_CEP in dados.columns:
        ceps = (
            dados[COL_CEP]
            .fillna("")
            .astype(str)
            .str.strip()
            .replace("", pd.NA)
            .dropna()
            .drop_duplicates()
            .tolist()
        )
        if ceps:
            cep = ceps[0]

    numeros = (
        dados[COL_NUMERO]
        .fillna("SN")
        .astype(str)
        .str.strip()
        .replace("", "SN")
        .tolist()
    )

    coords: list[dict[str, float]] = []
    if COL_LAT in dados.columns and COL_LON in dados.columns:
        coords_df = dados[[COL_LAT, COL_LON]].dropna().drop_duplicates()
        coords = [
            {"lat": float(row[COL_LAT]), "lon": float(row[COL_LON])}
            for _, row in coords_df.iterrows()
        ]

    return {
        "rua": rua,
        "bairro": bairro,
        "cep": cep,
        "total_casas": int(dados.shape[0]),
        "numeros": numeros,
        "coordenadas": coords,
    }


def build_summary(page: int = 1, page_size: int = 25, filter_text: str = "") -> dict[str, Any]:
    df = load_df()
    casas = casas_df(df)
    combinacoes = combinacoes_rua_bairro(casas)

    filtro = filter_text.strip().lower()
    filtered_df = df

    if filtro:
        colunas_filtro_disponiveis = [col for col in FILTER_COLUMNS if col in df.columns]
        if colunas_filtro_disponiveis:
            texto_df = df[colunas_filtro_disponiveis].fillna("").astype(str)
            mask = texto_df.apply(
                lambda row: row.str.lower().str.contains(filtro, regex=False).any(), axis=1
            )
            filtered_df = df[mask].copy()
        else:
            filtered_df = df.iloc[0:0].copy()

    total_linhas_filtradas = int(filtered_df.shape[0])
    total_paginas = max(1, (total_linhas_filtradas + page_size - 1) // page_size)
    page = min(max(1, page), total_paginas)

    inicio = (page - 1) * page_size
    fim = inicio + page_size
    amostra_df = filtered_df.iloc[inicio:fim].copy()
    amostra_df = amostra_df.where(pd.notna(amostra_df), None)

    bairros_top = (
        casas[COL_BAIRRO]
        .value_counts()
        .head(10)
        .rename_axis("bairro")
        .reset_index(name="total_casas")
        .to_dict("records")
    )

    return {
        "arquivo": str(csv_path()),
        "total_linhas": int(df.shape[0]),
        "total_linhas_filtradas": total_linhas_filtradas,
        "total_colunas": int(df.shape[1]),
        "colunas": df.columns.tolist(),
        "total_linhas_amostra": int(amostra_df.shape[0]),
        "amostra_dataframe": amostra_df.to_dict("records"),
        "page": page,
        "page_size": page_size,
        "total_paginas": total_paginas,
        "filtro": filter_text,
        "total_registros_residenciais": int(casas.shape[0]),
        "total_combinacoes_rua_bairro": len(combinacoes),
        "amostra_combinacoes": combinacoes[:20],
        "top_bairros": bairros_top,
    }


def random_street_details() -> dict[str, Any]:
    df = load_df()
    casas = casas_df(df)
    combinacoes = combinacoes_rua_bairro(casas)

    if not combinacoes:
        raise ValueError("Nenhuma combinacao rua+bairro com casas encontrada")

    sorteado = random.choice(combinacoes)
    return detalhes_rua_bairro(casas, sorteado[COL_RUA], sorteado[COL_BAIRRO])
