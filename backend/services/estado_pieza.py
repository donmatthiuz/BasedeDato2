from typing import Dict, List, Optional
from neo4j import Session
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class GestorEstadoPieza:
    ESTADOS_VALIDOS = {'libre', 'ensamblada', 'omitida'}
    
    def __init__(self, session: Session):
        self.session = session
    
    def cambiar_estado(self, pieza_id: int, nuevo_estado: str, 
                      razon: Optional[str] = None) -> Dict:
        if nuevo_estado not in self.ESTADOS_VALIDOS:
            return {
                'exito': False,
                'error': f'Estado inválido: {nuevo_estado}. Estados válidos: {self.ESTADOS_VALIDOS}'
            }
        
        pieza = self._obtener_pieza(pieza_id)
        if not pieza:
            return {
                'exito': False,
                'error': f'Pieza {pieza_id} no encontrada'
            }
        
        estado_anterior = pieza.get('estado', 'libre')
        
        if estado_anterior == nuevo_estado:
            return {
                'exito': True,
                'pieza_id': pieza_id,
                'estado_anterior': estado_anterior,
                'estado_nuevo': nuevo_estado,
                'relaciones_afectadas': 0,
                'mensaje': 'El estado ya era el solicitado'
            }
        
        query_update = """
        MATCH (p:Pieza {id: $pieza_id})
        SET p.estado = $nuevo_estado,
            p.timestamp_cambio_estado = timestamp(),
            p.razon_cambio = $razon
        RETURN p
        """
        
        result = self.session.run(query_update, {
            'pieza_id': pieza_id,
            'nuevo_estado': nuevo_estado,
            'razon': razon or f'Cambio de {estado_anterior} a {nuevo_estado}'
        })
        
        pieza_actualizada = dict(result.single()['p'])
        
        relaciones_afectadas = 0
        
        if nuevo_estado == 'omitida':
            relaciones_afectadas = self._invalidar_relaciones(pieza_id)
            
        elif estado_anterior == 'omitida' and nuevo_estado in ['libre', 'ensamblada']:
            relaciones_afectadas = self._revalidar_relaciones(pieza_id)
        
        logger.info(f"Estado de pieza {pieza_id} cambiado de {estado_anterior} a {nuevo_estado}")
        
        return {
            'exito': True,
            'pieza_id': pieza_id,
            'estado_anterior': estado_anterior,
            'estado_nuevo': nuevo_estado,
            'relaciones_afectadas': relaciones_afectadas,
            'timestamp': datetime.now().isoformat()
        }
    
    def marcar_pieza_omitida(self, pieza_id: int, detalles: Optional[Dict] = None) -> Dict:
        razon = "Pieza marcada como faltante"
        if detalles and 'razon' in detalles:
            razon = detalles['razon']
        
        resultado = self.cambiar_estado(pieza_id, 'omitida', razon)
        
        if resultado['exito'] and detalles:
            query_detalles = """
            MATCH (p:Pieza {id: $pieza_id})
            SET p.fecha_omision = $fecha,
                p.detalles_omision = $detalles,
                p.reportado_por = $reportado_por
            RETURN p
            """
            
            self.session.run(query_detalles, {
                'pieza_id': pieza_id,
                'fecha': detalles.get('fecha', datetime.now().isoformat()),
                'detalles': str(detalles),
                'reportado_por': detalles.get('reportado_por', 'sistema')
            })
        
        return resultado
    
    def _invalidar_relaciones(self, pieza_id: int) -> int:
        query = """
        MATCH (p:Pieza {id: $pieza_id})-[r:CONECTA_CON]-()
        WHERE r.valida = true
        SET r.valida = false,
            r.timestamp_invalidacion = timestamp(),
            r.razon_invalidacion = 'Pieza marcada como omitida'
        RETURN count(r) as total
        """
        
        result = self.session.run(query, {'pieza_id': pieza_id})
        total = result.single()['total']
        
        logger.info(f"Se invalidaron {total} relaciones de la pieza {pieza_id}")
        return total
    
    def _revalidar_relaciones(self, pieza_id: int) -> int:
        query = """
        MATCH (p:Pieza {id: $pieza_id})-[r:CONECTA_CON]-(vecino:Pieza)
        WHERE r.valida = false 
        AND vecino.estado <> 'omitida'
        SET r.valida = true,
            r.timestamp_revalidacion = timestamp(),
            r.razon_revalidacion = 'Pieza disponible nuevamente'
        RETURN count(r) as total
        """
        
        result = self.session.run(query, {'pieza_id': pieza_id})
        total = result.single()['total']
        
        logger.info(f"Se revalidaron {total} relaciones de la pieza {pieza_id}")
        return total
    
    def cambiar_estado_lote(self, piezas_ids: List[int], nuevo_estado: str,
                          razon: Optional[str] = None) -> Dict:
        if nuevo_estado not in self.ESTADOS_VALIDOS:
            return {
                'exito': False,
                'error': f'Estado inválido: {nuevo_estado}'
            }
        
        query = """
        MATCH (p:Pieza)
        WHERE p.id IN $piezas_ids
        SET p.estado = $nuevo_estado,
            p.timestamp_cambio_estado = timestamp(),
            p.razon_cambio = $razon
        RETURN count(p) as actualizadas
        """
        
        result = self.session.run(query, {
            'piezas_ids': piezas_ids,
            'nuevo_estado': nuevo_estado,
            'razon': razon or f'Cambio masivo a {nuevo_estado}'
        })
        
        actualizadas = result.single()['actualizadas']
        
        relaciones_afectadas = 0
        if nuevo_estado == 'omitida':
            for pieza_id in piezas_ids:
                relaciones_afectadas += self._invalidar_relaciones(pieza_id)
        
        return {
            'exito': True,
            'piezas_solicitadas': len(piezas_ids),
            'piezas_actualizadas': actualizadas,
            'nuevo_estado': nuevo_estado,
            'relaciones_afectadas': relaciones_afectadas
        }
    
    def obtener_resumen_estado(self) -> Dict:
        query = """
        MATCH (p:Pieza)
        WITH p.estado as estado, count(p) as cantidad
        RETURN collect({estado: estado, cantidad: cantidad}) as resumen
        """
        
        result = self.session.run(query)
        record = result.single()
        
        resumen = {
            'libre': 0,
            'ensamblada': 0,
            'omitida': 0,
            'total': 0
        }
        
        for item in record['resumen']:
            estado = item['estado']
            cantidad = item['cantidad']
            if estado in resumen:
                resumen[estado] = cantidad
            resumen['total'] += cantidad
        
        if resumen['total'] > 0:
            resumen['porcentaje_ensamblado'] = round(
                (resumen['ensamblada'] / resumen['total']) * 100, 2
            )
            resumen['porcentaje_omitido'] = round(
                (resumen['omitida'] / resumen['total']) * 100, 2
            )
            resumen['piezas_disponibles'] = resumen['libre'] + resumen['ensamblada']
        else:
            resumen['porcentaje_ensamblado'] = 0
            resumen['porcentaje_omitido'] = 0
            resumen['piezas_disponibles'] = 0
        
        resumen['puede_completarse'] = resumen['omitida'] == 0
        resumen['completo'] = (resumen['ensamblada'] == resumen['total'] - resumen['omitida'])
        
        return resumen
    
    def validar_integridad_relaciones(self) -> Dict:
        problemas = []
        
        query_omitidas_validas = """
        MATCH (p1:Pieza)-[r:CONECTA_CON {valida: true}]-(p2:Pieza)
        WHERE p1.estado = 'omitida' OR p2.estado = 'omitida'
        RETURN p1.id as pieza1, p2.id as pieza2, 
               p1.estado as estado1, p2.estado as estado2,
               r.desde_lado as lado
        """
        
        result = self.session.run(query_omitidas_validas)
        for record in result:
            problemas.append({
                'tipo': 'relacion_valida_con_pieza_omitida',
                'pieza1': record['pieza1'],
                'pieza2': record['pieza2'],
                'estado1': record['estado1'],
                'estado2': record['estado2'],
                'lado': record['lado'],
                'accion_sugerida': 'Marcar relación como valida: false'
            })
        
        query_unidireccionales = """
        MATCH (p1:Pieza)-[r1:CONECTA_CON]->(p2:Pieza)
        WHERE NOT EXISTS((p2)-[:CONECTA_CON]->(p1))
        RETURN p1.id as pieza1, p2.id as pieza2, r1.desde_lado as lado
        """
        
        result = self.session.run(query_unidireccionales)
        for record in result:
            problemas.append({
                'tipo': 'relacion_unidireccional',
                'pieza1': record['pieza1'],
                'pieza2': record['pieza2'],
                'lado': record['lado'],
                'accion_sugerida': 'Crear relación inversa'
            })
        
        query_sin_conexiones = """
        MATCH (p:Pieza {estado: 'libre'})
        WHERE size(p.picos_disponibles) = 0 OR size(p.hendiduras_disponibles) = 0
        RETURN p.id as pieza_id, 
               size(p.picos_disponibles) as picos_disp,
               size(p.hendiduras_disponibles) as hendiduras_disp
        """
        
        result = self.session.run(query_sin_conexiones)
        for record in result:
            problemas.append({
                'tipo': 'pieza_sin_conexiones_disponibles',
                'pieza_id': record['pieza_id'],
                'picos_disponibles': record['picos_disp'],
                'hendiduras_disponibles': record['hendiduras_disp'],
                'accion_sugerida': 'Revisar si la pieza puede conectarse'
            })
        
        return {
            'total_problemas': len(problemas),
            'integridad_ok': len(problemas) == 0,
            'problemas': problemas,
            'timestamp_validacion': datetime.now().isoformat()
        }
    
    def corregir_relaciones_invalidas(self) -> Dict:
        query = """
        MATCH (p1:Pieza)-[r:CONECTA_CON {valida: true}]-(p2:Pieza)
        WHERE p1.estado = 'omitida' OR p2.estado = 'omitida'
        SET r.valida = false,
            r.timestamp_correccion = timestamp(),
            r.razon_correccion = 'Corrección automática: pieza omitida'
        RETURN count(r) as corregidas
        """
        
        result = self.session.run(query)
        corregidas = result.single()['corregidas']
        
        return {
            'exito': True,
            'relaciones_corregidas': corregidas,
            'timestamp': datetime.now().isoformat()
        }
    
    def _obtener_pieza(self, pieza_id: int) -> Optional[Dict]:
        """Obtiene la información de una pieza."""
        query = """
        MATCH (p:Pieza {id: $pieza_id})
        RETURN p
        """
        
        result = self.session.run(query, {'pieza_id': pieza_id})
        record = result.single()
        
        return dict(record['p']) if record else None