import { Request, Response } from 'express';
import { procesarFacturaService } from '../services/factura.service';

export const procesarFacturaPDF = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No se subió ningún archivo' });
    return;
  }

  try {
    const resultado = await procesarFacturaService(req.file.path);
    res.json(resultado);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al procesar la factura' });
  }
};
