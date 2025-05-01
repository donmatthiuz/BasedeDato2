# Proyecto de Gestión de Restaurantes con MongoDB

Este proyecto tiene como objetivo desarrollar una solución completa utilizando **MongoDB** para gestionar y analizar datos relacionados con **restaurantes**, **pedidos** y **reseñas**. Se enfoca en aplicar estructuras optimizadas (documentos embebidos y referenciados), operaciones CRUD avanzadas, agregaciones, manejo de archivos y visualizaciones, buscando mejorar tanto la experiencia del usuario como la administración de la información.

## 1. Crear instancia y obtener URI de conexión

Para utilizar la base de datos, es necesario contar con una **instancia activa en MongoDB Atlas** y haber creado una base de datos en dicha instancia. Desde el panel de MongoDB Atlas se puede generar la URI de conexión, que tiene el siguiente formato:

```bash
mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<base_de_datos>
```

Donde:

- `<usuario>` es el nombre de usuario de tu base de datos MongoDB.
- `<contraseña>` es la contraseña asociada a ese usuario.
- `<cluster>` es el nombre del clúster de MongoDB (por ejemplo, `cluster0`).
- `<base_de_datos>` es el nombre de la base de datos que deseas poblar.

> Esta URI se utilizará en varias partes, así que guárdala.

## 2. Poblar la base de datos

Existen dos formas principales de poblar la base de datos:

- Puedes **configurar tus propios datos**, siempre que sigas el modelo descrito en la documentación:  
  [**proyecto2/docs/model.md**](https://github.com/donmatthiuz/BasedeDato2/blob/proyecto2/proyecto2/docs/model.md)

- También puedes usar los **datos de ejemplo** disponibles en el repositorio, en:  
  [**proyecto2/data/**](https://github.com/donmatthiuz/BasedeDato2/tree/proyecto2/proyecto2/data)

### 2.1 Métodos para poblar

Puedes poblar la base de datos usando:

- **Mongoimport por línea de comandos**
- **MongoDB Compass** (interfaz gráfica)

Ambos métodos están explicados en detalle en:  
[**proyecto2/docs/seed.md**](https://github.com/donmatthiuz/BasedeDato2/blob/proyecto2/proyecto2/docs/seed.md)

> Si eliges usar `mongoimport`, asegúrate de seguir primero las instrucciones de instalación de herramientas en:  
[**proyecto2/docs/configuration.md**](https://github.com/donmatthiuz/BasedeDato2/blob/proyecto2/proyecto2/docs/configuration.md)
>
> Si prefieres usar **MongoDB Compass**, también puedes seguir el mismo documento para instalar la herramienta y luego seguir el procedimiento en `seed.md`.

## 3. Backend

Para levantar el servidor backend y consumir la base de datos a través de un servicio REST, sigue la guía detallada en:  
[**proyecto2/docs/backend.md**](https://github.com/donmatthiuz/BasedeDato2/blob/proyecto2/proyecto2/docs/backend.md)

Esta guía incluye cómo iniciar el servidor, probar los endpoints y realizar operaciones CRUD con la base de datos MongoDB.

## 4. Frontend

La interfaz de usuario permite visualizar y manipular los datos del proyecto interactuando con el backend. Para utilizarla, consulta la guía en:  
[**proyecto2/docs/frontend.md**](https://github.com/donmatthiuz/BasedeDato2/blob/proyecto2/proyecto2/docs/frontend.md)

Allí encontrarás los pasos para levantar el frontend, configurarlo y empezar a interactuar con el sistema.
