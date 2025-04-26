# Lab 8 - Aggregation Pipeline

## 2.1

## 2.2

## 2.3

## 2.4

## 2.5

## 2.6

## 2.7

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

## 2.9

## 2.10
