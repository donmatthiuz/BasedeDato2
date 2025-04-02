import psycopg2
from pymongo import MongoClient
import pandas as pd
import numpy as np
from datetime import datetime
import os
from dotenv import load_dotenv
from pathlib import Path
import traceback

# ======================
# CONFIGURACIÓN INICIAL
# ======================
load_dotenv()
BASE_DIR = Path(__file__).parent
PROJECT_ROOT = BASE_DIR.parent

# ========================
# 2.1 EXTRACCIÓN DE DATOS RELACIONALES
# ========================
def extract_and_clean_relational_data():
    try:
        print("\n[2.1] Extrayendo y limpiando datos relacionales...")

        datos_sql_dir = PROJECT_ROOT / 'DatosSQL'
        poblacion_path = datos_sql_dir / 'pais_poblacion.csv'
        envejecimiento_path = datos_sql_dir / 'pais_envejecimiento.csv'

        #valores vacios
        poblacion = pd.read_csv(poblacion_path, na_values=['', 'NA', 'N/A', 'NaN', 'null', '-'])
        envejecimiento = pd.read_csv(envejecimiento_path, na_values=['', 'NA', 'N/A', 'NaN', 'null', '-'])

        #Limepieza pobalcion
        poblacion = (poblacion.drop_duplicates()
                              .dropna(subset=['pais', 'poblacion'], how='any')
                              .assign(poblacion=lambda x: pd.to_numeric(x['poblacion'], errors='coerce'),
                                      pais=lambda x: x['pais'].str.strip().str.upper().fillna(''))
                              .query("pais != ''")
                              .rename(columns={'poblacion': 'poblacion_pais'}))
        #Limpieza envejecimiento
        envejecimiento = (envejecimiento.drop_duplicates()
                                        .dropna(subset=['nombre_pais', 'tasa_de_envejecimiento'], how='any')
                                        .assign(tasa_de_envejecimiento=lambda x: pd.to_numeric(x['tasa_de_envejecimiento'], errors='coerce'),
                                                nombre_pais=lambda x: x['nombre_pais'].str.strip().str.upper().fillna(''),
                                                region=lambda x: x['region'].fillna('Desconocida'))
                                        .query("nombre_pais != ''"))
        #Union de datos
        df_relacional = (pd.merge(poblacion[['pais', 'continente', 'poblacion_pais']],
                                envejecimiento[['nombre_pais', 'tasa_de_envejecimiento', 'region']],
                                left_on='pais',
                                right_on='nombre_pais',
                                how='inner')
                        .drop(columns='nombre_pais')
                        .dropna(subset=['poblacion_pais', 'tasa_de_envejecimiento'])
                        .query("poblacion_pais > 0"))
        
        print("\nMuestra de datos relacionales procesados:")
        print(df_relacional.head())
        print(f"\nRegistros válidos: {len(df_relacional)}")
        
        return df_relacional
    
    except Exception as e:
        print(f"\n[ERROR] En extracción relacional: {str(e)}")
        traceback.print_exc()
        return None

