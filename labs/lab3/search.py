from Grafo_clases import User, Movie

MODE_USER = 1
MODE_MOVIE = 2
MODE_RELATION = 3

def search(driver, search_mode, **kwargs):
    global MODE_USER, MODE_MOVIE, MODE_RELATION
    print(kwargs.get("name"))
    if search_mode == MODE_USER:
      query = """
             MERGE (u:User{name: $name})  RETURN u
          """
      result = driver.execute_query(
              query,
              name=kwargs.get("name"),
        )
      records = list(result)
      if records:
            user_node = records[0][0]
            user_properties = user_node["u"] 
            name = user_properties["name"]
            user_id = user_properties["userId"]
            usuario = User(name=name, userId=user_id)
            return usuario
      else:
            return None