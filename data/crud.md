# **🔹 Modelo de Datos**

```plaintext
(:Customer) -[:PERFORMS {channel, deviceUsed}]-> (:Transaction) 
(:Transaction) -[:INVOLVES]-> (:Merchant) 
(:Transaction) -[:HAPPENED_AT {balanceAfter}]-> (:Bank_Account) 
(:Transaction) -[:USES {deviceTrustScore, usedAt}]-> (:Device) 
(:Customer) -[:OWNS]-> (:Bank_Account)
```

✅ **Resumen de Relaciones**:

- **PERFORMS**: Un **Cliente** realiza una **Transacción** usando un dispositivo.
- **INVOLVES**: Una **Transacción** involucra un **Comercio**.
- **HAPPENED_AT**: Una **Transacción** ocurrió en una **Cuenta Bancaria**.
- **USES**: Una **Transacción** usó un **Dispositivo** con cierto nivel de confianza.
- **OWNS**: Un **Cliente** posee una **Cuenta Bancaria**.

## **🔹 Queries CRUD Utilizados**

### **1️⃣ Creación de Nodos**

#### ✅ **Crear Cliente**

```cypher
CREATE (c:Customer {customerId: '123', customerName: 'Juan Pérez', gender: 'M', age: 30, 
                     customerContact: '+91 9876543210', customerEmail: 'juan@example.com',
                     state: 'Delhi', city: 'New Delhi'})
```

#### ✅ **Crear Comercio**

```cypher
CREATE (m:Merchant {merchantId: 'M001', merchantCategory: 'Retail', riskLevel: 2,
                     merchantLocation: 'Mumbai', merchantName: 'Tienda XYZ'})
```

#### ✅ **Crear Cuenta Bancaria**

```cypher
CREATE (b:Bank_Account {accountType: 'Savings', bankBranch: 'Mumbai Branch', accountBalance: 1500.00, 
                         currency: 'INR', openDate: datetime('2023-01-01T10:00:00'), status: 'Active'})
```

#### ✅ **Crear Dispositivo**

```cypher
CREATE (d:Device {deviceType: 'Mobile', deviceLocation: 'Bangalore', transactionDevice: 'Android'})
```

#### ✅ **Crear Transacción**

```cypher
CREATE (t:Transaction {transactionId: 'T001', transactionDate: datetime('2024-03-02T15:30:00+05:30'),
                        transactionAmount: 500.00, transactionType: 'Online', transactionDescription: 'Compra en XYZ',
                        transactionCurrency: 'INR', transactionLocation: 'Mumbai', isFraudTeoric: false})
```

### **2️⃣ Creación de Relaciones**

#### ✅ **Un Cliente realiza una Transacción (`PERFORMS`)**

```cypher
MATCH (c:Customer {customerId: '123'}), (t:Transaction {transactionId: 'T001'})
MERGE (c)-[:PERFORMS {channel: 'Mobile', deviceUsed: 'Android'}]->(t)
```

#### ✅ **Una Transacción involucra un Comercio (`INVOLVES`)**

```cypher
MATCH (t:Transaction {transactionId: 'T001'}), (m:Merchant {merchantId: 'M001'})
MERGE (t)-[:INVOLVES]->(m)
```

#### ✅ **Una Transacción ocurrió en una Cuenta Bancaria (`HAPPENED_AT`)**

```cypher
MATCH (t:Transaction {transactionId: 'T001'}), (b:Bank_Account {accountType: 'Savings'})
MERGE (t)-[:HAPPENED_AT {balanceAfter: 1000.00}]->(b)
```

#### ✅ **Una Transacción usó un Dispositivo (`USES`)**

```cypher
MATCH (t:Transaction {transactionId: 'T001'}), (d:Device {deviceType: 'Mobile'})
MERGE (t)-[:USES {deviceTrustScore: 0.80, usedAt: datetime('2024-03-02T15:30:00+05:30')}]->(d)
```

#### ✅ **Un Cliente posee una Cuenta Bancaria (`OWNS`)**

```cypher
MATCH (c:Customer {customerId: '123'}), (b:Bank_Account {accountType: 'Savings'})
MERGE (c)-[:OWNS]->(b)
```

### **3️⃣ Lectura de Datos (Read)**

#### ✅ **Obtener todas las transacciones de un cliente**

```cypher
MATCH (c:Customer {customerId: '123'})-[:PERFORMS]->(t:Transaction)
RETURN t
```

#### ✅ **Obtener detalles de una transacción con su comercio y cuenta bancaria**

```cypher
MATCH (t:Transaction {transactionId: 'T001'})-[:INVOLVES]->(m:Merchant),
      (t)-[:HAPPENED_AT]->(b:Bank_Account)
RETURN t, m, b
```

#### ✅ **Obtener transacciones realizadas con un dispositivo específico**

```cypher
MATCH (t:Transaction)-[r:USES]->(d:Device {deviceType: 'Mobile'})
RETURN t, r.deviceTrustScore
```

### **4️⃣ Actualización de Datos (Update)**

#### ✅ **Actualizar el saldo de una cuenta bancaria**

```cypher
MATCH (b:Bank_Account {accountType: 'Savings'})
SET b.accountBalance = 2000.00
RETURN b
```

#### ✅ **Actualizar la categoría de un comercio**

```cypher
MATCH (m:Merchant {merchantId: 'M001'})
SET m.merchantCategory = 'Supermarket'
RETURN m
```

### **5️⃣ Eliminación de Datos (Delete)**

#### ✅ **Eliminar una transacción específica**

```cypher
MATCH (t:Transaction {transactionId: 'T001'})
DETACH DELETE t
```

📌 **Nota:** `DETACH DELETE` elimina el nodo junto con sus relaciones.

#### ✅ **Eliminar un cliente y todas sus transacciones**

```cypher
MATCH (c:Customer {customerId: '123'})-[r:PERFORMS]->(t:Transaction)
DETACH DELETE c, t
```

### **🔹 Ediciones Adicionales Relaciones**

#### **🔹 1. Actualizar `INVOLVES` con `transaction_count`**

📌 **Objetivo**: Contar el número de transacciones que involucran un comercio y agregar la propiedad `transaction_count` en la relación.

```cypher
MATCH (m:Merchant)<-[r:INVOLVES]-(t:Transaction)
WITH m, r, COUNT(t) AS tx_count
SET r.transaction_count = tx_count
RETURN m.merchantName, r.transaction_count
```

#### **🔹 2. Actualizar `HAPPENED_AT` con `balance_before`**

📌 **Objetivo**: Calcular el saldo antes de la transacción (`balance_before = accountBalance + transactionAmount`) y asignarlo a la relación.

```cypher
MATCH (b:Bank_Account)<-[r:HAPPENED_AT]-(t:Transaction)
SET r.balance_before = b.accountBalance + t.transactionAmount
RETURN b.accountType, r.balance_before
```

### **🔹 Consideraciones sobre la Hora en Neo4j**

- Neo4j almacena **`datetime`** en formato ISO 8601 (`YYYY-MM-DDTHH:MM:SS±hh:mm`).
- La zona horaria en este caso es **IST (UTC+5:30)**, por lo que los valores de **`datetime`** pueden variar al ser interpretados en otras regiones.
- Si necesitas convertirlo en otra zona horaria:

  ```cypher
  RETURN datetime().timezone
  ```

  Esto devuelve la zona horaria actual utilizada por Neo4j.
