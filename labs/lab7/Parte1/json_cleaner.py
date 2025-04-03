import json
import unidecode
import sys

def clean_text(text):
    """Elimina tildes y caracteres especiales de un texto si es una cadena."""
    if isinstance(text, str):
        return unidecode.unidecode(text)
    return text

def clean_keys_and_values(obj):
    """
    Recursivamente limpia las claves y valores de un diccionario eliminando caracteres especiales como tildes.
    """
    if isinstance(obj, dict):
        new_obj = {}
        for key, value in obj.items():
            clean_key = unidecode.unidecode(key)  # Elimina tildes y caracteres especiales en las claves
            new_obj[clean_key] = clean_keys_and_values(clean_text(value))  # Limpia valores y sigue recursión
        return new_obj
    elif isinstance(obj, list):
        return [clean_keys_and_values(clean_text(item)) for item in obj]  # Procesa cada elemento de la lista
    else:
        return clean_text(obj)  # Retorna valores limpios

def clean_json_file(file_path):
    """
    Lee un archivo JSON, limpia las claves y valores, y guarda el resultado en el mismo archivo.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)  # Carga el JSON

        cleaned_data = clean_keys_and_values(data)  # Limpia las claves y valores
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(cleaned_data, f, ensure_ascii=False, indent=4)  # Sobrescribe el JSON limpio

        print(f"JSON limpio sobrescrito en: {file_path}")
    except Exception as e:
        print(f"Error procesando el archivo: {e}")

# Permite ejecutar el script desde la línea de comandos
if __name__ == "__main__":  
    json_path = "./paises_mundo_big_mac.json"
    clean_json_file(json_path)