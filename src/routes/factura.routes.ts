import { Router } from 'express';
import multer from 'multer';
import { procesarFacturaPDF } from '../controllers/factura.controller';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/subir', upload.single('factura'), procesarFacturaPDF);

export default router;
