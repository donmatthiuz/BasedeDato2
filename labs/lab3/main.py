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
        title="Monty Python and the Holy Grail",
        movieId=2,
        year=1975,
        plot="El Rey Arturo y sus caballeros se embarcan en una búsqueda cómica y surrealista para encontrar el Santo Grial.",
        tmdbId=67890,
        released="1975-04-03",
        imdbRating=8.2,
        imdbId=687,
        runtime=91,
        countries=["UK"],
        imdbVotes=1000000,
        url="https://www.imdb.com/title/tt0071853/",
        revenue=50000000,
        poster="https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p629_p_v8_af.jpg",
        budget=4000000,
        languages=["English"]
    )

    genero = Genre(name='Comedy')
    director = Person_Director(
        name="Terry Gilliam",
        tmdbId=9388,
        born="1940-11-22",
        bornIn="Minneapolis, Minnesota, USA",
        url="https://www.imdb.com/name/nm0000417/",
        imdbId=417,
        bio="Terry Gilliam es un cineasta, actor, animador y escritor británico nacido en Estados Unidos. Es conocido por su trabajo con el grupo de comedia Monty Python y por dirigir películas como *Brazil* y *The Fisher King*.",
        poster="data:image/jpeg;base64,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"
    )

    actor = Person_Actor(
        name="John Cleese",
        tmdbId=3098,
        born="1939-10-27",
        bornIn="Weston-super-Mare, England",
        url="https://www.imdb.com/name/nm0001035/",
        imdbId=1035,
        bio="John Cleese es un actor, comediante y escritor inglés, mejor conocido por su trabajo con Monty Python y por crear la comedia *Fawlty Towers*.",
        poster="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxzzsACnGly2DcmO9UhghGFT9RX3P8Q8MIabAe-oAoP2Rfg-kEjdhDvgY7rGjGulRgnFG5u2d6ycj5ES4OlegHgg"
    )

    actor_director = Person_Actor_Director(
        name="Terry Jones",
        tmdbId=5106,
        born="1942-02-01",
        bornIn="Colwyn Bay, Wales",
        url="https://www.imdb.com/name/nm0424553/",
        imdbId=42553,
        bio="Terry Jones fue un comediante, actor, escritor y director galés, mejor conocido por su trabajo con Monty Python y por dirigir *Monty Python y el Santo Grial*.",
        poster="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTeyDS2FCkm-jl_EOcJPwsWpl9RZ9PAkNHUFXftBac6UnCCg9jpFHErm99fKeekmh0h0vehOpMK87YImW5mWbnt0g"
    )

    nodos.append(usuario)
    nodos.append(pelicula)
    nodos.append(genero)
    nodos.append(director)
    nodos.append(actor)
    nodos.append(actor_director)


    for n in nodos:
        crear_nodo_en_db(driver=driver, nodo=n)

    #Relaciones
    relaciones = []
    rated = RATED(nodo_a=usuario, nodo_b=pelicula,
                  rating=5, timestamp='2024-02-09T12:34:56Z')
    in_genere = IN_GENRE(nodo_a= pelicula, nodo_b=genero)
    directed = DIRECTED(director, pelicula, 'Director')
    acted_in =ACTED_IN(actor, pelicula, 'Cobb')
    acted_in2 = ACTED_IN(actor_director, pelicula, 'Rey Graham')
    directed2 = DIRECTED(actor_director, pelicula, 'Director')

    relaciones.append(in_genere)
    relaciones.append(rated)
    relaciones.append(directed)
    relaciones.append(acted_in)
    relaciones.append(acted_in2)
    relaciones.append(directed2)

    for r in relaciones:
        crear_relacion_en_db(driver=driver, relacion=r)














    






