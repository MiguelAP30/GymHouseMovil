import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';

const connection = SQLite.openDatabaseSync('gymhouse.db');

// Crear tablas si no existen
connection.execSync(`
  CREATE TABLE IF NOT EXISTS difficulties (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    dateAdded TEXT NOT NULL,
    dificulty_id INTEGER NOT NULL,
    image TEXT NOT NULL,
    machine_id INTEGER NOT NULL,
    video TEXT NOT NULL,
    FOREIGN KEY (dificulty_id) REFERENCES difficulties(id),
    FOREIGN KEY (machine_id) REFERENCES machines(id)
  );
`);

export const db = drizzle(connection, { schema });

console.log('Base de datos inicializada'); 