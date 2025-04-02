# Análisis de Datos en PostgreSQL 📊

## 📌 Base de Datos Usada

Se utiliza **PostgreSQL** para el análisis de resultados con el backup SQL disponible en la carpeta `lab7/Parte3` del repositorio.

Puedes trabajar con este ejercicio de dos maneras:

1. **Usando el backup SQL**.
2. **Siguiendo el proceso del inciso 1 o 2**, en cuyo caso solo cambiarían los datos cargados en la base de datos.

## 📦 Instalación de Dependencias

Antes de ejecutar el análisis, instala las dependencias necesarias con el siguiente comando:

```bash
pip install -r requirements.txt
```

## 🗄️ Cargar Backup en PostgreSQL

Para restaurar la base de datos desde el backup, ejecuta el siguiente comando:

```bash
psql -h <host> -p <port> -U <user_postgres> -d <name_database> -f <path_backup>
```

📌 **Notas:**

- Se te pedirá la contraseña de tu usuario de PostgreSQL.
- Una vez ingresada la contraseña correctamente, los datos estarán disponibles en tu base de datos local.

## 🔑 Configuración del Archivo `.env`

Después de restaurar la base de datos, debes crear un archivo `.env` en la carpeta `lab7/Parte3` con la siguiente estructura:

```ini
DB_NAME = <name_database>
DB_USER = <user_postgres>
DB_PASS = <password_postgres>
DB_HOST = <host>
DB_PORT = <port>
```

Esto asegurará que el script de conexión pueda acceder correctamente a la base de datos.

## 🚀 Ejecución del Análisis

Una vez configurada la base de datos y las variables de entorno, ejecuta el siguiente comando para visualizar los resultados y generar las gráficas:

```bash
python conn_analysis.py
```

Esto ejecutará el script `conn_analysis.py`, que:

- Se conectará a la base de datos.
- Consultará los datos.
- Mostrará los primeros registros.
- Generará gráficas basadas en los datos obtenidos.

🎯 **¡Listo! Ahora puedes analizar los datos en PostgreSQL de forma visual y estructurada!** 🚀
