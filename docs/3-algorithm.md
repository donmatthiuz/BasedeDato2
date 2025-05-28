# Algoritmo de Sugerencia Guiada para Ensamblaje de Rompecabezas

## Objetivo

Diseñar un algoritmo que, dada una pieza seleccionada por el usuario (pieza libre), sugiera de forma determinista el siguiente paso de ensamblaje. El sistema debe indicar:

* A qué pieza debe conectarse.
* En qué lado.
* Qué pico de la pieza actual y qué hendidura de la pieza ensamblada deben utilizarse.

Debe funcionar aún si algunas piezas están marcadas como omitidas (faltantes).

## Supuestos del sistema

* Las piezas ya ensambladas están en la base de datos con estado `ensamblada`.
* Las piezas faltantes tienen estado `omitida` y deben ignorarse.
* Las relaciones `CONECTA_CON` indican conexiones válidas entre piezas.
* La convención de enumeración de picos y hendiduras es conocida por el backend.
* Cada pico/hendidura solo puede usarse una vez.
* Las piezas físicas están orientadas de forma fija con una **flecha hacia abajo**, por lo que **no hay rotación** en tiempo de ejecución.

## Definiciones clave

**Selección de picos/hendiduras:**
Cuando existen múltiples picos o hendiduras disponibles en el mismo lado, el sistema selecciona el primero **según el orden definido al registrarlos**. Este orden puede ser, por convención, desde el más cercano al centro geométrico de la pieza hacia los extremos. Para la primera versión, se tomará el primer disponible en el orden de numeración, sin heurística adicional.

**Relaciones `CONECTA_CON` y estados:**
Si una pieza involucrada en una relación `CONECTA_CON` cambia de estado a `omitida`, la relación no se elimina, pero se marca como `valida: false` para evitar que sea considerada en el algoritmo.

**Relación inversa:**
Cuando se crea una relación `CONECTA_CON`, el backend también crea su contraparte simétrica en dirección opuesta, con los valores de lado y conexión invertidos. Esto permite que las sugerencias funcionen desde cualquiera de las dos piezas.

## Flujo del Backend para la Sugerencia

1. El usuario selecciona una pieza `P` con estado `libre`.

2. El backend consulta los vecinos **ensamblados** en posiciones ortogonales (`top`, `right`, `bottom`, `left`) utilizando desplazamientos sobre `coordenada_x/y`.

3. Se evalúa cada vecino en ese orden:

   3.1 Si el lado correspondiente de `P` está en `bordes`, se ignora ese vecino.
   3.2 Si el lado opuesto en el vecino también es un borde, se ignora.
   3.3 Se verifica que ambos lados tengan encajes disponibles (un pico en `P` y una hendidura en el vecino).

4. Si se cumple lo anterior, se selecciona el primer pico libre de `P` y la primera hendidura libre del vecino.

5. Se construye la instrucción con los datos de conexión.

6. Si no hay conexiones válidas, se responde que la pieza no puede ser conectada actualmente.

## Pseudocódigo del algoritmo

```python
def sugerirSiguienteMovimiento(pieza_id):
    pieza = obtener_pieza(pieza_id)
    if pieza.estado != "libre":
        return {"error": "La pieza no está disponible para ensamblar"}

    vecinos_posibles = obtener_vecinos_ensamblados(pieza)

    for lado in ["top", "right", "bottom", "left"]:
        if lado in pieza.bordes or lado not in vecinos_posibles:
            continue

        vecino = vecinos_posibles[lado]
        if vecino.estado != "ensamblada":
            continue

        lado_opuesto = obtener_lado_opuesto(lado)
        if lado_opuesto in vecino.bordes:
            continue

        pico = obtener_pico_libre(pieza, lado)
        hendidura = obtener_hendidura_libre(vecino, lado_opuesto)

        if pico is None or hendidura is None:
            continue

        return {
            "pieza_actual": pieza.id,
            "pieza_objetivo": vecino.id,
            "lado_objetivo": lado_opuesto,
            "pico": pico,
            "hendidura": hendidura,
            "instruccion": f"Conecta la pieza {pieza.id} al lado {lado_opuesto} de la pieza {vecino.id} usando el pico {pico} y la hendidura '{hendidura}'"
        }

    return {"mensaje": "No hay conexión válida para esta pieza actualmente"}
```

## Consideraciones adicionales

* Las relaciones `CONECTA_CON` se crean automáticamente en ambas direcciones.
* Las relaciones activas se marcan con `valida: true`; si una de las piezas cambia de estado a `omitida`, dicha relación se actualiza a `valida: false`.
* La enumeración de picos y hendiduras se genera internamente de forma consistente, y su orden puede personalizarse en futuras versiones.
* El sistema asume orientación física fija con una flecha hacia abajo; no hay manipulación de rotación dinámica.
* El atributo `cola` ha sido eliminado del modelo, ya que no aporta valor práctico: cualquier parte no conectable ya está implícitamente determinada por la ausencia de picos/hendiduras o por estar marcada como `borde`.
