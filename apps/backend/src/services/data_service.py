from __future__ import annotations

import os
import random
from pathlib import Path
from typing import Any

import pandas as pd

COL_RUA = "NOM_SEGLOGR"
COL_BAIRRO = "DSC_LOCALIDADE"
COL_NUMERO = "NUM_ENDERECO"
COL_ESPECIE = "COD_ESPECIE"
COL_LAT = "LATITUDE"
COL_LON = "LONGITUDE"


def default_csv_path() -> Path:
    repo_root = Path(__file__).resolve().parents[3]
    return repo_root.parent / "2103208_CHAPADINHA.csv"


def csv_path() -> Path:
    value = os.getenv("DATA_CSV_PATH")
    return Path(value) if value else default_csv_path()


def load_df() -> pd.DataFrame:
    path = csv_path()
    if not path.exists():
        raise FileNotFoundError(f"CSV nao encontrado: {path}")

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
        "total_casas": int(dados.shape[0]),
        "numeros": numeros,
        "coordenadas": coords,
    }


def build_summary() -> dict[str, Any]:
    df = load_df()
    casas = casas_df(df)
    combinacoes = combinacoes_rua_bairro(casas)

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
        "total_colunas": int(df.shape[1]),
        "colunas": df.columns.tolist(),
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
