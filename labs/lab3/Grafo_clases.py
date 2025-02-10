class Nodo:
    def __init__(self, **kwargs):
        self.atributos = list(kwargs.keys())
        self.__dict__.update(kwargs)
        self.nombre_clase = self.__class__.__name__

    def __repr__(self):
        atributos = ", ".join(f"{k}={v}" for k, v in self.__dict__.items() if k != "atributos")
        return f"{self.__class__.__name__}({atributos})"
    
    def obtener_atributos(self):
        resultado = []
        for atributo in self.atributos:
            valor = getattr(self, atributo)
            resultado.append(f"{atributo}: {valor}")
        return resultado
    def obtener_primer_parametro(self):
        """Devuelve el valor del primer atributo del nodo."""
        if self.atributos:
            return getattr(self, self.atributos[0])
        return None


class User(Nodo):
    def __init__(self, name: str, userId: str):
        super().__init__(name=name, userId=userId)


class Movie(Nodo):
    def __init__(self, title: str, movieId: int, year: int, plot: str):
        super().__init__(title=title, movieId=movieId, year=year, plot=plot)