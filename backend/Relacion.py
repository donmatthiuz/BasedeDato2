class Relacion:
    def __init__(self, nodo_a, nodo_b, **kwargs):
        self.nodo_a = nodo_a
        self.nodo_b = nodo_b
        self.propiedades = kwargs
        self.nombre_clase = self.__class__.__name__

    def __repr__(self):
        props = ", ".join(f"{k}={v}" for k, v in self.propiedades.items())
        return f"{self.__class__.__name__}({self.nodo_a.nombre_clase} -> {self.nodo_b.nombre_clase}, {props})"
    
    def obtener_propiedades(self):
        return [f"{k}: {v}" for k, v in self.propiedades.items()]

class PERFORMS(Relacion):
    def __init__(self, nodo_a, nodo_b, channel, deviceUsed):
        super().__init__(nodo_a, nodo_b, channel=channel, deviceUsed=deviceUsed)


class INVOLVES(Relacion):
    def __init__(self, nodo_a, nodo_b, transactionCount = 0):
        super().__init__(nodo_a, nodo_b, transactionCount=transactionCount)


class HAPPENED_AT(Relacion):
    def __init__(self, nodo_a, nodo_b, balanceAfter, balanceBefore=0):
        super().__init__(nodo_a, nodo_b, balanceAfter=balanceAfter, balanceBefore=balanceBefore)


class USES(Relacion):
    def __init__(self, nodo_a, nodo_b, deviceTrustScore, usedAt):
        super().__init__(nodo_a, nodo_b, deviceTrustScore=deviceTrustScore, usedAt=usedAt)


class OWNS(Relacion):
    def __init__(self, nodo_a, nodo_b):
        super().__init__(nodo_a, nodo_b)
