# ¿Cómo Descargar un Dataset de Kaggle? 📥

Con el script `download_dataset.py`, puedes descargar datasets de Kaggle en formato `.csv`. El archivo descargado se guardará automáticamente en la carpeta `data`.  

## 🔧 Instalación de Dependencias

Antes de ejecutar el script, instala las dependencias necesarias con el siguiente comando:  

```bash
pip install -r requirements.txt
```  

Se recomienda utilizar un entorno virtual para evitar conflictos con otras dependencias instaladas en tu sistema.  

## 📌 Configuración del Dataset

El script `download_dataset.py` se encuentra en la raíz del repositorio. Dentro del código, hay una variable llamada `data_set_kaggle`, que por defecto está configurada para descargar un dataset de detección de fraudes en transacciones bancarias:  

```python
data_set_kaggle = "marusagar/bank-transaction-fraud-detection"
```  

Si deseas descargar otro dataset de Kaggle, debes obtener el identificador del dataset. Al abrir la página del dataset en Kaggle, encontrarás una opción para descargarlo, la cual mostrará un código en Python similar a este:  

```python
path = kagglehub.dataset_download("marusagar/bank-transaction-fraud-detection")
```  

El valor que nos interesa es el nombre dentro de `dataset_download()`, en este caso:  

```markdown
"marusagar/bank-transaction-fraud-detection"
```

![Descargar CSV Kaggle](../images/download_kaggle_dataset.png "Descargar CSV Kaggle")

Cuando busques otro dataset en Kaggle, su identificador tendrá el mismo formato. Copia este nombre y reemplázalo en el script, modificando la variable:  

```python
data_set_kaggle = "nombre-dataset-nuevo"
```  

## 📂 Ubicación del Archivo Descargado

El dataset se descargará en la ruta predeterminada de Kaggle en tu computadora:  

```markdown
~/.cache/kagglehub/datasets/nombre_dataset
```  

Después de la descarga, el script moverá automáticamente el archivo a la carpeta `data` dentro de este proyecto, para que puedas acceder a él fácilmente.  

## ▶️ Ejecución del Script

Una vez configurado el dataset que deseas descargar, simplemente ejecuta el script con el siguiente comando:  

```bash
python download_dataset.py
```  
