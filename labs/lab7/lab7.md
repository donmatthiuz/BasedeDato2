# Laboratorio 7: Integración de Datos y Extracción de Insights

## Ejercicio 1 - Integración de datos con una herramienta para procesos de ETL

### 1.1 Ingesta desde base de datos relacional

- Conecte la herramienta ETL a la base de datos relacional (por ejemplo: MySQL, PostgreSQL, SQL Server).
- Extraiga las tablas requeridas.
- Revise si los datos contienen:
  - Valores nulos o duplicados
  - Tipos de datos inconsistentes
  - Codificaciones incorrectas
- Realice la limpieza necesaria (eliminación de nulos, normalización de campos, etc.).

### 1.2 Ingesta desde base de datos no relacional

- Conecte la herramienta ETL a la base de datos no relacional (por ejemplo: MongoDB, Cassandra, Firebase).
- Extraiga los documentos o colecciones relevantes.
- Valide:
  - Estructuras inconsistentes entre documentos
  - Valores faltantes
  - Necesidad de aplanar estructuras anidadas
- Realice la limpieza o transformación necesaria para unificación.

### 1.3 Integración de datos

- Una los datos de ambas fuentes mediante claves comunes (por ejemplo: ID de usuario, correo electrónico, etc.).
- Diseñe un flujo ETL que fusione ambos conjuntos de datos en un solo modelo consistente.
- Aplique transformaciones necesarias para compatibilidad entre estructuras y formatos.

### 1.4 Automatización del proceso ETL

- Configure la herramienta para que el flujo ETL se ejecute de forma periódica (frecuencia sugerida: cada hora, diario o semanal).
- Habilite logs de ejecución y alertas ante fallos.

### 1.5 Carga en Data Warehouse

- Configure el flujo para que, una vez integrados los datos, estos se carguen automáticamente en una base de datos destino tipo Data Warehouse (por ejemplo: BigQuery, Redshift, Snowflake, PostgreSQL optimizado para BI).
- El proceso debe ejecutarse sin intervención manual.

## Ejercicio 2 - Integración de datos con un lenguaje de programación

> **Observación:** Puede utilizar cualquier lenguaje de programación (por ejemplo: Python, Java, Go, Node.js, etc.)

### 2.1 Ingesta desde base de datos relacional

- Utilice un conector adecuado para extraer datos de la base relacional (por ejemplo: `psycopg2` para PostgreSQL, `mysql-connector-python` para MySQL).
- Realice una revisión de calidad de datos:
  - Eliminación de duplicados
  - Conversión de tipos
  - Limpieza de strings

### 2.2 Ingesta desde base de datos no relacional

- Conecte a la base no relacional usando el driver correspondiente (por ejemplo: `pymongo` para MongoDB).
- Aplane estructuras anidadas si es necesario.
- Aplique transformaciones para unificar los datos con los de la fuente relacional.

### 2.3 Integración en memoria

- Combine los datasets extraídos en estructuras de datos (por ejemplo: DataFrames de `pandas` en Python).
- Realice uniones (joins) por claves comunes.
- Establezca una estructura final unificada.

### 2.4 Carga en el Data Warehouse

- Conecte a la base destino tipo Data Warehouse.
- Realice la carga utilizando comandos `INSERT`, `COPY`, o mediante conectores especializados.
- Opcional: Automatice este paso con un script ejecutable por cron o scheduler.

## Ejercicio 3 - Insights sobre los datos

Una vez integrada la información proveniente de la base relacional y no relacional, se deben extraer conocimientos útiles que impulsen la acción.

### Requerimiento

- Obtener **al menos tres insights relevantes** a partir de los datos integrados.
- Explicar cada insight con claridad y justificar por qué es importante.
- Idealmente, los insights deben motivar una acción concreta, como:
  - Mejoras en procesos
  - Cambios en productos
  - Segmentación de clientes
  - Prevención de riesgos

**Ejemplo de estructura para cada insight:**

1. **Insight 1:** Breve descripción
   - **Evidencia encontrada:** (gráficas, tendencias, correlaciones, etc.)
   - **Relevancia:** ¿Por qué importa?
   - **Recomendación:** Acción sugerida

2. **Insight 2:** ...
3. **Insight 3:** ...
