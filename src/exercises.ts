export interface Exercise {
  id: number;
  title: string;
  level: string;
  description: string;
  expectedQuery: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: 1,
    title: "1. Todas las bandas",
    level: "Nivel 0",
    description: "Mostrá todas las bandas musicales con todos sus campos (todos).",
    expectedQuery: "SELECT * FROM bandas;"
  },
  {
    id: 2,
    title: "2. Nombre y país de las bandas",
    level: "Nivel 0",
    description: "Mostrá solo el nombre y el país de origen de todas las bandas.",
    expectedQuery: "SELECT nombre, pais_origen FROM bandas;"
  },
  {
    id: 3,
    title: "3. Orden por fecha de creación",
    level: "Nivel 0",
    description: "Mostrá el nombre y la fecha de creación de todas las bandas, ordenadas por fecha de creación (de más reciente a más antiguo).",
    expectedQuery: "SELECT nombre, fecha_creacion FROM bandas ORDER BY fecha_creacion DESC;"
  },
  {
    id: 4,
    title: "4. Álbumes largos",
    level: "Nivel 1",
    description: "Mostrá el nombre y la duración de todos los álbumes que tienen una duración mayor a 40 minutos.",
    expectedQuery: "SELECT nombre, duracion FROM albumes WHERE duracion > 40;"
  }
];