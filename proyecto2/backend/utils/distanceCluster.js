/**
 * Calcula la distancia geográfica entre dos coordenadas usando Leaflet.
 * @param {Array} a - Punto A [lat, lon]
 * @param {Array} b - Punto B [lat, lon]
 * @returns {number} - Distancia en metros
 */
function geoDistance(a, b) {
  return L.latLng(a[0], a[1]).distanceTo(L.latLng(b[0], b[1]));
}

/**
 * Agrupa puntos geográficos basados en una distancia mínima entre ellos.
 * Cada grupo se forma conectando puntos que estén a menos de `minDistance` metros.
 *
 * No requiere definir el número de clusters de antemano (a diferencia de K-Means).
 *
 * @param {Array} data - Lista de puntos [lat, lon]
 * @param {number} minDistance - Distancia máxima entre puntos de un mismo grupo (en metros)
 * @returns {Object} - { centroids, assignments }
 *    - centroids: centroides de cada cluster (promedio de puntos)
 *    - assignments: array de índices que indica a qué cluster pertenece cada punto
 */
function distanceBasedClustering(data, minDistance = 500000) {
  // Inicializar etiquetas de cluster (undefined al inicio)
  const labels = new Array(data.length).fill(undefined);
  let clusterId = 0;

  // Iterar sobre cada punto
  for (let i = 0; i < data.length; i++) {
    if (labels[i] !== undefined) continue; // Ya asignado

    labels[i] = clusterId; // Crear nuevo cluster

    // Verificar otros puntos que estén dentro del rango de distancia
    for (let j = i + 1; j < data.length; j++) {
      if (labels[j] === undefined) {
        const dist = geoDistance(data[i], data[j]);
        if (dist <= minDistance) {
          labels[j] = clusterId; // Asignar al mismo cluster
        }
      }
    }

    clusterId++; // Pasar al siguiente cluster
  }

  // Calcular centroides de cada cluster como promedio de coordenadas
  const centroids = [];
  for (let id = 0; id < clusterId; id++) {
    const points = data.filter((_, i) => labels[i] === id);
    const avgLat = points.reduce((sum, p) => sum + p[0], 0) / points.length;
    const avgLng = points.reduce((sum, p) => sum + p[1], 0) / points.length;
    centroids.push([avgLat, avgLng]);
  }

  return { centroids, assignments: labels };
}
