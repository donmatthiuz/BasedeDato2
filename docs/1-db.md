# Diseño del Modelo de Datos – Esquema en Neo4j

## Entidades Principales (Nodos)

### 1. `Pieza`

Representa una unidad del rompecabezas.

#### Atributos

| Atributo              | Tipo       | Descripción                                                                                            |
| --------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| `id`                  | int        | Identificador único de la pieza                                                                        |
| `coordenada_x`        | int        | Posición horizontal en la solución (inicio desde arriba a la izquierda)                                |
| `coordenada_y`        | int        | Posición vertical en la solución                                                                       |
| `cantidad_picos`      | int        | Total de picos (sobresalientes), se enumeran en sentido horario desde la esquina superior izquierda    |
| `cantidad_hendiduras` | int        | Total de hendiduras (entradas), se enumeran en sentido antihorario desde la esquina inferior izquierda |
| `bordes`              | list\[str] | Lados sin conexiones posibles: `"top"`, `"right"`, `"bottom"`, `"left"`                                |
| `estado`              | string     | Estado actual: `"ensamblada"`, `"libre"`, `"omitida"`                                                  |

> Nota: Los picos y hendiduras no se almacenan explícitamente como listas. El backend los genera internamente según su cantidad y convención de orientación física (la pieza siempre se coloca con flecha apuntando hacia abajo).

## Relaciones (Aristas)

### 2. `CONECTA_CON`

Representa que una pieza se conecta físicamente con otra por medio de un pico y una hendidura compatibles.

#### Origen → Pieza A

#### Destino → Pieza B

#### Atributos de la relación

| Atributo            | Tipo    | Descripción                                                                                     |
| ------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `desde_lado`        | string  | Lado de la pieza origen desde donde se establece la conexión (`top`, `right`, `bottom`, `left`) |
| `hacia_lado`        | string  | Lado correspondiente de la pieza destino                                                        |
| `pico_origen`       | int     | Número del pico usado en la pieza origen, asignado según convención horario                     |
| `hendidura_destino` | str     | Letra de la hendidura usada en la pieza destino, asignada en orden antihorario                  |
| `valida`            | boolean | Indica si la relación es válida actualmente (por ejemplo, ambas piezas están activas)           |

> Si una de las piezas involucradas cambia su estado a `"omitida"`, la relación `CONECTA_CON` permanece, pero el atributo `valida` debe establecerse en `false`. Esto permite mantener la historia de conexión sin interferir en la lógica de ensamblaje activa.

## Esquema General del Grafo

```plaintext
(Pieza)-[:CONECTA_CON {desde_lado, hacia_lado, pico_origen, hendidura_destino, valida}]->(Pieza)
```

## Consideraciones de diseño

* El atributo `estado` permite omitir piezas en tiempo real sin eliminar su información estructural o conexiones pasadas.
* La orientación física está fija por diseño mediante una marca visual (flecha apuntando hacia abajo), eliminando la necesidad de atributos de rotación.
* Los picos y hendiduras se asignan automáticamente en función de su cantidad y convención posicional:

  * Picos: orden horario desde la esquina superior izquierda.
  * Hendiduras: orden antihorario desde la esquina inferior izquierda.
* Si existen múltiples picos o hendiduras disponibles en un lado, el sistema selecciona el primero **según su orden lógico interno**, aunque puede priorizar opcionalmente aquellos **más cercanos al centro de la figura** para evitar bordes exteriores inestables.
* El backend considera el orden de búsqueda de vecinos ensamblados en la secuencia **top → right → bottom → left**, priorizando el ensamblaje vertical hacia abajo como primer objetivo.
* La relación `CONECTA_CON` puede existir en ambos sentidos (pieza A a B y B a A). El backend la genera automáticamente en una sola dirección cuando se registra la pieza, y crea la inversa solo cuando sea necesario (por ejemplo, si se usa el vecino como punto de partida de una nueva sugerencia).
