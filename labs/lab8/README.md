# Lab 8 - Aggregations - Pipelines

## 2.1 - Resumen de transacciones por cuenta

```javascript
db.transactions.aggregate([
  {
    $unwind: "$transactions",
  },
  {
    $group: {
      _id: "$account_id",
      total_transactions: { $sum: 1 },
      total_amount: { $sum: "$transactions.amount" },
      average_amount: { $avg: "$transactions.amount" },
    },
  },
  // buscar con customers
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "accounts",
      as: "customer_info",
    },
  },
  {
    $project: {
      account_id: "$_id",
      name: { $arrayElemAt: ["$customer_info.name", 0] },
      city: {
        $let: {
          vars: {
            address: { $arrayElemAt: ["$customer_info.address", 0] },
            parts: {
              $split: [{ $arrayElemAt: ["$customer_info.address", 0] }, "\n"],
            },
          },
          in: { $arrayElemAt: ["$$parts", 1] },
        },
      },
      total_transactions: 1,
      average_amount: { $round: ["$average_amount", 2] },
      _id: 0,
    },
  },
  {
    $sort: { total_transactions: -1 },
  },
]);
```

### Resultado

![Resultado Ejecución Pipeline](./images/Respuesta_2_1.png)

## 2.2 - Clasificación de cuentas por balance

```javascript
db.accounts.aggregate([
  {
    $lookup: {
      from: "account_summaries",
      localField: "products",
      foreignField: "_id",
      as: "balance_info",
    },
  },
  {
    $unwind: "$balance_info",
  },
  {
    $group: {
      _id: "$account_id",
      total_balance: { $sum: { $toDouble: "$balance_info.average_balance" } },
      account_data: { $first: "$$ROOT" },
    },
  },
  {
    $lookup: {
      from: "customers",
      localField: "account_data.account_id",
      foreignField: "accounts",
      as: "customer_info",
    },
  },
  {
    $unwind: "$customer_info",
  },
  {
    $project: {
      name: "$customer_info.name",
      total_balance: 1,
      category: {
        $switch: {
          branches: [
            { case: { $lt: ["$total_balance", 5000] }, then: "Bajo" },
            {
              case: {
                $and: [
                  { $gte: ["$total_balance", 5000] },
                  { $lte: ["$total_balance", 20000] },
                ],
              },
              then: "Medio",
            },
            { case: { $gt: ["$total_balance", 20000] }, then: "Alto" },
          ],
          default: "Sin categoría",
        },
      },
    },
  },
  {
    $sort: { total_balance: -1 },
  },
]);
```

### Resultado

![Resultado Ejecución Pipeline](./images/Respuesta_2_2.png)

## 2.3 - Balance máximo por ciudad

```javascript
db.accounts.aggregate([
  {
    // resumen para balance
    $lookup: {
      from: "account_summaries",
      localField: "products",
      foreignField: "_id",
      as: "balance_data",
    },
  },
  { $unwind: "$balance_data" },
  {
    $group: {
      // balance total
      _id: "$account_id",
      total_balance: { $sum: { $toDouble: "$balance_data.average_balance" } },
      original_doc: { $first: "$$ROOT" },
    },
  },
  {
    // info clientes
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "accounts",
      as: "customer_data",
    },
  },
  {
    // solo asociados
    $match: { customer_data: { $ne: [] } },
  },
  { $unwind: "$customer_data" },
  {
    // ciudad
    $addFields: {
      city: {
        $let: {
          vars: {
            addressParts: { $split: ["$customer_data.address", "\n"] },
          },
          in: { $arrayElemAt: ["$$addressParts", 1] },
        },
      },
    },
  },
  { $sort: { city: 1, total_balance: -1 } },
  {
    // agrupar por ciudad y max balance mayor
    $group: {
      _id: "$city",
      name: { $first: "$customer_data.name" },
      max_balance: { $first: "$total_balance" },
    },
  },
  {
    $project: {
      _id: 0,
      ciudad: "$_id",
      nombre: "$name",
      balance_total: "$max_balance",
    },
  },
  {
    // ordenar ciudad alfabéticamente
    $sort: { ciudad: 1 },
  },
]);
```

