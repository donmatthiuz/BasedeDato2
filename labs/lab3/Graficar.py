from graphviz import Digraph

class GraficarGrafo:
    def __init__(self):
        # Inicializamos el grafo como un digrafo (dirigido)
        self.grafo = Digraph(comment='Grafo')

    def agregar_nodo(self, nodo, propiedades=None):
        """Agrega un nodo al grafo con propiedades opcionales."""
        label_text = nodo
        if propiedades:
            # Concatenamos las propiedades de cada nodo, separadas por saltos de línea
            label_text += '\n' + '\n'.join(propiedades)
        self.grafo.node(nodo, label=label_text)

    def agregar_arista(self, nodo1, nodo2, etiqueta=None, propiedades=None):
        """Agrega una arista entre dos nodos con una etiqueta y propiedades opcionales."""
        label_text = etiqueta if etiqueta else ""
        if propiedades:
            # Agregamos las propiedades debajo de la etiqueta
            label_text += '\n' + '\n'.join(propiedades)
        self.grafo.edge(nodo1, nodo2, label=label_text)

    def graficar(self):
        """Genera una visualización del grafo con etiquetas y propiedades en nodos y aristas."""
        # Generar el grafo en formato PNG (o cualquier otro formato soportado)
        self.grafo.render('grafo', format='png', view=True)

# Ejemplo de uso
if __name__ == "__main__":
    grafo = GraficarGrafo()

    # Agregar nodos con propiedades
    grafo.agregar_nodo("A", propiedades=["Propiedad 1: Valor A", "Propiedad 2: 10"])
    grafo.agregar_nodo("B", propiedades=["Propiedad 1: Valor B", "Propiedad 2: 20"])
    grafo.agregar_nodo("C", propiedades=["Propiedad 1: Valor C", "Propiedad 2: 30"])

    # Agregar aristas con etiquetas y propiedades
    grafo.agregar_arista("A", "B", etiqueta="Conexión 1", propiedades=["Peso: 10", "Longitud: 5"])
    grafo.agregar_arista("B", "C", etiqueta="Conexión 2", propiedades=["Peso: 20", "Longitud: 10"])
    grafo.agregar_arista("A", "C", etiqueta="Conexión 3", propiedades=["Peso: 15", "Longitud: 8"])

    # Graficar el grafo
    grafo.graficar()
