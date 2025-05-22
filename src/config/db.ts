// src/config/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // necesario para Render y algunos otros servicios en la nube
  },
});

// Opcional: para probar la conexión al iniciar la app
pool.connect()
  .then((client: { release: () => void; }) => {
    console.log('Conectado a la base de datos PostgreSQL');
    client.release();
  })
  .catch((err: { stack: any; }) => {
    console.error('Error conectando a la base de datos', err.stack);
  });
