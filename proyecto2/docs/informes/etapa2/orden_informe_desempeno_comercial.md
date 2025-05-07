# Análisis de Desempeño Comercial y Consumo en Restaurantes

Este informe busca evaluar el comportamiento económico y operativo de los restaurantes a través del análisis de sus órdenes, ingresos, productos más solicitados, eficiencia de entrega y evolución mensual. Se combina información de los modelos `Restaurante`, `Menú` y `Orden` para obtener una visión detallada sobre:

* Cuánto vende cada restaurante (en ingresos y volumen).
* Qué tan frecuentes son sus órdenes y cuáles son sus platillos más populares.
* Cuáles restaurantes dominan el mercado (ingresos, volumen de pedidos).
* Cómo evolucionan sus ingresos en el tiempo.
* Qué estados operativos predominan en sus órdenes (eficiencia operativa).
* Qué productos del menú no se están pidiendo (oportunidades de mejora en la oferta).

## Estructura del informe

### 1. Volumen General de Órdenes y Ventas por Restaurante

* Conteo total de órdenes por restaurante.
* Suma total de ingresos generados por cada restaurante.

**Análisis:** Permite identificar qué restaurantes tienen mayor actividad comercial y volumen de ventas. Esta información es clave para evaluar el rendimiento económico y la popularidad de cada establecimiento.

### 2. Frecuencia de Pedidos por Platillo

* Listado de platillos más vendidos (top N) por cantidad total solicitada.
* Acumulado de ingresos generados por cada platillo.

**Análisis:** Ayuda a determinar los productos estrella del menú. Este análisis puede orientar decisiones de marketing, promociones, y ajustes de inventario.

### 3. Evolución Mensual de Ingresos

* Agrupación de órdenes por mes y cálculo de ingresos mensuales por restaurante.

**Análisis:** Proporciona una vista temporal del desempeño económico. Es útil para detectar tendencias estacionales, crecimiento o caídas en la demanda.

### 4. Distribución de Estados de Órdenes

* Conteo de órdenes por estado (`pendiente`, `completada`, `cancelada`, etc.) por restaurante.
* Identificación de los restaurantes con mayores porcentajes de órdenes canceladas o pendientes.

**Análisis:** Refleja la eficiencia operativa del sistema. Un número alto de órdenes canceladas o pendientes puede indicar problemas logísticos o de atención. El estado de las órdenes proporciona información sobre la eficiencia operativa de cada restaurante. Un alto porcentaje de órdenes pendientes o canceladas podría indicar problemas en la gestión de pedidos, tiempos de espera largos o incluso insatisfacción del cliente. Esto proporciona a los restaurantes una visión crítica de la eficacia de sus operaciones.

### 5. Usuarios Recurrentes por Restaurante

* Número de usuarios recurrentes que realizan múltiples pedidos en un restaurante.
* Identificación de los restaurantes con una mayor base de clientes leales.

**Análisis:** Los usuarios recurrentes son una señal clara de la lealtad de los clientes. Los restaurantes con un alto número de usuarios recurrentes suelen ofrecer una experiencia satisfactoria que genera fidelidad. Este análisis ayuda a los restaurantes a identificar sus bases de clientes más leales y puede guiar decisiones estratégicas como la personalización de servicios y la creación de programas de fidelización.