# ========================
# 2.2 EXTRACCIÓN DESDE MONGODB
# ========================
def extract_from_mongodb():
    try:
        print("\n[2.2] Extrayendo datos de MongoDB con validación...")
        
        mongodb_uri = os.getenv("MONGODB_URI")
        mongodb_dbname = os.getenv("MONGODB_DBNAME")
        
        if not mongodb_uri or not mongodb_dbname:
            raise ValueError("Las variables MONGODB_URI y MONGODB_DBNAME deben estar configuradas en .env")
        
        print(f"Conectando a: {mongodb_uri}")
        print(f"Base de datos: {mongodb_dbname}")

        #Conexion a mongo
        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        client.server_info()  #Test conexion
        db = client[mongodb_dbname]

        # Pipeline sotos turisticos
        pipeline_costos = [
            {'$match': {
                'país': {'$exists': True, '$ne': ''},
                'costos_diarios_estimados_en_dólares.hospedaje.precio_promedio_usd': {'$exists': True},
                'costos_diarios_estimados_en_dólares.comida.precio_promedio_usd': {'$exists': True}
            }},
            {'$project': {
                'país': 1,
                'continente': 1,
                'región': {'$ifNull': ['$región', 'Desconocida']},
                'hospedaje_promedio': '$costos_diarios_estimados_en_dólares.hospedaje.precio_promedio_usd',
                'comida_promedio': '$costos_diarios_estimados_en_dólares.comida.precio_promedio_usd',
                'transporte_promedio': {'$ifNull': [
                    '$costos_diarios_estimados_en_dólares.transporte.precio_promedio_usd',
                    0
                ]},
                'entretenimiento_promedio': {'$ifNull': [
                    '$costos_diarios_estimados_en_dólares.entretenimiento.precio_promedio_usd',
                    0
                ]}
            }}
        ]

        #pipeline big mac
        pipeline_bigmac = [
            {'$match': {
                'país': {'$exists': True, '$ne': ''},
                'precio_big_mac_usd': {'$exists': True, '$type': 'number'}
            }},
            {'$project': {
                '_id': 0,
                'país': 1,
                'continente': 1,
                'precio_big_mac_usd': 1
            }}
        ]

        #datos de colecicones
        colecciones_regionales = [
            'costos_turisticos_africa',
            'costos_turisticos_america',
            'costos_turisticos_asia',
            'costos_turisticos_europa'
        ]

        costos_data = []
        for coleccion in colecciones_regionales:
            try:
                print(f"Extrayendo datos de {coleccion}...")
                datos = list(db[coleccion].aggregate(pipeline_costos))
                print(f"Encontrados {len(datos)} registros")
                costos_data.extend(datos)
            except Exception as e:
                print(f"Error al procesar {coleccion}: {str(e)}")
                continue

        if not costos_data:
            raise ValueError("No se encontraron datos en las colecciones de costos turísticos")

        #datos big mac
        print("\nExtrayendo datos Big Mac...")
        bigmac_data = list(db['paises_mundo_big_mac'].aggregate(pipeline_bigmac))
        print(f"Encontrados {len(bigmac_data)} registros Big Mac")

        #Procesamiento datos
        processed_data = []
        for country in costos_data:
            try:
                processed_data.append({
                    'pais': str(country['país']).strip().upper(),
                    'continente': str(country.get('continente', 'Desconocido')).title(),
                    'region': str(country.get('región', 'Desconocida')),
                    'hospedaje_promedio': float(country['hospedaje_promedio']),
                    'comida_promedio': float(country['comida_promedio']),
                    'transporte_promedio': float(country['transporte_promedio']),
                    'entretenimiento_promedio': float(country['entretenimiento_promedio'])
                })
            except Exception as e:
                print(f"Error procesando país {country.get('país', 'Desconocido')}: {str(e)}")
                continue

        df_costos = pd.DataFrame(processed_data).dropna(subset=['pais', 'hospedaje_promedio', 'comida_promedio'])
        
        if bigmac_data:
            df_bigmac = (pd.DataFrame(bigmac_data)
                        .assign(pais=lambda x: x['país'].astype(str).str.strip().str.upper().fillna(''))
                        .query("pais != ''")
                        .drop(columns='país', errors='ignore')
                        .assign(precio_big_mac_usd=lambda x: pd.to_numeric(x['precio_big_mac_usd'], errors='coerce'))
                        .dropna(subset=['precio_big_mac_usd']))
        else:
            df_bigmac = pd.DataFrame(columns=['pais', 'continente', 'precio_big_mac_usd'])

        #Unir datos y sacar total
        df_nosql = (pd.merge(df_costos, df_bigmac, on=['pais', 'continente'], how='left')
                   .assign(costo_total_diario=lambda x: x[['hospedaje_promedio', 'comida_promedio', 
                                                          'transporte_promedio', 'entretenimiento_promedio']].sum(axis=1))
                   .dropna(subset=['costo_total_diario']))

        print("\nMuestra de datos NoSQL procesados:")
        print(df_nosql.head())
        print(f"\nRegistros válidos: {len(df_nosql)}")
        
        return df_nosql
    
    except Exception as e:
        print(f"\n[ERROR] En extracción MongoDB: {str(e)}")
        traceback.print_exc()
        return None
    finally:
        if 'client' in locals():
            client.close()

