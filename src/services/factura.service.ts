import fs from 'fs';
import pdfParse from 'pdf-parse';
import { cargarTokens } from '../store/tokenStore'; // Correcto
import { extraerDatosFactura } from '../utils/extraerDatosFactura';
import { buscarOCrearCliente, buscarOCrearProducto, crearFacturaQuickBooks } from '../clients/quickbooks.client';
import { getAccessTokenSeguro } from './auth.service';

export const procesarFacturaService = async (rutaArchivo: string) => {
  console.log('--- procesarFacturaService llamado ---');

  const tokensGuardados = await cargarTokens();
  console.log('Tokens guardados actualmente:', tokensGuardados);

  if (!tokensGuardados || !tokensGuardados.access_token) {
    throw new Error('QuickBooks no autenticado');
  }

  const accessToken = await getAccessTokenSeguro();
  console.log('🔑 Token usado para API:', accessToken);

  if (!accessToken) {
    throw new Error('No se pudo obtener un token válido para QuickBooks');
  }

  const dataBuffer = fs.readFileSync(rutaArchivo);
  const pdfData = await pdfParse(dataBuffer);
  const texto = pdfData.text;

  console.log('Texto extraído del PDF:', texto);

  const datos = extraerDatosFactura(texto);
  console.log('Datos extraídos de la factura:', datos);

  // Llamadas sin pasar token explícitamente, ya se manejan internamente
  const cliente = await buscarOCrearCliente(datos.nombreCliente, datos.emailCliente);
  console.log('Cliente obtenido o creado:', cliente);

  const producto = await buscarOCrearProducto(datos.nombreProducto);
  console.log('Producto obtenido o creado:', producto);

  const factura = {
    CustomerRef: { value: cliente.Id },
    Line: [
      {
        Amount: datos.monto,
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          ItemRef: { value: producto.Id, name: producto.Name }
        }
      }
    ],
    BillEmail: { Address: datos.emailCliente }
  };

  const respuestaFactura = await crearFacturaQuickBooks(factura);
  console.log('Respuesta de creación de factura en QuickBooks:', respuestaFactura);

  return {
    textoExtraido: texto,
    datosExtraidos: datos,
    quickbooksResponse: respuestaFactura
  };
};