### Resultado

![Resultado Ejecución Pipeline](./images/Respuesta_2_3.png)

## 2.4 - Top 10 transacciones recientes y grandes

```javascript
db.transactions.aggregate([
  { $unwind: "$transactions" },
  // filtro 6 meses
  {
    $match: {
      "transactions.date": {
        $gte: new Date("2016-06-01"),
        $lte: new Date("2016-12-31"),
      },
    },
  },
  { $sort: { "transactions.amount": -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: "accounts",
      localField: "account_id",
      foreignField: "account_id",
      as: "account_info",
    },
  },
  { $unwind: "$account_info" },
  // info clientes
  {
    $lookup: {
      from: "customers",
      localField: "account_info.account_id",
      foreignField: "accounts",
      as: "customer_info",
    },
  },
  { $unwind: "$customer_info" },
  {
    $project: {
      _id: 0,
      fecha_transaccion: "$transactions.date",
      monto: "$transactions.amount",
      tipo: "$transactions.transaction_code",
      simbolo: "$transactions.symbol",
      cliente: "$customer_info.name",
      ciudad: {
        $arrayElemAt: [{ $split: ["$customer_info.address", "\n"] }, 1],
      },
      cuenta_id: "$account_id",
    },
  },
]);
```

### Resultado

![Resultado Ejecución Pipeline](./images/Respuesta_2_4.png)

## 2.5 - Variación porcentual entre transacciones más antigua y más reciente por cliente

## 2.6 - Agrupación de transacciones por mes y tipo con totales y promedios

## 2.7 - Identificación y almacenamiento de clientes inactivos

## 2.8 - Pipeline de agregación para crear un resumen de cuentas

**Estrategia:**

1. **Descomponer el array de productos en documentos individuales.**  
   Se utiliza `$unwind` para dividir el arreglo `products` en documentos individuales. Esto permite trabajar cada tipo de producto (cuenta) por separado.

2. **Hacer un lookup para obtener las transacciones de cada cuenta.**  
   Se aplica `$lookup` para hacer un "join" con la colección `transactions`. La unión se realiza usando el campo `account_id`, y las transacciones relacionadas se guardan en el campo `account_transactions`, que es un arreglo de documentos.

3. **Calcular el balance de cada cuenta.**  
   Se usa `$addFields` para agregar un nuevo campo llamado `balance`, el cual representa la suma de los totales de todas las transacciones asociadas a la cuenta.  
   - **balance:** Se crea como un nuevo campo temporal.
   - **$map:** Recorre el arreglo de transacciones para transformar cada una.
   - **input:** Se toma el arreglo `account_transactions.transactions`, accediendo al primer elemento con `$arrayElemAt` (`["$account_transactions.transactions", 0]`), que representa la lista de transacciones de la cuenta.
   - **as:** Cada transacción individual se referencia como `t`.
   - **in:** Para cada `t`, se extrae el campo `total` y se convierte a número decimal usando `$toDecimal`, ya que originalmente es un string.
   - **$sum:** Se suman todos los valores transformados para obtener el `balance` de la cuenta.

4. **Agrupar por producto y calcular el total de cuentas y el balance promedio.**  
   Se aplica `$group` para agrupar los documentos por tipo de producto (`products`). En este paso se calcula:
   - `total_accounts`: El número total de cuentas por tipo de producto.
   - `average_balance`: El promedio de balance de las cuentas agrupadas por producto.

5. **Guardar el resultado en la colección `account_summaries`.**  
   Finalmente, se utiliza `$merge` para guardar el resultado en la colección `account_summaries`. Esta operación inserta nuevos documentos o actualiza los existentes, según corresponda.

