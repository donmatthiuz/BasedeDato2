from graphviz import Digraph

class GraficarGrafo:
    def __init__(self):
        self.grafo = Digraph(comment='Grafo')
        self.max_length = 30

    def truncar_texto(self, texto):
        """Trunca el texto si es demasiado largo, agregando '...' al final."""
        if len(texto) > self.max_length:
            return texto[:self.max_length] + "..."
        return texto

    def agregar_nodo(self, nodo, propiedades=None):
        """Agrega un nodo al grafo con propiedades opcionales."""
        label_text = nodo
        if propiedades:
           
            label_text += '\n' + '\n'.join([self.truncar_texto(p) for p in propiedades])
        self.grafo.node(nodo, label=label_text)

    def agregar_arista(self, nodo1, nodo2, etiqueta=None, propiedades=None):
        """Agrega una arista entre dos nodos con una etiqueta y propiedades opcionales."""
        label_text = etiqueta if etiqueta else ""
        if propiedades:
          
            label_text += '\n' + '\n'.join([self.truncar_texto(p) for p in propiedades])
        self.grafo.edge(nodo1, nodo2, label=label_text)

    def graficar(self):
        """Genera una visualización del grafo con etiquetas y propiedades en nodos y aristas."""
        self.grafo.render('grafo', format='png', view=True)



