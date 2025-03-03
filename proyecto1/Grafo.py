import json
from neo4j import time as tm
class Nodo:
    def __init__(self, **kwargs):
        self.atributos = list(kwargs.keys())
        self.__dict__.update(kwargs)
        self.nombre_clase = self.__class__.__name__

    def __repr__(self):
        atributos = ", ".join(f"{k}={v}" for k, v in self.__dict__.items()
                              if k != "atributos" and v is not None)
        return f"{self.__class__.__name__}({atributos})"
    
    def obtener_atributos(self):
        return [f"{atributo}: {getattr(self, atributo)}" for atributo in self.atributos if getattr(self, atributo) is not None]
    
    def obtener_primer_parametro(self):
        """Devuelve el nombre y el valor del primer atributo del nodo."""
        if self.atributos:
            primer_atributo = self.atributos[0]
            valor = getattr(self, primer_atributo)
            return (primer_atributo, valor) if valor is not None else None
        return None

    def ge_propiedades_dic(self):
        """Devuelve un diccionario con los atributos que no son None, y convierte listas a formato compatible con Neo4j."""
        propiedades = {}
        for k in self.atributos:
            valor = getattr(self, k)
            if valor is not None:
                if isinstance(valor, list):
                    propiedades[k] = list(valor)  # Convertir explícitamente a lista (Neo4j acepta listas)
                else:
                    propiedades[k] = valor
        return propiedades  

    def to_json(self):
        """Devuelve los atributos del nodo en formato JSON."""
        return json.dumps(self.ge_propiedades_dic(), indent=4, ensure_ascii=False)


class Customer(Nodo):
    def __init__(self, customerId: str, customerName: str, gender: str, age: int,
                 customerContact: str, customerEmail: str, state: str, city: str):
        super().__init__(customerId=customerId, customerName=customerName, gender=gender,
                         age=age, customerContact=customerContact, customerEmail=customerEmail,
                         state=state, city=city)


class Merchant(Nodo):
    def __init__(self, merchantId: str, merchantCategory: str, riskLevel: int = 1,
                 merchantLocation: str = "No tiene", merchantName: str = ""):
        super().__init__(merchantId=merchantId, merchantCategory=merchantCategory,
                         riskLevel=riskLevel, merchantLocation=merchantLocation, 
                         merchantName=merchantId)


class Bank_Account(Nodo):
    def __init__(self, accountType: str, bankBranch: str, accountBalance: float,
                 currency: str, openDate: str = "2000-01-01", status: str = "Activa"):
        super().__init__(accountType=accountType, bankBranch=bankBranch,
                         accountBalance=accountBalance, currency=currency,
                         openDate=openDate, status=status)

class Device(Nodo):
    def __init__(self, deviceType: str, transactionDevice: str, deviceLocation: str = "No tiene"):
        super().__init__(deviceType=deviceType, deviceLocation=deviceLocation, 
                         transactionDevice=transactionDevice)


class Transactiones(Nodo):
    def __init__(self, transactionId: str, transactionDate, transactionAmount: float,
                 transactionType: str, transactionDescription: str, transactionCurrency: str,
                 transactionLocation: str, isFraudTeoric: bool):
        
        # Convertir transactionDate a string si es un objeto DateTime
        if isinstance(transactionDate, tm.DateTime):
            transactionDate = transactionDate.isoformat()

        super().__init__(transactionId=transactionId, transactionDate=transactionDate,
                         transactionAmount=transactionAmount, transactionType=transactionType,
                         transactionDescription=transactionDescription, transactionCurrency=transactionCurrency,
                         transactionLocation=transactionLocation, isFraudTeoric=isFraudTeoric)
