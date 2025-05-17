import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { procesarFacturaPDF } from '../controllers/factura.controller';

const router = Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/subir', upload.single('factura'), procesarFacturaPDF);

export default router;
