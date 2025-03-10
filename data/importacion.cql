// Creación de nodos

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MERGE (c:Customer {
  customerId: row.Customer_ID,
  customerName: row.Customer_Name,
  gender: row.Gender,
  age: toInteger(row.Age),
  state: row.State,
  city: row.City,
  customerEmail: row.Customer_Email,
  customerContact: row.Customer_Contact
});

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MERGE (t:Transaction {
    transactionId: row.Transaction_ID,
    transactionAmount: toFloat(row.Transaction_Amount),
    transactionType: row.Transaction_Type,
    transactionDescription: row.Transaction_Description,
    transactionCurrency: row.Transaction_Currency,
    transactionLocation: split(row.Transaction_Location, ", "),  // Convierte la ubicación en una lista
    isFraudEmpiric: toBoolean(row.Is_Fraud_Teoric)  // Convierte "False"/"True" a Booleano
});

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MERGE (d:Device {
    deviceType: row.Device_Type,
    transactionDevice: row.Transaction_Device
});

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MERGE (m:Merchant {
    merchantId: row.Merchant_ID,
    merchantCategory: row.Merchant_Category
});

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MERGE (b:Bank_Account {
    accountType: row.Account_Type,
    bankBranch: row.Bank_Branch,
    currency: row.Transaction_Currency
});

CREATE INDEX FOR (c:Customer) ON (c.customerId);
CREATE INDEX FOR (t:Transaction) ON (t.transactionId);
CREATE INDEX FOR (m:Merchant) ON (m.merchantId);
CREATE INDEX FOR (d:Device) ON (d.deviceType);
CREATE INDEX FOR (l:Location) ON (l.locationName);

// Relaciones

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MATCH (c:Customer {customerId: row.Customer_ID})
MATCH (b:Bank_Account {accountType: row.Account_Type, bankBranch: row.Bank_Branch, currency: row.Transaction_Currency})
MERGE (c)-[:OWNS]->(b);

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MATCH (c:Customer {customerId: row.Customer_ID})
MATCH (t:Transaction {transactionId: row.Transaction_ID})
MERGE (c)-[:PERFORMS {deviceUsed: row.Device_Type}]->(t);

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MATCH (t:Transaction {transactionId: row.Transaction_ID})
MATCH (b:Bank_Account {accountType: row.Account_Type, bankBranch: row.Bank_Branch, currency: row.Transaction_Currency})
MERGE (t)-[:HAPPENED_AT {
    balanceBefore: toFloat(row.Transaction_Amount) + toFloat(row.Account_Balance),
    balanceAfter: toFloat(row.Account_Balance)
}]->(b);

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MATCH (t:Transaction {transactionId: row.Transaction_ID})
MATCH (d:Device {deviceType: row.Device_Type, transactionDevice: row.Transaction_Device})
MERGE (t)-[:USES {
    usedAt: datetime(replace(row.Transaction_Date_Time, " ", "T")),
    deviceTrustScore: toFloat(row.Device_Trust_Score)
}]->(d);

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MATCH (t:Transaction {transactionId: row.Transaction_ID})
MATCH (m:Merchant {merchantId: row.Merchant_ID})
MERGE (t)-[:INVOLVES]->(m);

// Aseguramiento de creación

MATCH (n:Device)
RETURN keys(n) AS propiedades
LIMIT 1;

MATCH ()-[r:USES]->()
RETURN keys(r) AS propiedades
LIMIT 1;

// Adicionales

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MERGE (l:Location {locationName: row.Transaction_Location});

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MERGE (t:Transaction {
    transactionId: row.Transaction_ID,
    transactionAmount: toFloat(row.Transaction_Amount),
    transactionType: row.Transaction_Type,
    transactionDescription: row.Transaction_Description,
    transactionCurrency: row.Transaction_Currency,
    transactionDate: datetime(replace(row.Transaction_Date_Time, " ", "T")),
    isFraud: toBoolean(row.Is_Fraud_Teoric)  // Convierte "False"/"True" a Booleano
})
WITH t, row
MATCH (l:Location {locationName: row.Transaction_Location})
MERGE (t)-[:OCCURRED_AT]->(l);


LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MATCH (c:Customer {customerId: row.Customer_ID})
MATCH (d:Device {deviceType: row.Device_Type, transactionDevice: row.Transaction_Device})
MERGE (c)-[:ASSOCIATED_WITH]->(d);

MATCH (c:Customer)-[:PERFORMS]->(t1:Transaction)
MATCH (c)-[:PERFORMS]->(t2:Transaction)
WHERE t1.transactionDate < t2.transactionDate
MERGE (t1)-[:PREV_TX]->(t2);

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MATCH (c1:Customer), (c2:Customer)
WHERE c1.customerId <> c2.customerId AND c1.customerContact = c2.customerContact
MERGE (c1)-[:SHARED_PHONE]->(c2);

LOAD CSV WITH HEADERS FROM 'https://gist.githubusercontent.com/JosueSay/dbada8eb28fcab981f874bdbb155c974/raw/b713ff3cc1c97f29959f7d3fab0089609be1c4e5/data_fraud.csv' AS row
MATCH (c1:Customer), (c2:Customer)
WHERE c1.customerId <> c2.customerId AND c1.customerEmail = c2.customerEmail
MERGE (c1)-[:SHARED_EMAIL]->(c2);