from conn import connection
from queries_inciso2 import create_user, create_movie, rating_relation
from search import search, MODE_NODE, MODE_RELATION
from Graficar import GraficarGrafo
from Neo4j_methods import *
from Grafo_clases import *
from Relacion import *
#Conf conexion
# URI examples: "neo4j://localhost", "neo4j+s://xxx.databases.neo4j.io"
URI = "neo4j+s://d75b418a.databases.neo4j.io"
# Instancia Abby
AUTH = ("neo4j", "jQAeKwuVMjIOOtDwpRjfs4RjfrMHXdPhzUzKmJramRw")

def create_database():
    #creacion del driver
    driver = connection(URI,AUTH)
    #creacion nodos
    create_user(driver, 
                name="Fula Nito", 
                userId=1)
    create_user(driver,
                name="Juan Perez",
                userId=2)
    create_user(driver,
                name="Ron Quido",
                userId=3)
    create_user(driver,
                name="Mengana Fulana",
                userId=4)
    create_user(driver,
                name="Jane Doe",
                userId=5)
    
    create_movie(driver,
                 title="Back to the Future",
                 movieId=1,
                 year=1985,
                 plot="Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past in a time-traveling DeLorean invented by his close friend, the maverick scientist Doc Brown.")
    create_movie(driver,
                 title="Spirited Away",
                 movieId=2,
                 year=2001,
                 plot="During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches and spirits, and where humans are changed into beasts.")
    create_movie(driver,
                 title="Whiplash",
                 movieId=3,
                 year=2014,
                 plot="A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.")
    create_movie(driver,
                 title="Gladiator",
                 movieId=4,
                 year=2000,
                 plot="A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.")
    create_movie(driver,
                 title="Star Wars: Episode V - The Empire Strikes Back",
                 movieId=5,
                 year=1980,
                 plot="After the Empire overpowers the Rebel Alliance, Luke Skywalker begins training with Jedi Master Yoda, while Darth Vader and bounty hunter Boba Fett pursue his friends across the galaxy.")
    create_movie(driver,
                 title="Spider-Man: Across the Spider-Verse",
                 movieId=6,
                 year=2023,
                 plot="Traveling across the multiverse, Miles Morales meets a new team of Spider-People, made up of heroes from different dimensions. But when the heroes clash over how to deal with a new threat, Miles finds himself at a crossroads.")
    create_movie(driver,
                 title="Parasite",
                 movieId=7,
                 year=2019,
                 plot="Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.")
    create_movie(driver,
                 title="Avengers: Infinity War",
                 movieId=8,
                 year=2018,
                 plot="The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.")
    create_movie(driver,
                 title="The Shining",
                 movieId=9,
                 year=1980,
                 plot="A family heads to an isolated hotel for the winter, where a sinister presence influences the father into violence. At the same time, his psychic son sees horrifying forebodings from both the past and the future.")
    create_movie(driver,
                 title="Joker",
                 movieId=10,
                 year=2019,
                 plot="Arthur Fleck, a party clown and a failed stand-up comedian, leads an impoverished life with his ailing mother. However, when society shuns him and brands him as a freak, he decides to embrace the life of chaos in Gotham City.")
    create_movie(driver,
                 title="The Help",
                 movieId=11,
                 year=2011,
                 plot="An aspiring author during the civil rights movement of the 1960s decides to write a book detailing the African American maids' point of view on the white families for which they work, and the hardships they go through on a daily basis.")
    create_movie(driver,
                 title="Forrest Gump",
                 movieId=12,
                 year=1994,
                 plot="The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.")
    
    #realciones
    rating_relation(driver,
                    name="Fula Nito",
                    title="Spirited Away",
                    rating=4)
    rating_relation(driver,
                    name="Fula Nito",
                    title="Forrest Gump",
                    rating=3)
    rating_relation(driver,
                    name="Fula Nito",
                    title="Gladiator",
                    rating=5)  
    
    rating_relation(driver,
                    name="Juan Perez",
                    title="Back to the Future",
                    rating=5)  
    rating_relation(driver,
                    name="Juan Perez",
                    title="Joker",
                    rating=3)  
    rating_relation(driver,
                    name="Juan Perez",
                    title="Forrest Gump",
                    rating=4) 
     
    rating_relation(driver,
                    name="Ron Quido",
                    title="Parasite",
                    rating=2)  
    rating_relation(driver,
                    name="Ron Quido",
                    title="Joker",
                    rating=4)  
    
    rating_relation(driver,
                    name="Mengana Fulana",
                    title="The Avengers: Infinity War",
                    rating=4)  
    rating_relation(driver,
                    name="Mengana Fulana",
                    title="The Shining",
                    rating=3) 
                    
    rating_relation(driver,
                    name="Jane Doe",
                    title="Star Wars: Episode V - The Empire Strikes Back",
                    rating=5)
    rating_relation(driver,
                    name="Jane Doe",
                    title="The Help",
                    rating=4)
    rating_relation(driver,
                    name="Jane Doe",
                    title="Spider-Man: Across the Spider-Verse",
                    rating=4)
     
    driver.close()

