from Grafo_clases import User, Movie

from Relacion import RATED

MODE_NODE = 1
MODE_RELATION = 0

def search(driver, search_mode, **kwargs):
    global MODE_NODE, MODE_RELATION
    if search_mode == MODE_NODE:     
        query = f"""
            MATCH (n:{kwargs.get("clase")} {{{kwargs.get("propiedad")}: $parametro}}) 
            RETURN n
        """
        result = driver.execute_query(
            query,
            parametro=kwargs.get("parametro")
        )
        records = list(result)
        if records:
         node = records[0][0]
         clase = list(node["n"].labels)[0]
         propiedades = node["n"]._properties

         if clase == 'User':
            return User(name=propiedades["name"], userId=propiedades["userId"])
         elif clase == 'Movie':
            return Movie(title=propiedades["title"], 
                         movieId=propiedades["movieId"], 
                         year=propiedades["year"], 
                         plot=propiedades["plot"])
        else:
         return None
    
    elif search_mode == MODE_RELATION:
       query = f"""
            MATCH (n1:{kwargs.get("clase")} {{ {kwargs.get("propiedad")}: $parametro }}) 
                -[r:{kwargs.get("relacion")}]-> 
                (n2:{kwargs.get("clase_relacionada")}) 
            RETURN n1, n2, r
        """
       result = driver.execute_query(
            query,
            parametro=kwargs.get("parametro")
        )
       records = list(result)
       #print (records[0])
       
       records_attached = []
       for r in records[0]:
          r_propiedades = r["r"]._properties
          r_type = r["r"].type

          if r_type == 'RATED':
             usuario = User( r["n1"]._properties["name"], 
                            r["n1"]._properties["userId"])
             movie = Movie(r["n2"]._properties["title"],
                           r["n2"]._properties["movieId"],
                           r["n2"]._properties["year"],
                           r["n2"]._properties["plot"])
             relacion = RATED(usuario, movie, r_propiedades["rating"],
                              timestamp="2024-02-09T12:34:56Z")
             records_attached.append(relacion)
       return records_attached 
    driver.close()
      
   