# Guia para Inciso 1 y 2

## Esquema general para integración de datos (ETL)

```mermaid
flowchart TD
    subgraph Relacional_CSV
        envejecimiento[pais_envejecimiento.csv]
        poblacion[pais_población.csv]
    end

    subgraph NoRelacional_JSON
        africa[costos_turisticos_africa.json]
        america[costos_turisticos_america.json]
        asia[costos_turisticos_asia.json]
        europa[costos_turisticos_europa.json]
        bigmac[paises_mundo_big_mac.json]
    end

    subgraph Proceso_ETL
        limpieza[Limpieza y transformación]
        integracion[Unificación y enriquecimiento]
        programado[Programación / Ejecución recurrente]
    end

    subgraph Destino_DWH
        dwh[(Data Warehouse)]
    end

    envejecimiento --> limpieza
    poblacion --> limpieza
    africa --> limpieza
    america --> limpieza
    asia --> limpieza
    europa --> limpieza
    bigmac --> limpieza

    limpieza --> integracion
    integracion --> programado
    programado --> dwh
```

## Limpieza por archivo

| Archivo                              | Problemas detectados                                          | Limpieza necesaria                                                                 |
|-------------------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------------|
| `pais_envejecimiento.csv`           | Faltan columnas (Hungary, Angola, etc. vacíos)                | - Eliminar o imputar registros incompletos<br>- Uniformar nombres de países        |
| `pais_población.csv`                | Algunos nombres no coinciden con otros archivos               | - Homogeneizar nombres de países (ej. Sudáfrica vs. South Africa)                  |
| `costos_turisticos_*.json`          | Estructura anidada, nombres de campos con espacios            | - Flatten del JSON<br>- Renombrar campos (ej. `precio_promedio_usd`)               |
| `paises_mundo_big_mac.json`         | Faltan países presentes en otros datasets                     | - Validar existencia cruzada<br>- Rellenar o marcar nulos donde no haya coincidencia |

## Posibles claves de integración

| Dataset                            | Clave sugerida para unión         |
|-----------------------------------|-----------------------------------|
| Todos los archivos                | `país` o `nombre_pais`            |
| Envejecimiento y población        | `nombre_pais` + `continente`      |
| Archivos JSON de costos turísticos| `país` + `continente`             |
| Big Mac                           | `país`                            |
