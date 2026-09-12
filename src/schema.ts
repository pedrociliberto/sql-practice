export const INITIAL_SCHEMA = `
-- Crear tablas de la guía
CREATE TABLE bandas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    pais_origen TEXT NOT NULL,
    fecha_creacion INTEGER NOT NULL,
    genero TEXT NOT NULL,
    cant_integrantes INTEGER NOT NULL
);

CREATE TABLE albumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    banda_id INTEGER NOT NULL REFERENCES bandas(id),
    nombre TEXT NOT NULL,
    lanzamiento INTEGER NOT NULL,
    duracion INTEGER NOT NULL,
    ranking INTEGER UNIQUE NOT NULL
);

CREATE TABLE canciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    banda_id INTEGER NOT NULL REFERENCES bandas(id),
    album_id INTEGER NOT NULL REFERENCES albumes(id),
    nombre TEXT NOT NULL,
    duracion INTEGER NOT NULL,
    ranking INTEGER UNIQUE NOT NULL
);

CREATE TABLE conciertos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    pais TEXT NOT NULL,
    fecha INTEGER NOT NULL
);

CREATE TABLE conciertos_musicos (
    concierto_id INTEGER NOT NULL REFERENCES conciertos(id),
    banda_id INTEGER NOT NULL REFERENCES bandas(id),
    PRIMARY KEY (concierto_id, banda_id)
);

-- Datos precargados de prueba
INSERT INTO bandas (nombre, pais_origen, fecha_creacion, genero, cant_integrantes) VALUES 
('The Beatles', 'Reino Unido', 1960, 'Rock', 4),
('Queen', 'Reino Unido', 1970, 'Rock', 4),
('Soda Stereo', 'Argentina', 1982, 'Rock en español', 3);

INSERT INTO albumes (banda_id, nombre, lanzamiento, duracion, ranking) VALUES 
(1, 'Abbey Road', 1969, 47, 1),
(2, 'A Night at the Opera', 1975, 43, 2),
(3, 'Doble Vida', 1988, 41, 15);
`;