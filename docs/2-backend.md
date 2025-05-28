# Lógica Inteligente del Backend para Registrar Conexiones de Piezas

## 1. Datos de entrada (por cada pieza)

El backend recibirá un JSON como el siguiente:

```json
{
  "id": 7,
  "coordenada_x": 2,
  "coordenada_y": 1,
  "cantidad_picos": 3,
  "cantidad_hendiduras": 2,
  "bordes": ["left", "bottom"],
  "vecinos": {
    "top": 2,
    "right": 5
  },
  "estado": "ensamblada"
}
```

> El sistema asume que cada pieza está orientada físicamente hacia abajo, indicada por una flecha marcada sobre ella. Esto garantiza que la enumeración de picos (sentido horario desde la esquina superior izquierda) y hendiduras (sentido antihorario desde la esquina inferior izquierda) se mantenga coherente en todas las piezas, sin necesidad de almacenar un atributo de rotación.

## 2. Lógica del backend para procesar los datos

### Paso 1: Registrar nodo `Pieza`

Se guarda la pieza con todos sus atributos: coordenadas, bordes, estado, etc.

### Paso 2: Asignar picos y hendiduras de forma determinística

* Los picos se enumeran automáticamente desde la esquina superior izquierda, recorriendo la pieza en sentido horario: `0, 1, 2, ...`.
* Las hendiduras se enumeran desde la esquina inferior izquierda, recorriendo en sentido antihorario: `'a', 'b', 'c', ...`.

> Si hay múltiples picos u hendiduras en un mismo lado, se selecciona primero el que esté **más próximo al centro geométrico del lado**. Este criterio evita decisiones arbitrarias y promueve simetría en el armado. Si no puede determinarse el centro (por igual distancia), se aplica el orden de numeración como desempate.

### Paso 3: Verificar los vecinos y detectar conexiones válidas

El sistema sigue un orden de búsqueda de vecinos ensamblados en este orden fijo: **top → right → bottom → left**.

Para cada dirección:

1. Si existe un vecino declarado en esa dirección y el lado correspondiente **no figura en `bordes`**, se procede con la evaluación.
2. Se consulta el estado del vecino. Solo se consideran vecinos con estado `ensamblada`.
3. Se valida que el vecino no tenga el lado opuesto marcado como borde.
4. Se verifica que ambas piezas tengan picos y hendiduras libres compatibles.
5. Si se cumple todo lo anterior:

   * Se toma el primer pico libre disponible de la pieza actual.
   * Se toma la primera hendidura libre disponible del vecino.
   * Se crea una relación `CONECTA_CON` desde la pieza actual hacia el vecino.
   * Se marca el pico y la hendidura como utilizados.

### Paso 4: Detección de bordes

* Si un lado de la pieza está incluido en `bordes` y **no hay vecino**, ese lado se marca como no conectable.
* Si existe vecino pero el lado aparece en `bordes`, **no se crea conexión**.
* Si hay vecino y el lado **no está en `bordes`**, se evalúa para conexión.

## 3. Ejemplo de procesamiento interno del backend

Con la entrada del JSON:

```json
{
  "id": 7,
  "coordenada_x": 2,
  "coordenada_y": 1,
  "cantidad_picos": 3,
  "cantidad_hendiduras": 2,
  "bordes": ["left", "bottom"],
  "vecinos": {
    "top": 2,
    "right": 5
  },
  "estado": "ensamblada"
}
```

El backend:

* Crea el nodo `Pieza 7` con 3 picos (`[0, 1, 2]`) y 2 hendiduras (`['a', 'b']`).
* Evalúa los vecinos:

  * Para **top → pieza 2**:

    * Lado válido (no está en bordes).
    * Si pieza 2 está ensamblada y tiene hendiduras disponibles, se genera la relación usando el primer pico y primera hendidura disponibles.
  * Para **right → pieza 5**:

    * Aplica la misma lógica.
* Crea relaciones `CONECTA_CON` y marca los picos/hendiduras usados.

## 4. Consideraciones clave

* El usuario no necesita indicar qué pico o hendidura se usa. El backend lo infiere por convención y disponibilidad.
* Las piezas siempre deben estar orientadas con la flecha apuntando hacia abajo; esto asegura coherencia en la enumeración interna.
* La base de datos mantiene registro del estado de uso de cada pico/hendidura para evitar reutilización.
* Si no hay elementos disponibles para formar una conexión, el sistema omite la creación y puede reportar advertencia.
* Las relaciones `CONECTA_CON` incluyen la dirección de conexión (`desde_lado`, `hacia_lado`, `pico_origen`, `hendidura_destino`) y se marcan como válidas.
* **Relaciones hacia piezas omitidas no se eliminan, pero se marcan como no válidas (`valida: false`)**. Esto permite mantener trazabilidad sin interferir con sugerencias activas.
* El sistema puede generar automáticamente la **relación inversa** cuando se confirma la conexión, para que cualquier pieza pueda iniciar una sugerencia en ambos sentidos.
