from typing import Dict, List, Tuple, Optional, Set
from neo4j import Session
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)


class RegistroPieza:
    LADO_OPUESTO = {
        'top': 'bottom',
        'right': 'left',
        'bottom': 'top',
        'left': 'right'
    }
    
    ORDEN_EVALUACION = ['top', 'right', 'bottom', 'left']
    
    def __init__(self, session: Session):
        self.session = session
        self._picos_usados = defaultdict(set)
        self._hendiduras_usadas = defaultdict(set)
    
    def registrar_pieza(self, pieza_data: Dict) -> Dict:
        pieza_id = pieza_data['id']
        
        picos = self._generar_picos(pieza_data['cantidad_picos'])
        hendiduras = self._generar_hendiduras(pieza_data['cantidad_hendiduras'])
        
        query_crear_pieza = """
        CREATE (p:Pieza {
            id: $id,
            coordenada_x: $coordenada_x,
            coordenada_y: $coordenada_y,
            cantidad_picos: $cantidad_picos,
            cantidad_hendiduras: $cantidad_hendiduras,
            bordes: $bordes,
            estado: $estado,
            picos_disponibles: $picos,
            hendiduras_disponibles: $hendiduras,
            timestamp_creacion: timestamp()
        })
        RETURN p
        """
        
        result = self.session.run(query_crear_pieza, {
            'id': pieza_id,
            'coordenada_x': pieza_data['coordenada_x'],
            'coordenada_y': pieza_data['coordenada_y'],
            'cantidad_picos': pieza_data['cantidad_picos'],
            'cantidad_hendiduras': pieza_data['cantidad_hendiduras'],
            'bordes': pieza_data.get('bordes', []),
            'estado': pieza_data.get('estado', 'libre'),
            'picos': picos,
            'hendiduras': hendiduras
        })
        
        pieza_creada = dict(result.single()['p'])
        logger.info(f"Pieza {pieza_id} registrada exitosamente")
        
        conexiones_creadas = []
        if 'vecinos' in pieza_data and pieza_data['estado'] == 'ensamblada':
            conexiones_creadas = self._procesar_vecinos_y_conectar(
                pieza_id, 
                pieza_data['vecinos'],
                pieza_data.get('bordes', [])
            )
        
        return {
            'pieza': pieza_creada,
            'conexiones_creadas': conexiones_creadas
        }
    
    def _generar_picos(self, cantidad: int) -> List[int]:
        return list(range(cantidad))
    
    def _generar_hendiduras(self, cantidad: int) -> List[str]:
        return [chr(ord('a') + i) for i in range(cantidad)]
    
    def _procesar_vecinos_y_conectar(self, pieza_id: int, vecinos: Dict[str, int], 
                                   bordes: List[str]) -> List[Dict]:
   
        conexiones = []
        
        for direccion in self.ORDEN_EVALUACION:
            if direccion not in vecinos:
                continue
                
            vecino_id = vecinos[direccion]
            
            if direccion in bordes:
                logger.info(f"Lado {direccion} de pieza {pieza_id} está en bordes, ignorando vecino {vecino_id}")
                continue
            
            conexion = self._crear_conexion_con_vecino(pieza_id, vecino_id, direccion)
            if conexion:
                conexiones.append(conexion)
        
        return conexiones
    
    def _crear_conexion_con_vecino(self, pieza_id: int, vecino_id: int, 
                                  direccion: str) -> Optional[Dict]:

        query_vecino = """
        MATCH (v:Pieza {id: $vecino_id})
        RETURN v
        """
        
        result = self.session.run(query_vecino, {'vecino_id': vecino_id})
        record = result.single()
        
        if not record:
            logger.warning(f"Vecino {vecino_id} no encontrado")
            return None
        
        vecino = dict(record['v'])
        
        if vecino['estado'] != 'ensamblada':
            logger.info(f"Vecino {vecino_id} no está ensamblado (estado: {vecino['estado']})")
            return None
        
        lado_opuesto = self.LADO_OPUESTO[direccion]
        if lado_opuesto in vecino.get('bordes', []):
            logger.info(f"Lado {lado_opuesto} del vecino {vecino_id} es un borde")
            return None
        
        pico = self._obtener_pico_disponible(pieza_id, direccion)
        hendidura = self._obtener_hendidura_disponible(vecino_id, lado_opuesto)
        
        if pico is None or hendidura is None:
            logger.info(f"No hay pico/hendidura disponible para conectar {pieza_id} con {vecino_id}")
            return None
        
        return self._crear_relacion_bidireccional(
            pieza_id, vecino_id, direccion, lado_opuesto, pico, hendidura
        )
    
    def _obtener_pico_disponible(self, pieza_id: int, lado: str) -> Optional[int]:

        query = """
        MATCH (p:Pieza {id: $pieza_id})
        RETURN p.picos_disponibles as picos
        """
        
        result = self.session.run(query, {'pieza_id': pieza_id})
        record = result.single()
        
        if not record or not record['picos']:
            return None
        
        picos_disponibles = record['picos']
        picos_usados = self._picos_usados[pieza_id]
        
        for pico in picos_disponibles:
            if pico not in picos_usados:
                return pico
        
        return None
    
    def _obtener_hendidura_disponible(self, pieza_id: int, lado: str) -> Optional[str]:

        query = """
        MATCH (p:Pieza {id: $pieza_id})
        RETURN p.hendiduras_disponibles as hendiduras
        """
        
        result = self.session.run(query, {'pieza_id': pieza_id})
        record = result.single()
        
        if not record or not record['hendiduras']:
            return None
        
        hendiduras_disponibles = record['hendiduras']
        hendiduras_usadas = self._hendiduras_usadas[pieza_id]
        
        for hendidura in hendiduras_disponibles:
            if hendidura not in hendiduras_usadas:
                return hendidura
        
        return None
    
    def _crear_relacion_bidireccional(self, pieza_origen: int, pieza_destino: int,
                                    desde_lado: str, hacia_lado: str,
                                    pico: int, hendidura: str) -> Dict:

        query_crear_relacion = """
        MATCH (p1:Pieza {id: $pieza_origen})
        MATCH (p2:Pieza {id: $pieza_destino})
        CREATE (p1)-[r1:CONECTA_CON {
            desde_lado: $desde_lado,
            hacia_lado: $hacia_lado,
            pico_origen: $pico,
            hendidura_destino: $hendidura,
            valida: true,
            timestamp: timestamp()
        }]->(p2)
        CREATE (p2)-[r2:CONECTA_CON {
            desde_lado: $hacia_lado,
            hacia_lado: $desde_lado,
            pico_origen: null,
            hendidura_destino: null,
            valida: true,
            timestamp: timestamp()
        }]->(p1)
        RETURN r1, r2
        """
        
        result = self.session.run(query_crear_relacion, {
            'pieza_origen': pieza_origen,
            'pieza_destino': pieza_destino,
            'desde_lado': desde_lado,
            'hacia_lado': hacia_lado,
            'pico': pico,
            'hendidura': hendidura
        })
        
        if result.single():
            self._picos_usados[pieza_origen].add(pico)
            self._hendiduras_usadas[pieza_destino].add(hendidura)
            
            self._actualizar_elementos_disponibles(pieza_origen, pieza_destino, pico, hendidura)
            
            logger.info(f"Conexión creada: Pieza {pieza_origen} ({desde_lado}) -> "
                       f"Pieza {pieza_destino} ({hacia_lado}) usando pico {pico} y hendidura '{hendidura}'")
            
            return {
                'origen': pieza_origen,
                'destino': pieza_destino,
                'desde_lado': desde_lado,
                'hacia_lado': hacia_lado,
                'pico_usado': pico,
                'hendidura_usada': hendidura
            }
        
        return None
    
    def _actualizar_elementos_disponibles(self, pieza_pico_id: int, pieza_hendidura_id: int,
                                        pico_usado: int, hendidura_usada: str):
        query_actualizar_picos = """
        MATCH (p:Pieza {id: $pieza_id})
        SET p.picos_disponibles = [x IN p.picos_disponibles WHERE x <> $pico_usado]
        """
        
        self.session.run(query_actualizar_picos, {
            'pieza_id': pieza_pico_id,
            'pico_usado': pico_usado
        })
        
        query_actualizar_hendiduras = """
        MATCH (p:Pieza {id: $pieza_id})
        SET p.hendiduras_disponibles = [x IN p.hendiduras_disponibles WHERE x <> $hendidura_usada]
        """
        
        self.session.run(query_actualizar_hendiduras, {
            'pieza_id': pieza_hendidura_id,
            'hendidura_usada': hendidura_usada
        })
    
    def registrar_lote_piezas(self, piezas: List[Dict]) -> List[Dict]:

        piezas_creadas = []
        
        for pieza_data in piezas:
            pieza_id = pieza_data['id']
            picos = self._generar_picos(pieza_data['cantidad_picos'])
            hendiduras = self._generar_hendiduras(pieza_data['cantidad_hendiduras'])
            
            query = """
            CREATE (p:Pieza {
                id: $id,
                coordenada_x: $coordenada_x,
                coordenada_y: $coordenada_y,
                cantidad_picos: $cantidad_picos,
                cantidad_hendiduras: $cantidad_hendiduras,
                bordes: $bordes,
                estado: $estado,
                picos_disponibles: $picos,
                hendiduras_disponibles: $hendiduras,
                timestamp_creacion: timestamp()
            })
            RETURN p
            """
            
            result = self.session.run(query, {
                'id': pieza_id,
                'coordenada_x': pieza_data['coordenada_x'],
                'coordenada_y': pieza_data['coordenada_y'],
                'cantidad_picos': pieza_data['cantidad_picos'],
                'cantidad_hendiduras': pieza_data['cantidad_hendiduras'],
                'bordes': pieza_data.get('bordes', []),
                'estado': pieza_data.get('estado', 'libre'),
                'picos': picos,
                'hendiduras': hendiduras
            })
            
            pieza_creada = dict(result.single()['p'])
            piezas_creadas.append(pieza_creada)
        
        for pieza_data in piezas:
            if pieza_data.get('estado') == 'ensamblada' and 'vecinos' in pieza_data:
                self._procesar_vecinos_y_conectar(
                    pieza_data['id'],
                    pieza_data['vecinos'],
                    pieza_data.get('bordes', [])
                )
        
        logger.info(f"Lote de {len(piezas_creadas)} piezas registrado exitosamente")
        return piezas_creadas
    
    def obtener_vecinos_por_coordenadas(self, pieza_id: int) -> Dict[str, Optional[int]]:

        query = """
        MATCH (p:Pieza {id: $pieza_id})
        OPTIONAL MATCH (vTop:Pieza {
            coordenada_x: p.coordenada_x, 
            coordenada_y: p.coordenada_y - 1
        })
        OPTIONAL MATCH (vRight:Pieza {
            coordenada_x: p.coordenada_x + 1, 
            coordenada_y: p.coordenada_y
        })
        OPTIONAL MATCH (vBottom:Pieza {
            coordenada_x: p.coordenada_x, 
            coordenada_y: p.coordenada_y + 1
        })
        OPTIONAL MATCH (vLeft:Pieza {
            coordenada_x: p.coordenada_x - 1, 
            coordenada_y: p.coordenada_y
        })
        RETURN vTop.id as top, vRight.id as right, 
               vBottom.id as bottom, vLeft.id as left
        """
        
        result = self.session.run(query, {'pieza_id': pieza_id})
        record = result.single()
        
        return {
            'top': record['top'],
            'right': record['right'],
            'bottom': record['bottom'],
            'left': record['left']
        } if record else {}