# Etapa 2

## Funcionalidades mínimas para implementar en la API

### 1. **Restaurantes**

- `POST /restaurantes` — Crear restaurante
- `GET /restaurantes` — Listar con filtros, ordenamiento, búsqueda por texto
- `GET /restaurantes/:id` — Ver detalle
- `PUT /restaurantes/:id` — Actualizar
- `DELETE /restaurantes/:id` — Eliminar

### 2. **Usuarios**

- `POST /usuarios` — Registrar usuario
- `GET /usuarios/:id` — Obtener detalle
- `PUT /usuarios/:id` — Actualizar datos
- `DELETE /usuarios/:id` — Eliminar

### 3. **Artículos del menú**

- `POST /menu` — Crear artículo de menú
- `GET /menu` — Filtrar por restaurante o disponibilidad
- `PUT /menu/:id` — Actualizar
- `DELETE /menu/:id` — Eliminar

### 4. **Órdenes/Pedidos**

- `POST /ordenes` — Crear pedido con array embebido de platillos
- `GET /ordenes` — Filtros por usuario, estado, restaurante, fecha
- `GET /ordenes/:id` — Detalle completo del pedido
- `PUT /ordenes/:id` — Actualizar estado
- `DELETE /ordenes/:id` — Eliminar

### 5. **Reseñas**

- `POST /resenas` — Crear reseña asociada a restaurante y orden
- `GET /resenas` — Filtrar por restaurante, orden o usuario
- `PUT /resenas/:id` — Actualizar comentario/calificación
- `DELETE /resenas/:id` — Eliminar

### 6. **Reportes (Agregaciones)**

- `GET /reportes/restaurantes-mejor-calificados` — Promedio de calificación
- `GET /reportes/platillos-mas-vendidos` — Usando `$unwind`, `$group`

### 7. **Archivos (GridFS)**

- `POST /archivos` — Subir archivo
- `GET /archivos/:id` — Descargar
