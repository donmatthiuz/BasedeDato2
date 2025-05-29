from neo4j import GraphDatabase
from config import Config

class Neo4jConnection:
    def __init__(self):
        self._uri = Config.NEO4J_URI
        self._user = Config.NEO4J_USER
        self._password = Config.NEO4J_PASSWORD
        self._driver = None

    def conectar(self):
        if self._driver is None:
            self._driver = GraphDatabase.driver(
                self._uri, auth=(self._user, self._password)
            )

    def cerrar(self):
        if self._driver:
            self._driver.close()

    def session(self):
        self.conectar()
        return self._driver.session()

    def ejecutar_consulta(self, query, parameters=None, single=False):
        self.conectar()
        with self._driver.session() as session:
            result = session.run(query, parameters or {})
            return result.single() if single else result.data()
    
    def executeQuery(self, query, parameters=None, single=False):
        return self.ejecutar_consulta(query, parameters, single)