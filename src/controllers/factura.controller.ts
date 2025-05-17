import { Request, Response } from 'express';
import fs from 'fs';
import pdfParse from 'pdf-parse';

export const procesarFacturaPDF = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
     res.status(400).json({ error: 'No se subió ningún archivo' });
     return
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

     res.json({
      success: true,
      textoExtraido: pdfData.text
    });
  } catch (error) {
    console.error('Error al procesar el PDF:', error);
     res.status(500).json({ error: 'Error al procesar el PDF' });
     return
  }
};