# ========================
# 2.3 INTEGRACIÓN DE DATASETS
# ========================
def integrate_datasets(df_relacional, df_nosql):
    try:
        print("\n[2.3] Integrando datasets con validación...")
        
        if df_relacional is None or df_nosql is None:
            raise ValueError("DataFrames de entrada no pueden ser None")

        #Normalizacion nombres
        df_relacional['pais'] = (df_relacional['pais']
                                .str.normalize('NFKD')
                                .str.encode('ascii', errors='ignore')
                                .str.decode('utf-8'))
        
        df_nosql['pais'] = (df_nosql['pais']
                           .str.normalize('NFKD')
                           .str.encode('ascii', errors='ignore')
                           .str.decode('utf-8'))
        # Union de datasets
        df_final = pd.merge(
            df_relacional,
            df_nosql,
            on=['pais', 'continente'],
            how='inner',
            suffixes=('', '_nosql')
        )

        #Manejo regiones
        if 'region_nosql' in df_final.columns:
            df_final['region'] = df_final['region_nosql'].fillna(df_final.get('region', 'Desconocida'))
            df_final = df_final.drop(columns=['region_nosql'])
        elif 'region' not in df_final.columns:
            df_final['region'] = 'Desconocida'

        #Limpieza final
        df_final = (df_final.dropna(subset=['poblacion_pais', 'tasa_de_envejecimiento', 'costo_total_diario'])
                   .query("poblacion_pais > 0")
                   .assign(bigmac_ratio=lambda x: np.where(x['precio_big_mac_usd'] == 0,
                                                         np.nan,
                                                         x['costo_total_diario'] / x['precio_big_mac_usd']))
                   .dropna(subset=['bigmac_ratio']))

        #Seleccion y orden columnas
        final_columns = [
            'pais', 'continente', 'region', 'poblacion_pais', 'tasa_de_envejecimiento',
            'hospedaje_promedio', 'comida_promedio', 'transporte_promedio',
            'entretenimiento_promedio', 'costo_total_diario', 'precio_big_mac_usd',
            'bigmac_ratio'
        ]
        
        df_final = (df_final[[col for col in final_columns if col in df_final.columns]]
                   .rename(columns={'poblacion_pais': 'poblacion'}))

        print("\nMuestra de datos integrados:")
        print(df_final.head())
        print(f"\nRegistros válidos finales: {len(df_final)}")
        
        return df_final
    
    except Exception as e:
        print(f"\n[ERROR] En integración: {str(e)}")
        traceback.print_exc()
        return None

