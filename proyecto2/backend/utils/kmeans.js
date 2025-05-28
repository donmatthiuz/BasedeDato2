/**
 * Calcula la distancia euclidiana entre dos puntos en 2D.
 * @param {Array} a - Punto A [lat, lon]
 * @param {Array} b - Punto B [lat, lon]
 * @returns {number} - Distancia euclidiana
 */
function euclideanDistance(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}

/**
 * Algoritmo K-Means para agrupamiento de coordenadas.
 * @param {Array} data - Lista de puntos [lat, lon]
 * @param {number} k - Número de clusters a formar
 * @param {number} maxIterations - Número máximo de iteraciones del algoritmo
 * @returns {Object} - { centroids, assignments }
 */
function kmeans(data, k, maxIterations = 100) {
  const centroids = [];
  const assignments = new Array(data.length);

  // Inicialización aleatoria de k centroides únicos
  const usedIndexes = new Set();
  while (centroids.length < k) {
    const index = Math.floor(Math.random() * data.length);
    if (!usedIndexes.has(index)) {
      centroids.push(data[index]);
      usedIndexes.add(index);
    }
  }

  // Iterar para mejorar centroides
  for (let iter = 0; iter < maxIterations; iter++) {
    // Asignar cada punto al centroide más cercano
    for (let i = 0; i < data.length; i++) {
      let minDist = Infinity;
      let assigned = 0;
      for (let j = 0; j < k; j++) {
        const dist = euclideanDistance(data[i], centroids[j]);
        if (dist < minDist) {
          minDist = dist;
          assigned = j;
        }
      }
      assignments[i] = assigned;
    }

    // Calcular nuevos centroides como promedio de sus puntos asignados
    const sums = Array.from({ length: k }, () => [0, 0]);
    const counts = Array(k).fill(0);
    for (let i = 0; i < data.length; i++) {
      const cluster = assignments[i];
      sums[cluster][0] += data[i][0];
      sums[cluster][1] += data[i][1];
      counts[cluster]++;
    }

    // Actualizar posición de cada centroide
    for (let j = 0; j < k; j++) {
      if (counts[j] === 0) continue; // evitar división por 0
      centroids[j] = [sums[j][0] / counts[j], sums[j][1] / counts[j]];
    }
  }

  return { centroids, assignments };
}

/**
 * Aplica el método del codo para evaluar diferentes valores de k.
 * Calcula la distorsión (suma de errores al cuadrado) para cada k.
 * @param {Array} data - Puntos [lat, lon]
 * @param {number} maxK - Valor máximo de k a probar
 * @returns {Array} - Lista de objetos {k, distortion}
 */
function elbowMethod(data, maxK = 10) {
  const distortions = [];

  for (let k = 1; k <= maxK; k++) {
    const { centroids, assignments } = kmeans(data, k);
    let distortion = 0;

    // Calcular la suma de distancias al cuadrado entre cada punto y su centroide
    for (let i = 0; i < data.length; i++) {
      const c = centroids[assignments[i]];
      distortion += euclideanDistance(data[i], c) ** 2;
    }

    distortions.push({ k, distortion });
  }

  // Mostrar en consola los valores calculados
  console.log("Distorsiones calculadas por K:");
  distortions.forEach((d) => {
    console.log(`k = ${d.k}, distorsión = ${d.distortion.toFixed(2)}`);
  });

  return distortions;
}

/**
 * Selecciona el mejor número de clusters k basado en el cambio porcentual de distorsión.
 * Busca cuando la mejora en distorsión ya no es significativa.
 * @param {Array} distortions - Resultado de elbowMethod()
 * @param {number} minDropPercent - Porcentaje mínimo de mejora para considerar un mejor k
 * @returns {number} - Valor óptimo de k
 */
function findBestK(distortions, minDropPercent = 10) {
  console.log("Evaluando caída porcentual:");

  for (let i = 1; i < distortions.length; i++) {
    const drop = distortions[i - 1].distortion - distortions[i].distortion;
    const percent = (drop / distortions[i - 1].distortion) * 100;

    console.log(`k = ${distortions[i].k}, caída = ${percent.toFixed(1)}%`);

    if (percent < minDropPercent) {
      const selected = Math.max(distortions[i - 1].k, 2);
      console.log(
        `Seleccionado por caída < ${minDropPercent}%: k = ${selected}`
      );
      return selected;
    }
  }

  // Si no se encuentra una caída significativa, usar el último valor
  const fallback = distortions[distortions.length - 1].k;
  console.log(`Sin caída fuerte. Usando último k: ${fallback}`);
  return fallback;
}