def crear_grafo2():
    pass

if __name__ == "__main__":
    #create_database()
    driver = connection(URI,AUTH)
    # # resultado = search(driver=driver, 
    # #                    search_mode=MODE_NODE, 
    # #                    clase='User', propiedad= 'name',
    # #                    parametro= 'Fula Nito')
    # grafo = GraficarGrafo()
    # grafo.agregar_nodo(resultado.nombre_clase, propiedades=resultado.obtener_atributos())
    # grafo.graficar()

    # resultado = search(driver=driver, 
    #                     search_mode=MODE_RELATION, 
    #                     clase='User', propiedad= 'name',
    #                     parametro= 'Fula Nito', relacion= 'RATED',
    #                     clase_relacionada= 'Movie')
    
    # print(resultado)
    # grafo = GraficarGrafo()
    # for r in resultado:
    #     parametrob, valorb = r.nodo_b.obtener_primer_parametro()
    #     parametroa, valora = r.nodo_a.obtener_primer_parametro()
    #     grafo.agregar_nodo(f"{r.nodo_a.nombre_clase} - {valora}", r.nodo_a.obtener_atributos())
    #     grafo.agregar_nodo(f"{r.nodo_b.nombre_clase} - {valorb}", r.nodo_b.obtener_atributos())
    #     grafo.agregar_arista(nodo1=f"{r.nodo_a.nombre_clase} - {valora}", 
    #                          nodo2=f"{r.nodo_b.nombre_clase} - {valorb}",
    #                          etiqueta=r.nombre_clase,
    #                          propiedades=r.obtener_propiedades())
    #     print(r.propiedades)
    # grafo.graficar()

    clean_db(driver=driver)
    #create_database()

    nodos = []

    #Nodos
    usuario = User(name='Alvaro Diaz', userId=1)
    pelicula = Movie(
        title="Inception",
        movieId=1,
        year=2010,
        plot="A thief who enters the dreams of others to steal secrets.",
        tmdbId=12345,
        released="2010-07-16",
        imdbRating=8.8,
        imdbId=1375666,
        runtime=148,
        countries=["USA", "UK"],
        imdbVotes=2100000,
        url="https://www.imdb.com/title/tt1375666/",
        revenue=829895144,
        poster="https://play-lh.googleusercontent.com/buKf27Hxendp3tLNpNtP3E-amP0o4yYV-SGKyS2u-Y3GdGRTyfNCIT5WAVs2OudOz6so5K1jtYdAUKI9nw8",
        budget=160000000,
        languages=["English", "Japanese", "French"]
    )
    genero = Genre(name='Thriller')
    director = Person_Director(name="Christopher Nolan", tmdbId=525, born="1970-07-30",
                           bornIn="London, UK", url="https://www.imdb.com/name/nm0634240/",
                           imdbId=634240, bio="British-American director known for Inception.", 
                           poster="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Christopher_Nolan_Cannes_2018.jpg/640px-Christopher_Nolan_Cannes_2018.jpg")

    

    nodos.append(usuario)
    nodos.append(pelicula)
    nodos.append(genero)
    nodos.append(director)


    for n in nodos:
        crear_nodo_en_db(driver=driver, nodo=n)

    #Relaciones
    relaciones = []
    rated = RATED(nodo_a=usuario, nodo_b=pelicula,
                  rating=5, timestamp='2024-02-09T12:34:56Z')
    in_genere = IN_GENRE(nodo_a= pelicula, nodo_b=genero)
    directed = DIRECTED(director, pelicula, 'Director')

    relaciones.append(in_genere)
    relaciones.append(rated)
    relaciones.append(directed)

    for r in relaciones:
        crear_relacion_en_db(driver=driver, relacion=r)














    






