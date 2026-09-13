export interface Exercise {
  id: number;
  title: string;
  level: string;
  points: number;
  description: string;
  expectedQuery: string;
}

export const EXERCISES: Exercise[] = [
  // --- NIVEL 0 (1 punto cada uno) ---
  {
    id: 1,
    title: "N0-1. Todas las bandas",
    level: "Nivel 0",
    points: 1,
    description: "Todas las bandas musicales con sus respectivos campos (todos).",
    expectedQuery: "SELECT * FROM bandas;"
  },
  {
    id: 2,
    title: "N0-2. Nombre y país",
    level: "Nivel 0",
    points: 1,
    description: "Solo el nombre y el país de origen de todas las bandas.",
    expectedQuery: "SELECT nombre, pais_origen FROM bandas;"
  },
  {
    id: 3,
    title: "N0-3. Orden por creación",
    level: "Nivel 0",
    points: 1,
    description: "El nombre y la fecha de creación de todas las bandas, ordenadas por fecha de creación (de más reciente a más antiguo).",
    expectedQuery: "SELECT nombre, fecha_creacion FROM bandas ORDER BY fecha_creacion DESC;"
  },
  {
    id: 4,
    title: "N0-4. Bandas de Rock",
    level: "Nivel 0",
    points: 1,
    description: "El nombre y el país de origen de todas las bandas que son del género 'Rock'.",
    expectedQuery: "SELECT nombre, pais_origen FROM bandas WHERE genero = 'Rock';"
  },
  {
    id: 5,
    title: "N0-5. Todos los álbumes",
    level: "Nivel 0",
    points: 1,
    description: "Todos los álbumes con sus respectivos campos (todos).",
    expectedQuery: "SELECT * FROM albumes;"
  },
  {
    id: 6,
    title: "N0-6. Álbumes orden A-Z",
    level: "Nivel 0",
    points: 1,
    description: "Solo el nombre y la duración de todos los álbumes, ordenados por orden alfabético de nombre (de A a Z).",
    expectedQuery: "SELECT nombre, duracion FROM albumes ORDER BY nombre ASC;"
  },
  {
    id: 7,
    title: "N0-7. Ranking de álbumes",
    level: "Nivel 0",
    points: 1,
    description: "El ranking y el nombre de todos los álbumes, ordenados de mejor (1) a peor ranking.",
    expectedQuery: "SELECT ranking, nombre FROM albumes ORDER BY ranking ASC;"
  },
  {
    id: 8,
    title: "N0-8. Canciones por duración",
    level: "Nivel 0",
    points: 1,
    description: "El nombre y la duración de todas las canciones, ordenadas por duración (de más larga a más corta).",
    expectedQuery: "SELECT nombre, duracion FROM canciones ORDER BY duracion DESC;"
  },
  {
    id: 9,
    title: "N0-9. Conciertos por fecha",
    level: "Nivel 0",
    points: 1,
    description: "El nombre y fecha de todos los conciertos, ordenados por fecha (de más antiguo a más reciente).",
    expectedQuery: "SELECT nombre, fecha FROM conciertos ORDER BY fecha ASC;"
  },

  // --- NIVEL 1 (2 puntos cada uno) ---
  {
    id: 10,
    title: "N1-1. Bandas de 5 integrantes",
    level: "Nivel 1",
    points: 2,
    description: "El nombre y el país de origen de todas las bandas que tienen exactamente 5 integrantes.",
    expectedQuery: "SELECT nombre, pais_origen FROM bandas WHERE cant_integrantes = 5;"
  },
  {
    id: 11,
    title: "N1-2. Álbumes > 40 mins",
    level: "Nivel 1",
    points: 2,
    description: "El nombre y la duración de todos los álbumes que tienen una duración mayor a 40 minutos.",
    expectedQuery: "SELECT nombre, duracion FROM albumes WHERE duracion > 40;"
  },
  {
    id: 12,
    title: "N1-3. Canciones <= 3 mins",
    level: "Nivel 1",
    points: 2,
    description: "El nombre y la duración de todas las canciones que tienen una duración menor o igual a 3 minutos.",
    expectedQuery: "SELECT nombre, duracion FROM canciones WHERE duracion <= 3;"
  },
  {
    id: 13,
    title: "N1-4. Conciertos en Argentina",
    level: "Nivel 1",
    points: 2,
    description: "El nombre y la fecha de todos los conciertos que se realizaron en el país 'Argentina'.",
    expectedQuery: "SELECT nombre, fecha FROM conciertos WHERE pais = 'Argentina';"
  },
  {
    id: 14,
    title: "N1-5. Top 7 Álbumes",
    level: "Nivel 1",
    points: 2,
    description: "El nombre y ranking de los mejores 7 álbumes de la historia, ordenados alfabéticamente por nombre.",
    expectedQuery: "SELECT nombre, ranking FROM albumes ORDER BY ranking ASC LIMIT 7;"
  },

  // --- NIVEL 2 (3 puntos cada uno) ---
  {
    id: 15,
    title: "N2-1. Peores 5 canciones",
    level: "Nivel 2",
    points: 3,
    description: "El nombre y ranking de las peores 5 canciones de la historia, ordenadas de peor a mejor ranking.",
    expectedQuery: "SELECT nombre, ranking FROM canciones ORDER BY ranking DESC LIMIT 5;"
  },
  {
    id: 16,
    title: "N2-2. Álbumes de The Beatles",
    level: "Nivel 2",
    points: 3,
    description: "El nombre de todos los álbumes de la banda 'The Beatles'.",
    expectedQuery: "SELECT a.nombre FROM albumes a JOIN bandas b ON a.banda_id = b.id WHERE b.nombre = 'The Beatles';"
  },
  {
    id: 17,
    title: "N2-3. Bandas antiguas (<=1980)",
    level: "Nivel 2",
    points: 3,
    description: "El nombre de todas las bandas que tienen al menos un álbum lanzado antes o en el año 1980 sin repetir.",
    expectedQuery: "SELECT DISTINCT b.nombre FROM bandas b JOIN albumes a ON b.id = a.banda_id WHERE a.lanzamiento <= 1980;"
  },
  {
    id: 18,
    title: "N2-4. Conciertos ARG pre-2010",
    level: "Nivel 2",
    points: 3,
    description: "El nombre y la fecha de los conciertos en 'Argentina' que tuvieron lugar antes del año 2010.",
    expectedQuery: "SELECT nombre, fecha FROM conciertos WHERE pais = 'Argentina' AND fecha < 2010;"
  },
  {
    id: 19,
    title: "N2-5. Duración total Queen",
    level: "Nivel 2",
    points: 3,
    description: "La suma de la duración de todas las canciones de la banda 'Queen'.",
    expectedQuery: "SELECT SUM(c.duracion) AS duracion_total FROM canciones c JOIN bandas b ON c.banda_id = b.id WHERE b.nombre = 'Queen';"
  },
  {
    id: 20,
    title: "N2-6. Duración total Rolling Stones",
    level: "Nivel 2",
    points: 3,
    description: "La suma de la duración de todos los álbumes de la banda 'The Rolling Stones'.",
    expectedQuery: "SELECT SUM(a.duracion) AS duracion_total FROM albumes a JOIN bandas b ON a.banda_id = b.id WHERE b.nombre = 'The Rolling Stones';"
  },
  {
    id: 21,
    title: "N2-7. Conciertos Dire Straits",
    level: "Nivel 2",
    points: 3,
    description: "El nombre de los conciertos a los cuales asistió la banda 'Dire Straits'.",
    expectedQuery: "SELECT c.nombre FROM conciertos c JOIN conciertos_musicos cm ON c.id = cm.concierto_id JOIN bandas b ON cm.banda_id = b.id WHERE b.nombre = 'Dire Straits';"
  },
  {
    id: 22,
    title: "N2-8. Bandas con álbum corto",
    level: "Nivel 2",
    points: 3,
    description: "El nombre de las bandas que tienen al menos un álbum con una duración menor a 40 minutos sin repetir.",
    expectedQuery: "SELECT DISTINCT b.nombre FROM bandas b JOIN albumes a ON b.id = a.banda_id WHERE a.duracion < 40;"
  },

  // --- NIVEL 3 (4 puntos cada uno) ---
  {
    id: 23,
    title: "N3-1. Álbumes largos (>50m)",
    level: "Nivel 3",
    points: 4,
    description: "El nombre de las bandas cuyos álbumes (todos) duran más de 50 minutos.",
    expectedQuery: "SELECT b.nombre FROM bandas b WHERE NOT EXISTS (SELECT 1 FROM albumes a WHERE a.banda_id = b.id AND a.duracion <= 50);"
  },
  {
    id: 24,
    title: "N3-2. Canciones post-2000",
    level: "Nivel 3",
    points: 4,
    description: "Nombre de canciones (con su álbum) pertenecientes a álbumes post-2000. Ordenar por álbum (A-Z) y canción (Z-A).",
    expectedQuery: "SELECT c.nombre AS cancion, a.nombre AS album FROM canciones c JOIN albumes a ON c.album_id = a.id WHERE a.lanzamiento > 2000 ORDER BY a.nombre ASC, c.nombre DESC;"
  },
  {
    id: 25,
    title: "N3-3. Rock Alternativo virtuoso",
    level: "Nivel 3",
    points: 4,
    description: "Bandas con menos de 5 integrantes y género 'Rock Alternativo' cuyas canciones duran 4 o más minutos (todas ellas).",
    expectedQuery: "SELECT DISTINCT b.nombre FROM bandas b WHERE b.cant_integrantes < 5 AND b.genero = 'Rock Alternativo' AND NOT EXISTS (SELECT 1 FROM canciones c WHERE c.banda_id = b.id AND c.duracion < 4);"
  },
  {
    id: 26,
    title: "N3-4. Concierto masivo",
    level: "Nivel 3",
    points: 4,
    description: "El concierto con más bandas participantes, mostrando el nombre del concierto y la cantidad de bandas.",
    expectedQuery: "SELECT c.nombre, COUNT(*) AS cantidad_bandas FROM conciertos c JOIN conciertos_musicos cm ON c.id = cm.concierto_id GROUP BY c.id ORDER BY cantidad_bandas DESC LIMIT 1;"
  },
  {
    id: 27,
    title: "N3-5. Álbumes de bandas en ARG",
    level: "Nivel 3",
    points: 4,
    description: "Álbumes de bandas que fueron al menos a un concierto en 'Argentina', ordenados por ranking de mejor a peor.",
    expectedQuery: "SELECT a.nombre FROM albumes a WHERE a.banda_id IN (SELECT DISTINCT cm.banda_id FROM conciertos_musicos cm JOIN conciertos c ON cm.concierto_id = c.id WHERE c.pais = 'Argentina') ORDER BY a.ranking ASC;"
  },
  {
    id: 28,
    title: "N3-6. Cantidad de canciones",
    level: "Nivel 3",
    points: 4,
    description: "Cantidad de canciones por banda ordenadas de mayor a menor. Mostrar nombre de la banda y cantidad.",
    expectedQuery: "SELECT b.nombre, COUNT(*) AS cantidad_canciones FROM bandas b JOIN canciones c ON b.id = c.banda_id GROUP BY b.id ORDER BY cantidad_canciones DESC;"
  },

  // --- NIVEL 4 (5 puntos cada uno) ---
  {
    id: 29,
    title: "N4-1. Primer álbum por banda",
    level: "Nivel 4",
    points: 5,
    description: "El primer álbum de todas las bandas. Mostrar nombre de la banda, del álbum y año de lanzamiento.",
    expectedQuery: "SELECT b.nombre AS banda, a.nombre AS album, a.lanzamiento FROM albumes a JOIN bandas b ON a.banda_id = b.id WHERE a.lanzamiento = (SELECT MIN(a2.lanzamiento) FROM albumes a2 WHERE a2.banda_id = a.banda_id);"
  },
  {
    id: 20,
    title: "N4-2. Promedio integrantes género",
    level: "Nivel 4",
    points: 5,
    description: "Cantidad promedio de integrantes por género musical. Mostrar género y promedio.",
    expectedQuery: "SELECT genero, ROUND(AVG(cant_integrantes), 2) AS promedio_integrantes FROM bandas GROUP BY genero;"
  },
  {
    id: 31,
    title: "N4-3. Asistencia perfecta ARG",
    level: "Nivel 4",
    points: 5,
    description: "Nombre de las bandas que participaron en todos los conciertos que ocurrieron en 'Argentina'.",
    expectedQuery: "SELECT b.nombre FROM bandas b WHERE NOT EXISTS (SELECT 1 FROM conciertos c WHERE c.pais = 'Argentina' AND NOT EXISTS (SELECT 1 FROM conciertos_musicos cm WHERE cm.concierto_id = c.id AND cm.banda_id = b.id));"
  },
  {
    id: 32,
    title: "N4-4. Promedio canciones > 5 min",
    level: "Nivel 4",
    points: 5,
    description: "Bandas cuyo promedio de duración de canciones es mayor a 5 minutos. Mostrar nombre y promedio.",
    expectedQuery: "SELECT b.nombre, ROUND(AVG(c.duracion), 2) AS promedio_duracion FROM bandas b JOIN canciones c ON b.id = c.banda_id GROUP BY b.id HAVING AVG(c.duracion) > 5;"
  },
  {
    id: 33,
    title: "N4-5. Bandas sin conciertos",
    level: "Nivel 4",
    points: 5,
    description: "El nombre de las bandas que no tienen conciertos registrados.",
    expectedQuery: "SELECT b.nombre FROM bandas b WHERE b.id NOT IN (SELECT DISTINCT cm.banda_id FROM conciertos_musicos cm);"
  },
  {
    id: 34,
    title: "N4-6. Álbumes con canciones > rank 30",
    level: "Nivel 4",
    points: 5,
    description: "Nombre y ranking de los álbumes que tienen todas sus canciones con un ranking peor o igual a 30.",
    expectedQuery: "SELECT a.nombre, a.ranking FROM albumes a WHERE NOT EXISTS (SELECT 1 FROM canciones c WHERE c.album_id = a.id AND c.ranking <= 30);"
  },
  {
    id: 35,
    title: "N4-7. Mayoría canciones malas",
    level: "Nivel 4",
    points: 5,
    description: "Bandas con más de la mitad de sus canciones con ranking >= 30. Mostrar nombre, cantidad de canciones y promedio.",
    expectedQuery: "SELECT b.nombre, COUNT(CASE WHEN c.ranking > 30 THEN 1 END) AS cantidad_rankeadas, ROUND(AVG(c.ranking), 2) AS promedio_ranking FROM bandas b JOIN canciones c ON b.id = c.banda_id GROUP BY b.id HAVING COUNT(CASE WHEN c.ranking > 30 THEN 1 END) > COUNT(*) / 2;"
  },
  {
    id: 36,
    title: "N4-8. Sin Top 10",
    level: "Nivel 4",
    points: 5,
    description: "Bandas sin canciones en el TOP 10. Mostrar nombre, promedio de ranking y ranking mínimo (mejor canción).",
    expectedQuery: "SELECT b.nombre, ROUND(AVG(c.ranking), 2) AS promedio_ranking, MIN(c.ranking) AS ranking_minimo FROM bandas b JOIN canciones c ON b.id = c.banda_id GROUP BY b.id HAVING MIN(c.ranking) > 10;"
  },
  {
    id: 37,
    title: "N4-9. Canción supera álbum",
    level: "Nivel 4",
    points: 5,
    description: "Canciones con ranking mejor que su álbum. Mostrar canción, ranking canción, álbum y ranking álbum.",
    expectedQuery: "SELECT c.nombre AS cancion, c.ranking AS ranking_cancion, a.nombre AS album, a.ranking AS ranking_album FROM canciones c JOIN albumes a ON c.album_id = a.id WHERE c.ranking < a.ranking ORDER BY c.ranking ASC;"
  },
  {
    id: 38,
    title: "N4-10. Localía de banda",
    level: "Nivel 4",
    points: 5,
    description: "Bandas y conciertos donde el concierto se realizó en el país de origen de la banda (Banda, Concierto, País).",
    expectedQuery: "SELECT b.nombre AS banda, c.nombre AS concierto, b.pais_origen FROM bandas b JOIN conciertos_musicos cm ON b.id = cm.banda_id JOIN conciertos c ON cm.concierto_id = c.id WHERE c.pais = b.pais_origen;"
  }
];