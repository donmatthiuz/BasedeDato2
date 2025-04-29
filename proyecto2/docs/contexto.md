# Restaurantes en MongoDB

## Descripción General

El objetivo del proyecto es desarrollar una solución basada en MongoDB que permita gestionar información relacionada con restaurantes, pedidos y reseñas. La base de datos deberá estar diseñada para optimizar la consulta, almacenamiento y análisis de datos mediante el uso de documentos embebidos y referenciados, operaciones CRUD, ordenamiento, proyecciones, manejo de archivos grandes, agregaciones y manipulación de arrays.

Se debe garantizar una gestión eficiente de los pedidos y reseñas, proporcionando una experiencia fluida para los usuarios y optimizando la administración de datos.

### Funcionalidades del Proyecto

- Registrar restaurantes
- Realizar pedidos
- Gestionar reseñas, utilizando estructuras de documentos que combinen información embebida y referenciada

Los pedidos deberán contener:

- Detalles de los platillos seleccionados
- Estado del pedido
- Usuario que lo realizó

Las reseñas estarán asociadas tanto a los restaurantes como a pedidos específicos.

También se podrá:

- Administrar restaurantes
- Administrar pedidos
- Administrar comentarios

### Requisitos Técnicos

- Implementar ordenamiento para clasificar:
  - Pedidos: por fecha, estado o monto total
  - Reseñas: por calificación o relevancia

- Uso de proyecciones para optimizar la carga de datos según el contexto

- Uso de agregaciones para generar reportes, como:
  - Restaurantes mejor calificados
  - Platillos más vendidos

## Desarrollo de la Solución

### 1. Desarrollo de una REST API

La REST API deberá gestionar los datos para almacenarlos y consumirlos desde MongoDB. Las funcionalidades mínimas incluyen:

- Documentos embebidos y referenciados
- Operaciones CRUD:
  - Crear uno o varios documentos
  - Consultar documentos con:
    - Filtros
    - Proyecciones
    - Ordenamiento
    - Skip
    - Limit
  - Actualizar uno o varios documentos
  - Eliminar uno o varios documentos
- Ordenamiento (`sort`)
- Proyecciones (`project`)
- Manejo y almacenamiento de archivos (por ejemplo, con GridFS)
- Agregaciones:
  - Simples: `count`, `distinct`, etc.
  - Complejas: pipelines de agregación, manejo de arrays con `$push`, `$pull`, `$addToSet`, etc.
  - Manejo de documentos embebidos
- Manejo de arrays
- Creación y uso de índices:
  - Simples
  - Compuestos
  - Multikey
  - Geoespaciales
  - Texto

**Nota:** La base de datos debe estar configurada para rechazar consultas que no utilicen índices. Por tanto, se deberán crear los índices necesarios para garantizar el funcionamiento correcto del servicio REST.

## Etapas del Proyecto

### Etapa 1

- Implementar las siguientes colecciones mínimas:
  - Restaurantes
  - Usuarios
  - Artículos del menú
  - Órdenes/Pedidos
  - Reseñas

- Argumentar cómo se implementarán todos los **aspectos evaluables del proyecto** (ver sección de rubrica más abajo)

### Etapa 2

- Elaborar el servicio REST
- Programar la solución en un lenguaje determinado
- Utilizar instancia de MongoDB Atlas
- Fomentar trabajo colaborativo
- Implementar todas las funcionalidades y cumplir con los aspectos evaluables

### Etapa 3

- Presentar el proyecto y su funcionamiento
- Cada grupo deberá:
  - Explicar su proyecto
  - Justificar el caso de uso
  - Demostrar cómo la solución cumple con cada uno de los **aspectos evaluables**

## Rubrica de Evaluación

| Categoría                     | Criterio                                                             | Puntaje |
|------------------------------|----------------------------------------------------------------------|---------|
| **Avances**                  | Etapa 1                                                              | 5       |
|                              | Etapa 2                                                              | 5       |
|                              | Precarga de datos con `mongoimport`                                  | 5       |
| **Índices**                  | Índice simple                                                        | 1       |
|                              | Índice compuesto                                                     | 1       |
|                              | Índice multikey                                                      | 1       |
|                              | Índice geoespacial                                                   | 1       |
|                              | Índice de texto                                                      | 1       |
|                              | Mínimo dos índices por colección                                     | -       |
| **Documentos**               | Embebidos                                                            | 5       |
|                              | Referenciados                                                        | 5       |
| **CRUD**                     | Creación (1 y varios documentos)                                     | 10      |
|                              | Consulta (filtros, proyecciones, ordenamiento, skip, limit)          | 10      |
|                              | Actualización (1 y varios documentos)                                | 10      |
|                              | Eliminación (1 y varios documentos)                                  | 10      |
| **GridFS**                   | Manejo de archivos (mínimo una colección con 50,000 documentos)      | 5       |
| **Agregaciones y otros**     | Agregaciones simples (count, distinct)                              | 5       |
|                              | Agregaciones complejas (pipelines)                                  | 10      |
|                              | Manejo de arrays (`$push`, `$pull`, `$addToSet`)                     | 5       |
|                              | Manejo de documentos embebidos                                       | 5       |
| **Extras**                   | Operaciones `bulkWrite`                                              | 5       |
|                              | Mongo Charts (máx. 6 puntos, 2 por gráfica con sentido de negocio)   | 6       |
|                              | BI Connectors (Power BI, Tableau, etc.)                              | 4       |
|                              | Frontend/HCI (interfaz amigable y excepcional)                       | 5       |

## Aspectos Evaluables del Proyecto

1. Uso de documentos embebidos y referenciados
2. CRUD completo (crear, consultar con filtros y proyecciones, actualizar, eliminar)
3. Ordenamiento en consultas
4. Uso de proyecciones para optimización
5. Manejo eficiente de archivos (ej. GridFS)
6. Agregaciones (simples y complejas con pipelines)
7. Manipulación de arrays (`$push`, `$pull`, `$addToSet`, etc.)
8. Creación y uso de índices adecuados:
   - Al menos dos por colección
   - Simples, compuestos, multikey, texto y geoespaciales
9. Implementación de operaciones `bulkWrite` (extra)
10. Visualización con Mongo Charts (extra)
11. Integración con herramientas de BI (extra)
12. Interfaz de usuario funcional y amigable (extra)
