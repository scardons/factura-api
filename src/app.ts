import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import facturaRoutes from './routes/factura.routes';
import authRoutes from './routes/auth.routes';  // ✅ importa tus rutas de autenticación

dotenv.config();

const app = express();
app.use(express.json());

// Servir frontend estático
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/facturas', facturaRoutes);
app.use('/auth', authRoutes); // ✅ registrar rutas de autenticación

export default app;
