from Grafo_clases import Movie, User

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


class RATED(Relacion):
    def __init__(self, nodo_a, nodo_b, rating, timestamp, **kwargs):
        super().__init__(nodo_a, nodo_b, rating=rating, timestamp=timestamp, **kwargs)


# # Ejemplo de uso
# usuario = User(name="Juan", userId="123")
# pelicula = Movie(title="Inception", movieId=1, year=2010, plot="Dream invasion.")

# # Creando la relación RATED con calificación y timestamp
# relacion_rated = RATED(usuario, pelicula, rating=5, timestamp="2024-02-09T12:34:56Z")

# print(relacion_rated)
# print(relacion_rated.obtener_propiedades())
