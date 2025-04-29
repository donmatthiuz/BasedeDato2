# Guía de Instalación de MongoDB Compass, MongoDB Shell y Herramientas de Base de Datos

Esta guía cubre los pasos para instalar MongoDB Compass, MongoDB Shell y las herramientas necesarias para trabajar con MongoDB en tu sistema.

## 1. **Instalación de MongoDB Compass**

MongoDB Compass es la interfaz gráfica oficial de MongoDB, que facilita la administración de bases de datos MongoDB.

### Paso 1: Descargar MongoDB Compass

- Dirígete a la página de descarga de MongoDB Compass:  
  [Descargar MongoDB Compass](https://www.mongodb.com/try/download/compass)
  
- Selecciona la versión correspondiente a tu sistema operativo y haz clic en "Download".

### Paso 2: Instalar MongoDB Compass

- Una vez descargado el archivo, ejecuta el instalador y sigue las instrucciones en pantalla para completar la instalación.
  
### Paso 3: Crear Carpeta para MongoDB

- Después de instalar MongoDB Compass, crearemos una carpeta donde se instalará MongoDB.

## 2. **Instalación de MongoDB Shell**

MongoDB Shell es una herramienta de línea de comandos para interactuar con MongoDB.

### Paso 1: Descargar MongoDB Shell

- Dirígete a la página de descarga de MongoDB Shell:  
  [Descargar MongoDB Shell](https://www.mongodb.com/try/download/shell)
  
- Selecciona la versión correspondiente a tu sistema operativo y haz clic en "Download".

### Paso 2: Extraer los Archivos del Zip

- Descomprime el archivo descargado en una carpeta de tu elección.

### Paso 3: Copiar Archivos a la Carpeta Bin de MongoDB

- Navega a la carpeta `bin` de tu instalación de MongoDB (por lo general está en:  
  `C:\Archivos de programa\MongoDB\bin`).

- Copia los archivos ejecutables (por ejemplo, `mongosh.exe`) del archivo descomprimido de MongoDB Shell en la carpeta `bin` de MongoDB.

## 3. **Instalación de Herramientas de Base de Datos de MongoDB**

MongoDB proporciona un conjunto de herramientas para facilitar la administración de bases de datos.

### Paso 1: Descargar Herramientas de Base de Datos

- Dirígete a la página de descarga de las herramientas de base de datos de MongoDB:  
  [Descargar Herramientas de Base de Datos](https://www.mongodb.com/try/download/database-tools)
  
- Selecciona la versión correspondiente a tu sistema operativo y haz clic en "Download".

### Paso 2: Extraer los Archivos del Zip

- Descomprime el archivo descargado en una carpeta de tu elección.

### Paso 3: Copiar Archivos a la Carpeta Bin de MongoDB

- Copia los archivos ejecutables de las herramientas (por ejemplo, `mongodump.exe`, `mongoexport.exe`) en la carpeta `bin` de MongoDB. La ruta de esta carpeta generalmente será:  
  `C:\Archivos de programa\MongoDB\bin`.

## 4. **Configuración de Variables de Entorno**

Para facilitar el uso de MongoDB desde la línea de comandos, vamos a configurar las variables de entorno.

### Paso 1: Copiar Ruta del Bin de MongoDB

- Copia la ruta de la carpeta `bin` de MongoDB. Por lo general, la ruta será algo similar a:  
  `C:\Archivos de programa\MongoDB\bin`.

### Paso 2: Configurar la Variable de Entorno

- En tu computadora, abre las **Propiedades del Sistema** y selecciona **Configuración avanzada del sistema**.
- Haz clic en **Variables de entorno**.
- En la sección de **Variables del sistema**, haz clic en **Nueva**.
- En el campo **Nombre de la variable**, ingresa `MongoDB`.
- En el campo **Valor de la variable**, pega la ruta de la carpeta `bin` de MongoDB.
