import express from 'express';
import dotenv from 'dotenv';
import facturaRoutes from './routes/factura.routes';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

// Servir archivos estáticos (incluye index.html en /public)
app.use(express.static(path.join(__dirname, '../public')));


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/facturas', facturaRoutes);

export default app;