```javascript
[
  {
    $unwind:
      {
        path: "$products",
      },
  },
  {
    $lookup:
      {
        from: "transactions",
        localField: "account_id",
        foreignField: "account_id",
        as: "account_transactions",
      },
  },
  {
    $addFields:
      {
        balance: {
          $sum: {
            $map: {
              input: {
                $arrayElemAt: ["$account_transactions.transactions", 0],
              },
              as: "t",
              in: {
                $toDecimal: "$$t.total",
              },
            },
          },
        },
      },
  },
  {
    $group:
      {
        _id: "$products",
        total_accounts: {
          $sum: 1,
        },
        average_balance: {
          $avg: "$balance",
        },
      },
  },
  {
    $merge:
      {
        into: "account_summaries",
      },
  },
];
```

### Resultado

![Resultado Ejecución Pipeline](./images/2_8-part1.png)

![Resultado Account Summaries](./images/2_8-part2.png)

## 2.9 - Pipeline de agregación para identificar clientes de alto valor

**Estrategia:**

1. **Hacer un lookup para obtener las transacciones de cada cliente.**  
   Se utiliza `$lookup` para realizar un "join" entre la colección actual (clientes) y la colección `transactions`.  
   - **localField:** `accounts`, que contiene los `account_id` asociados al cliente.
   - **foreignField:** `account_id`, el campo en la colección `transactions`.
   - **as:** Se almacena el resultado en el nuevo campo `customer_transactions`, que será un arreglo de documentos con las transacciones de cada cuenta.

2. **Calcular el balance total y el número de transacciones por cliente.**  
   Se aplica `$addFields` para agregar dos nuevos campos:
   - **total_balance:**  
     Se calcula sumando los montos de todas las transacciones del cliente.
     - **$map:** Recorre el arreglo `customer_transactions`.
     - **input:** Cada elemento del arreglo representa un grupo de transacciones por cuenta.
     - **as:** Se referencia a cada grupo como `trans`.
     - **in:**  
       Para cada grupo `trans`, se suman los valores de `total` de sus transacciones individuales:
       - Se accede a `trans.transactions`.
       - Se usa otro `$map` para convertir cada `total` (originalmente string) a decimal usando `$toDecimal`.
       - Se suman los montos de las transacciones del grupo.
   - **total_transactions:**  
     Se calcula sumando el campo `transaction_count` de cada elemento en `customer_transactions`, representando el total de transacciones del cliente.

3. **Filtrar solo clientes de alto valor.**  
   Se utiliza `$match` para seleccionar únicamente los clientes que cumplen ambos criterios:
   - **total_balance > 30,000** unidades monetarias.
   - **total_transactions > 5** transacciones.

4. **Proyectar solo los campos relevantes.**  
   Con `$project`, se seleccionan los campos que se quieren conservar en el resultado:
   - `name`
   - `email`
   - `total_balance`
   - `total_transactions`

5. **Guardar el resultado en la colección high_value_customers.**  
   Finalmente, se usa `$merge` para guardar los resultados en la colección `high_value_customers`.  
   Esta operación insertará nuevos documentos o actualizará los existentes si es necesario.

```javascript
[
  {
    $lookup: {
      from: "transactions",
      localField: "accounts",
      foreignField: "account_id",
      as: "customer_transactions",
    },
  },
  {
    $addFields: {
      total_balance: {
        $sum: {
          $map: {
            input: "$customer_transactions",
            as: "trans",
            in: {
              $sum: {
                $map: {
                  input: "$$trans.transactions",
                  as: "t",
                  in: {
                    $toDecimal: "$$t.total",
                  },
                },
              },
            },
          },
        },
      },
      total_transactions: {
        $sum: "$customer_transactions.transaction_count",
      },
    },
  },
  {
    $match: {
      total_balance: {
        $gt: 30000,
      },
      total_transactions: {
        $gt: 5,
      },
    },
  },
  {
    $project: {
      name: 1,
      email: 1,
      total_balance: 1,
      total_transactions: 1,
    },
  },
  {
    $merge: {
      into: "high_value_customers",
    },
  },
];
```

### Resultado

![Resultado Ejecución Pipeline](./images/2_9-part1.png)

![Resultado High Value Customers](./images/2_9-part2.png)

## 2.10 - Clasificación de clientes según promedio mensual de transacciones en el último año
