"""
Python script for downloading datasets from Kaggle.  

How to use?  
Refer to the guide in `docs/download_dataset.md` if you need instructions.  
"""

import os
import kagglehub
import shutil

data_dir = "./data"
os.makedirs(data_dir, exist_ok=True)
data_set_kaggle = "marusagar/bank-transaction-fraud-detection"

# Ruta de la caché de kagglehub
cache_dir = os.path.expanduser(f"~/.cache/kagglehub/datasets/{data_set_kaggle}")

# Si existe la caché, eliminarla antes de descargar
if os.path.exists(cache_dir):
    shutil.rmtree(cache_dir)
    print(f"Cache deleted: {cache_dir}")

try:
    path = kagglehub.dataset_download(data_set_kaggle)

    if not os.path.exists(path):
        raise FileNotFoundError(f"The dataset was not downloaded correctly. Check the connection or dataset name.")

    files = os.listdir(path)
    if not files:
        raise FileNotFoundError("The dataset folder is empty. There may be an extraction error.")

    for file in files:
        file_path = os.path.join(path, file)
        dest_path = os.path.join(data_dir, file)

        if os.path.isfile(file_path):
            if os.path.exists(dest_path):
                user_input = input(f"The file '{file}' already exists in '{data_dir}'. Do you want to replace it? (y/n): ").strip().lower()
                if user_input == "y":
                    os.remove(dest_path)
                    print(f"Replacing '{file}'...")
                else:
                    print(f"Skipping '{file}'...")
                    continue

            shutil.move(file_path, data_dir)
            print(f"File moved: {file}")


        else:
            print(f"Warning: {file} no es un archivo válido para mover.")

    print(f"Dataset successfully moved to: '{os.path.abspath(data_dir)}'")

except FileNotFoundError as e:
    print(f"Error: {e}")
except PermissionError as e:
    print(f"Permission error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
