# Población de datos en MongoDB

## Precarga de datos (`mongoimport`)

Para importar datos a una instancia de MongoDB, se puede utilizar la herramienta de línea de comandos `mongoimport`. La sintaxis y opciones están documentadas en el [sitio oficial de MongoDB](https://www.mongodb.com/docs/database-tools/mongoimport/).

### Sintaxis general

```bash
mongoimport --uri "<uri>" --collection "<nombre_coleccion>" --file "<ruta_al_archivo_de_importacion>"
```

### Formato de la URI

La URI de conexión se obtiene desde la instancia de MongoDB Atlas y tiene la siguiente forma:

```bash
mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<base_de_datos>
```

Donde:

- `<usuario>` es el nombre de usuario de tu base de datos MongoDB.
- `<contraseña>` es la contraseña asociada a ese usuario.
- `<cluster>` es el nombre del clúster de MongoDB (por ejemplo, `cluster0`).
- `<base_de_datos>` es el nombre de la base de datos que deseas poblar.

### Comandos de importación

Ejemplos de comandos para poblar distintas colecciones:

```bash
mongoimport --uri "uri" --collection usuario --file "./data/usuarios.json" --jsonArray
mongoimport --uri "uri" --collection restaurante --file "./data/restaurantes.json" --jsonArray
mongoimport --uri "uri" --collection menu --file "./data/articulos_menu.json" --jsonArray
mongoimport --uri "uri" --collection resena --file "./data/resenas.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_0.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_1.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_2.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_3.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_4.json" --jsonArray
```

> Nota: Si se cargan varios archivos en la misma colección (por ejemplo, `orden`), los documentos serán agregados de forma continua, sin sobrescribir los anteriores.

## Precarga de datos usando MongoDB Compass

También es posible poblar la base de datos utilizando la herramienta gráfica MongoDB Compass. Para ello:

1. Abre MongoDB Compass y conéctate a tu instancia utilizando la URI.
2. Selecciona la base de datos en la que deseas trabajar.
3. Crea manualmente las colecciones si aún no existen.
4. En cada colección, utiliza la opción **"Import Data"**.
5. Selecciona el archivo `.json` correspondiente.
6. Asegúrate de marcar la opción **"JSON Array"** si el archivo contiene un array de documentos.
7. Haz clic en **"Import"**.
