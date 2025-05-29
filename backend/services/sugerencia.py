from typing import Dict, List, Optional, Tuple, Union
from neo4j import Session
import logging

logger = logging.getLogger(__name__)


class AlgoritmoSugerencia:
    LADO_OPUESTO = {
        'top': 'bottom',
        'right': 'left',
        'bottom': 'top',
        'left': 'right'
    }
    
    ORDEN_EVALUACION = ['top', 'right', 'bottom', 'left']
    
    def __init__(self, session: Session):
        self.session = session
    
    def sugerir_siguiente_movimiento(self, pieza_id: int) -> Dict:
        pieza = self._obtener_pieza(pieza_id)
        if not pieza:
            return {"error": f"La pieza {pieza_id} no existe"}
        
        if pieza['estado'] != 'libre':
            return {"error": f"La pieza no está disponible para ensamblar (estado: {pieza['estado']})"}
        
        vecinos_posibles = self._obtener_vecinos_ensamblados(pieza)
        
        for lado in self.ORDEN_EVALUACION:
            if lado in pieza.get('bordes', []):
                continue
            
            if lado not in vecinos_posibles or vecinos_posibles[lado] is None:
                continue
            
            vecino = vecinos_posibles[lado]
            
            if vecino['estado'] != 'ensamblada':
                continue
            
            lado_opuesto = self.LADO_OPUESTO[lado]
            
            if lado_opuesto in vecino.get('bordes', []):
                continue
            
            pico = self._obtener_pico_libre(pieza, lado)
            hendidura = self._obtener_hendidura_libre(vecino, lado_opuesto)
            
            if pico is None or hendidura is None:
                continue
            
            return {
                "pieza_actual": pieza_id,
                "pieza_objetivo": vecino['id'],
                "lado_objetivo": lado_opuesto,
                "pico": pico,
                "hendidura": hendidura,
                "instruccion": f"Conecta la pieza {pieza_id} al lado {self._traducir_lado(lado_opuesto)} "
                              f"de la pieza {vecino['id']} usando el pico {pico} y la hendidura '{hendidura}'"
            }
        
        return {"mensaje": "No hay conexión válida para esta pieza actualmente"}
    
    def obtener_secuencia_ensamblaje(self, pieza_inicial_id: int) -> List[Dict]:
        pasos = []
        piezas_procesadas = set()
        piezas_ensambladas = set()
        
        pieza_inicial = self._obtener_pieza(pieza_inicial_id)
        if not pieza_inicial:
            return [{"error": f"Pieza inicial {pieza_inicial_id} no encontrada"}]
        
        if pieza_inicial['estado'] == 'libre':
            pasos.append({
                "paso": 1,
                "accion": "ensamblar_inicial",
                "pieza": pieza_inicial_id,
                "instruccion": f"Colocar la pieza {pieza_inicial_id} como pieza inicial (cambiar estado a 'ensamblada')"
            })
            piezas_ensambladas.add(pieza_inicial_id)
        
        piezas_libres = self._obtener_todas_piezas_libres()
        
        while piezas_libres:
            sugerencia_encontrada = False
            
            for pieza_libre in piezas_libres:
                if pieza_libre['id'] in piezas_procesadas:
                    continue
                
                sugerencia = self.sugerir_siguiente_movimiento(pieza_libre['id'])
                
                if 'pieza_objetivo' in sugerencia:
                    paso = {
                        "paso": len(pasos) + 1,
                        "accion": "conectar",
                        "pieza_actual": sugerencia['pieza_actual'],
                        "pieza_objetivo": sugerencia['pieza_objetivo'],
                        "lado": sugerencia['lado_objetivo'],
                        "pico": sugerencia['pico'],
                        "hendidura": sugerencia['hendidura'],
                        "instruccion": sugerencia['instruccion']
                    }
                    pasos.append(paso)
                    piezas_procesadas.add(pieza_libre['id'])
                    piezas_ensambladas.add(pieza_libre['id'])
                    sugerencia_encontrada = True
                    break
            
            if not sugerencia_encontrada:
                piezas_restantes = [p['id'] for p in piezas_libres if p['id'] not in piezas_procesadas]
                if piezas_restantes:
                    pasos.append({
                        "paso": len(pasos) + 1,
                        "accion": "advertencia",
                        "mensaje": f"No se pueden conectar las siguientes piezas: {piezas_restantes}",
                        "razon": "Posiblemente faltan piezas intermedias o están marcadas como omitidas"
                    })
                break
            
            piezas_libres = [p for p in piezas_libres if p['id'] not in piezas_procesadas]
        
        return pasos
    
    def _obtener_pieza(self, pieza_id: int) -> Optional[Dict]:
        query = """
        MATCH (p:Pieza {id: $pieza_id})
        RETURN p
        """
        
        result = self.session.run(query, {'pieza_id': pieza_id})
        record = result.single()
        
        return dict(record['p']) if record else None
    
    def _obtener_vecinos_ensamblados(self, pieza: Dict) -> Dict[str, Optional[Dict]]:
        query = """
        MATCH (p:Pieza {id: $pieza_id})
        OPTIONAL MATCH (vTop:Pieza {
            coordenada_x: p.coordenada_x, 
            coordenada_y: p.coordenada_y - 1,
            estado: 'ensamblada'
        })
        OPTIONAL MATCH (vRight:Pieza {
            coordenada_x: p.coordenada_x + 1, 
            coordenada_y: p.coordenada_y,
            estado: 'ensamblada'
        })
        OPTIONAL MATCH (vBottom:Pieza {
            coordenada_x: p.coordenada_x, 
            coordenada_y: p.coordenada_y + 1,
            estado: 'ensamblada'
        })
        OPTIONAL MATCH (vLeft:Pieza {
            coordenada_x: p.coordenada_x - 1, 
            coordenada_y: p.coordenada_y,
            estado: 'ensamblada'
        })
        RETURN vTop, vRight, vBottom, vLeft
        """
        
        result = self.session.run(query, {'pieza_id': pieza['id']})
        record = result.single()
        
        if not record:
            return {}
        
        return {
            'top': dict(record['vTop']) if record['vTop'] else None,
            'right': dict(record['vRight']) if record['vRight'] else None,
            'bottom': dict(record['vBottom']) if record['vBottom'] else None,
            'left': dict(record['vLeft']) if record['vLeft'] else None
        }
    
    def _obtener_pico_libre(self, pieza: Dict, lado: str) -> Optional[int]:
        picos_disponibles = pieza.get('picos_disponibles', [])
        
        if not picos_disponibles:
            return None
        
        if len(picos_disponibles) == 1:
            return picos_disponibles[0]
        
        cantidad_picos = pieza.get('cantidad_picos', 0)
        
        picos_por_lado = self._mapear_picos_a_lados(cantidad_picos, pieza.get('bordes', []))
        
        picos_en_lado = []
        for pico in picos_disponibles:
            if pico in picos_por_lado.get(lado, []):
                picos_en_lado.append(pico)
        
        if not picos_en_lado:
            lados_adyacentes = {
                'top': ['left', 'right'],
                'right': ['top', 'bottom'],
                'bottom': ['right', 'left'],
                'left': ['bottom', 'top']
            }
            
            for lado_adj in lados_adyacentes.get(lado, []):
                for pico in picos_disponibles:
                    if pico in picos_por_lado.get(lado_adj, []):
                        return pico
            
            return picos_disponibles[0]
        
        if len(picos_en_lado) == 1:
            return picos_en_lado[0]
        
        return self._seleccionar_elemento_central(picos_en_lado, lado, 'pico')
    
    def _obtener_hendidura_libre(self, pieza: Dict, lado: str) -> Optional[str]:
        hendiduras_disponibles = pieza.get('hendiduras_disponibles', [])
        
        if not hendiduras_disponibles:
            return None
        
        if len(hendiduras_disponibles) == 1:
            return hendiduras_disponibles[0]
        
        cantidad_hendiduras = pieza.get('cantidad_hendiduras', 0)
        
        hendiduras_por_lado = self._mapear_hendiduras_a_lados(cantidad_hendiduras, pieza.get('bordes', []))
        
        hendiduras_en_lado = []
        for hendidura in hendiduras_disponibles:
            if hendidura in hendiduras_por_lado.get(lado, []):
                hendiduras_en_lado.append(hendidura)
        
        if not hendiduras_en_lado:
            lados_adyacentes = {
                'top': ['right', 'left'],
                'right': ['bottom', 'top'],
                'bottom': ['left', 'right'],
                'left': ['top', 'bottom']
            }
            
            for lado_adj in lados_adyacentes.get(lado, []):
                for hendidura in hendiduras_disponibles:
                    if hendidura in hendiduras_por_lado.get(lado_adj, []):
                        return hendidura
            
            return hendiduras_disponibles[0]
        
        if len(hendiduras_en_lado) == 1:
            return hendiduras_en_lado[0]
        
        return self._seleccionar_elemento_central(hendiduras_en_lado, lado, 'hendidura')
    
    def _mapear_picos_a_lados(self, cantidad_picos: int, bordes: List[str]) -> Dict[str, List[int]]:
        picos_por_lado = {
            'top': [],
            'right': [],
            'bottom': [],
            'left': []
        }
        
        if cantidad_picos == 0:
            return picos_por_lado

        lados_sin_borde = [lado for lado in ['top', 'right', 'bottom', 'left'] if lado not in bordes]
        
        if not lados_sin_borde:
            return picos_por_lado
        
        pico_actual = 0
        
        orden_horario = ['top', 'right', 'bottom', 'left']
        
        for _ in range(cantidad_picos):
            lado_asignado = False
            for lado in orden_horario:
                if lado not in bordes and not lado_asignado:
                    picos_por_lado[lado].append(pico_actual)
                    lado_asignado = True
                    orden_horario = orden_horario[1:] + [orden_horario[0]]
                    break
            
            pico_actual += 1
        
        return picos_por_lado
    
    def _mapear_hendiduras_a_lados(self, cantidad_hendiduras: int, bordes: List[str]) -> Dict[str, List[str]]:
        hendiduras_por_lado = {
            'top': [],
            'right': [],
            'bottom': [],
            'left': []
        }
        
        if cantidad_hendiduras == 0:
            return hendiduras_por_lado
        
        lados_sin_borde = [lado for lado in ['top', 'right', 'bottom', 'left'] if lado not in bordes]
        
        if not lados_sin_borde:
            return hendiduras_por_lado
        
        hendidura_actual = 0
        
        orden_antihorario = ['bottom', 'left', 'top', 'right']
        
        for _ in range(cantidad_hendiduras):
            lado_asignado = False
            for lado in orden_antihorario:
                if lado not in bordes and not lado_asignado:
                    letra = chr(ord('a') + hendidura_actual)
                    hendiduras_por_lado[lado].append(letra)
                    lado_asignado = True
                    orden_antihorario = orden_antihorario[1:] + [orden_antihorario[0]]
                    break
            
            hendidura_actual += 1
        
        return hendiduras_por_lado
    
    def _seleccionar_elemento_central(self, elementos: List[Union[int, str]], lado: str, tipo: str) -> Optional[Union[int, str]]:
        if not elementos:
            return None
        
        if len(elementos) == 1:
            return elementos[0]
        
        posiciones_elementos = []
        
        for elemento in elementos:
            posicion = self._calcular_posicion_elemento(elemento, lado, tipo)
            if posicion is not None:
                posiciones_elementos.append((elemento, posicion))
        
        if not posiciones_elementos:
            return elementos[0] 
        
        centro_lado = self._calcular_centro_lado(lado)
        
        elemento_mas_cercano = None
        distancia_minima = float('inf')
        
        for elemento, posicion in posiciones_elementos:
            distancia = self._calcular_distancia_al_centro(posicion, centro_lado, lado)
            
            if distancia < distancia_minima:
                distancia_minima = distancia
                elemento_mas_cercano = elemento
        
        return elemento_mas_cercano if elemento_mas_cercano is not None else elementos[0]
    
    def _calcular_posicion_elemento(self, elemento: Union[int, str], lado: str, tipo: str) -> Optional[float]:
        if tipo == 'pico':
            posiciones_picos = {
                'top': {0: 0.0, 1: 0.5, 2: 1.0},      
                'right': {2: 0.0, 3: 0.5, 4: 1.0},    
                'bottom': {4: 1.0, 5: 0.5, 6: 0.0},  
                'left': {6: 1.0, 7: 0.5, 0: 0.0}      
            }
            
            if lado in posiciones_picos and isinstance(elemento, int):
                return self._normalizar_posicion_pico(elemento, lado)
                
        elif tipo == 'hendidura':
            if isinstance(elemento, str):
                indice = ord(elemento) - ord('a')
                return self._normalizar_posicion_hendidura(indice, lado)
        
        return None
    
    def _normalizar_posicion_pico(self, pico: int, lado: str) -> float:
        secuencias_horarias = {
            'top': [0, 1, 2],     
            'right': [2, 3, 4],    
            'bottom': [4, 5, 6],   
            'left': [6, 7, 0]      
        }
        
        if lado in secuencias_horarias and pico in secuencias_horarias[lado]:
            indice = secuencias_horarias[lado].index(pico)
            total = len(secuencias_horarias[lado])
            
            if total == 1:
                return 0.5  
            else:
                return indice / (total - 1)
        
        return 0.5
    
    def _normalizar_posicion_hendidura(self, indice: int, lado: str) -> float:
        secuencias_antihorarias = {
            'bottom': [0, 1, 2],   
            'left': [2, 3, 4],     
            'top': [4, 5, 6],     
            'right': [6, 7, 0]    
        }
        
        for lado_seq, indices in secuencias_antihorarias.items():
            if lado == lado_seq and indice in indices:
                pos = indices.index(indice)
                total = len(indices)
                
                if total == 1:
                    return 0.5
                else:
                    if lado in ['bottom', 'left']:
                        return 1.0 - (pos / (total - 1))
                    else:
                        return pos / (total - 1)
        
        return 0.5
    
    def _calcular_centro_lado(self, lado: str) -> float:
        return 0.5
    
    def _calcular_distancia_al_centro(self, posicion: float, centro: float, lado: str) -> float:
        return abs(posicion - centro)
    
    def _traducir_lado(self, lado: str) -> str:
        traducciones = {
            'top': 'superior',
            'right': 'derecho',
            'bottom': 'inferior',
            'left': 'izquierdo'
        }
        return traducciones.get(lado, lado)
    
    def _obtener_todas_piezas_libres(self) -> List[Dict]:
        query = """
        MATCH (p:Pieza {estado: 'libre'})
        RETURN p
        ORDER BY p.coordenada_y, p.coordenada_x
        """
        
        result = self.session.run(query)
        return [dict(record['p']) for record in result]
    
    def verificar_conexiones_invalidas(self) -> List[Dict]:
        query = """
        MATCH (p1:Pieza)-[r:CONECTA_CON {valida: true}]-(p2:Pieza)
        WHERE p1.estado = 'omitida' OR p2.estado = 'omitida'
        RETURN p1.id as pieza1, p2.id as pieza2, r
        """
        
        result = self.session.run(query)
        
        conexiones_invalidas = []
        for record in result:
            conexiones_invalidas.append({
                'pieza1': record['pieza1'],
                'pieza2': record['pieza2'],
                'relacion': dict(record['r']),
                'razon': 'Una o ambas piezas están marcadas como omitidas'
            })
        
        return conexiones_invalidas
    
    def obtener_estadisticas_ensamblaje(self) -> Dict:
        query = """
        MATCH (p:Pieza)
        WITH p.estado as estado, count(p) as cantidad
        RETURN collect({estado: estado, cantidad: cantidad}) as estadisticas
        """
        
        result = self.session.run(query)
        record = result.single()
        
        stats = {
            'libre': 0,
            'ensamblada': 0,
            'omitida': 0,
            'total': 0
        }
        
        for item in record['estadisticas']:
            estado = item['estado']
            cantidad = item['cantidad']
            if estado in stats:
                stats[estado] = cantidad
            stats['total'] += cantidad
        
        if stats['total'] > 0:
            stats['porcentaje_ensamblado'] = round((stats['ensamblada'] / stats['total']) * 100, 2)
            stats['porcentaje_omitido'] = round((stats['omitida'] / stats['total']) * 100, 2)
        else:
            stats['porcentaje_ensamblado'] = 0
            stats['porcentaje_omitido'] = 0
        
        stats['puede_completarse'] = stats['omitida'] == 0
        
        return stats