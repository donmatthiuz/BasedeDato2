#Creacion de usuarios
def create_user(driver, name:str, userId: int):
    query = """
    CREATE(n:User{name: $name, userId: $userId})
    """
    print(f"Creando usuario {name} con ID {userId}")
    summary = driver.execute_query(
        query,
        name=name, 
        userId=userId
    ).summary
    print(f"Se ha creado {summary.counters.nodes_created} nodos de usuarios")

#Creacion de peliculas
def create_movie(driver, title: str, movieId: int, year:int, plot: str):
    query = """
    CREATE(m:Movie{title: $title, movieId: $movieId, year: $year, plot: $plot})
    """
    print(f"Creando pelicula {title} con ID {movieId}")
    summary = driver.execute_query(
        query, 
        title=title,
        movieId=movieId,
        year=year,
        plot=plot
    ).summary
    print(f"Se ha creado {summary.counters.nodes_created} nodos de peliculas")

#Creacion relaciones RATED
def rating_relation(driver, name: str, title: str, rating: int):
    query = """
    MATCH(n:User{name: $name})
    MATCH(m:Movie{title: $title})
    MERGE (n)-[r:RATED{rating: $rating}]->(m)
    """
    print(f"Creando relacion usuario {name} de pelicula {title} con puntiacion {rating} ")
    summary = driver.execute_query(
        query,
        name=name,
        title=title,
        rating=rating
    ).summary
    print(f"Se han creado {summary.counters.relationships_created} relaciones")