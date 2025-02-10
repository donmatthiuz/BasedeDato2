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


class User(Nodo):
    def __init__(self, name: str, userId: str):
        super().__init__(name=name, userId=userId)

class Genre(Nodo):
    def __init__(self, name: str):
        super().__init__(name=name)

class Person_Director(Nodo):
    def __init__(self, name: str, tmdbId: int, born: str = None, died: str = None, 
                 bornIn: str = None, url: str = None, imdbId: int = None, 
                 bio: str = None, poster: str = None):
        super().__init__(name=name, tmdbId=tmdbId, born=born, died=died, 
                         bornIn=bornIn, url=url, imdbId=imdbId, bio=bio, poster=poster)


class Movie(Nodo):
    def __init__(self, title: str, movieId: int, year: int, plot: str, 
                 tmdbId: int = None, released: str = None, imdbRating: float = None, 
                 imdbId: int = None, runtime: int = None, countries: list = None, 
                 imdbVotes: int = None, url: str = None, revenue: int = None, 
                 poster: str = None, budget: int = None, languages: list = None):
        super().__init__(title=title, movieId=movieId, year=year, plot=plot,
                         tmdbId=tmdbId, released=released, imdbRating=imdbRating,
                         imdbId=imdbId, runtime=runtime, countries=countries,
                         imdbVotes=imdbVotes, url=url, revenue=revenue, 
                         poster=poster, budget=budget, languages=languages)



