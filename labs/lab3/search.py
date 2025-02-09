from Grafo_clases import User, Movie

MODE_NODE = 1
MODE_RELATION = 0

def search(driver, search_mode, **kwargs):
    global MODE_NODE, MODE_RELATION
    if search_mode == MODE_NODE:     
        query = f"""
            MERGE (n:{kwargs.get("clase")} {{{kwargs.get("propiedad")}: $parametro}}) 
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

      #    if clase == 'User':
      #       User(name=node["n"]., userId=user_id)
      #       user_properties = user_node["u"] 
      #       name = user_properties["name"]
      #       user_id = user_properties["userId"]
      #       usuario = User(name=name, userId=user_id)
      #       return usuario
        else:
         return None
      
   