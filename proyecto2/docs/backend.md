# Backend REST Service with Express and Mongoose

Este proyecto es un servicio backend RESTful desarrollado con **Express** y **Mongoose**, diseñado para gestionar y analizar datos relacionados con restaurantes, pedidos, órdenes, reseñas y usuarios. El servicio permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los documentos de la base de datos.

## Objetivo

El objetivo de este servicio es permitir la gestión de los datos a través de los siguientes casos de uso:

- **GET**: Obtener información de restaurantes, pedidos, órdenes, reseñas y usuarios.
- **POST**: Crear nuevos documentos en la base de datos.
- **PUT**: Actualizar documentos existentes.
- **DELETE**: Eliminar documentos de la base de datos.

## Requisitos y Tecnologías

- **Node.js**: 18.20.4
- **npm**: 10.7.0
- **Express**: Framework web para Node.js
- **Mongoose**: ODM para interactuar con MongoDB

## Instalación

1. Clona este repositorio.
2. Accede a la carpeta `proyecto2/backend`.
3. Instala las dependencias necesarias ejecutando:

```bash
npm install
```

## Configuración

1. Crea un archivo `.env` en la carpeta **backend**. Este archivo debe contener dos parámetros:

    - **MONGO_URI**: La URI de conexión a tu base de datos MongoDB.
  
      ```bash
      MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<base_de_datos>
      ```

        Donde:
        - `<usuario>` es el nombre de usuario de tu base de datos MongoDB.
        - `<contraseña>` es la contraseña asociada a ese usuario.
        - `<cluster>` es el nombre del clúster de MongoDB (puede ser algo como `cluster0`).
        - `<base_de_datos>` es el nombre de la base de datos con la que deseas trabajar.

    - **PORT** (opcional): El puerto en el que el servidor escuchará. Si no se especifica, tomará el valor por defecto **3000**.

      ```bash
      PORT=3000
      ```

## Ejecutar el servicio

1. Inicia el servidor con el siguiente comando:

```bash
npm run dev
```

Este comando iniciará el servicio y te informará si la conexión a la base de datos se realizó con éxito. También te indicará en qué puerto está escuchando el servidor.

## Documentación de la API

Para acceder a la documentación de la API, abre tu navegador y ve a la siguiente URL:

```bash
http://localhost:3000/api-docs
```

Allí podrás ver todos los endpoints disponibles, con ejemplos de uso para **GET**, **POST**, **PUT** y **DELETE**.