# ========================
# 2.4 CARGA AL DATA WAREHOUSE
# ========================
def load_to_datawarehouse(df_final):
    if df_final is None or df_final.empty:
        print("\n[ERROR] No hay datos válidos para cargar")
        return False
    
    try:
        print("\n[2.4] Cargando datos al Data Warehouse...")
        
        conn = psycopg2.connect(
            host=os.getenv("PG_DW_HOST"),
            database=os.getenv("PG_DW_DATABASE"),
            user=os.getenv("PG_DW_USER"),
            password=os.getenv("PG_DW_PASSWORD"),
            port=os.getenv("PG_DW_PORT")
        )
        cursor = conn.cursor()
        
        cursor.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'tourism_analytics'
        """)
        existing_columns = [col[0] for col in cursor.fetchall()]
        
        #Crear tabla (si necesario)
        if not existing_columns:
            print("\nCreando tabla tourism_analytics...")
            cursor.execute("""
            CREATE TABLE tourism_analytics (
                pais VARCHAR(100) NOT NULL,
                continente VARCHAR(50) NOT NULL,
                region VARCHAR(100),
                poblacion INTEGER NOT NULL,
                tasa_envejecimiento FLOAT NOT NULL,
                hospedaje_promedio FLOAT NOT NULL,
                comida_promedio FLOAT NOT NULL,
                transporte_promedio FLOAT,
                entretenimiento_promedio FLOAT,
                costo_total_diario FLOAT NOT NULL,
                precio_big_mac_usd FLOAT,
                bigmac_ratio FLOAT,
                fecha_carga TIMESTAMP NOT NULL,
                PRIMARY KEY (pais, continente),
                CHECK (poblacion > 0),
                CHECK (tasa_envejecimiento >= 0)
            )
            """)
            conn.commit()
            print("Tabla creada exitosamente")
        else:
            # Si la tabla ya existe, vaciarla primero
            print("\nLa tabla ya existe, vaciando datos existentes...")
            cursor.execute("TRUNCATE TABLE tourism_analytics")
            conn.commit()
            print("Tabla vaciada exitosamente")
        
        #Conv tipos
        df_final = df_final.copy()
        df_final['fecha_carga'] = datetime.now()
        
        #renombrar col
        df_final = df_final.rename(columns={
            'tasa_de_envejecimiento': 'tasa_envejecimiento'
        })
        
        #Convertir tipos numpy
        for col in df_final.select_dtypes(include=[np.int32, np.int64]).columns:
            df_final[col] = df_final[col].astype(int)
        for col in df_final.select_dtypes(include=[np.float64]).columns:
            df_final[col] = df_final[col].astype(float)
            
        df_final = df_final.where(pd.notnull(df_final), None)
        
        columns = [
            'pais', 'continente', 'region', 'poblacion', 'tasa_envejecimiento',
            'hospedaje_promedio', 'comida_promedio', 'transporte_promedio',
            'entretenimiento_promedio', 'costo_total_diario', 'precio_big_mac_usd',
            'bigmac_ratio', 'fecha_carga'
        ]
        
        batch_size = 50
        success_count = 0
        total_records = len(df_final)
        
        for i in range(0, total_records, batch_size):
            batch = df_final.iloc[i:i+batch_size]
            records = [tuple(record[col] for col in columns for record in batch.to_dict('records'))]
            
            try:
                placeholders = ', '.join(['%s'] * len(columns))
                query = f"""
                INSERT INTO tourism_analytics ({', '.join(columns)}) 
                VALUES ({placeholders})
                """
                #Corregir paso de registros
                cursor.executemany(query, [tuple(record[col] for col in columns) for record in batch.to_dict('records')])
                conn.commit()
                success_count += len(batch)
                print(f"\rProgreso: {min(i+batch_size, total_records)}/{total_records} registros", end="")
            except Exception as batch_error:
                conn.rollback()
                print(f"\n[ADVERTENCIA] Error en lote {i//batch_size}: {str(batch_error)}")
                
                #Insercion registro por registro como fallback
                for record in batch.to_dict('records'):
                    try:
                        cursor.execute(query, tuple(record[col] for col in columns))
                        conn.commit()
                        success_count += 1
                    except Exception as single_error:
                        conn.rollback()
                        print(f"[ERROR] Registro fallido: {record.get('pais', 'Desconocido')}. Detalle: {str(single_error)}")
        
        print(f"\nCarga completada. {success_count}/{total_records} registros insertados")
        return success_count > 0
    
    except Exception as e:
        print(f"\n[ERROR] Al cargar al DW: {str(e)}")
        traceback.print_exc()
        return False
    finally:
        if 'conn' in locals():
            conn.close()
# ========================
# EJECUCIÓN PRINCIPAL
# ========================
if __name__ == "__main__":
    print("\n=== INICIO DEL PROCESO ETL CON VALIDACIÓN ===")
    
    #2.1
    df_relacional = extract_and_clean_relational_data()
    if df_relacional is None or df_relacional.empty:
        print("\n[ERROR] No se pudieron obtener datos relacionales válidos")
        exit(1)
    
    #2.2
    df_nosql = extract_from_mongodb()
    if df_nosql is None or df_nosql.empty:
        print("\n[ERROR] No se pudieron obtener datos NoSQL válidos")
        exit(1)
    
    #2.3
    df_final = integrate_datasets(df_relacional, df_nosql)
    if df_final is None or df_final.empty:
        print("\n[ERROR] No se pudo integrar datos válidos")
        exit(1)
    
    #2.4
    if load_to_datawarehouse(df_final):
        #CSV para verificación
        output_path = PROJECT_ROOT / 'datos_integrados_validados.csv'
        df_final.to_csv(output_path, index=False)
        print("\n=== PROCESO COMPLETADO CON ÉXITO ===")
        print(f"Total registros válidos procesados: {len(df_final)}")
        print(f"Archivo generado: {output_path}")
    else:
        print("\n=== PROCESO COMPLETADO CON ERRORES ===")