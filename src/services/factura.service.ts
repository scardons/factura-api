//src/services/factura.service.ts
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { quickbooksTokens } from '../store/tokenStore';
import { extraerDatosFactura } from '../utils/extraerDatosFactura';
import { buscarOCrearCliente, buscarOCrearProducto, crearFacturaQuickBooks } from '../clients/quickbooks.client';

export const procesarFacturaService = async (rutaArchivo: string) => {
  console.log('--- procesarFacturaService llamado ---');
  console.log('quickbooksTokens actual:', quickbooksTokens);

  if (!quickbooksTokens) {
    console.error('Error: QuickBooks no autenticado - quickbooksTokens está null o undefined');
    throw new Error('QuickBooks no autenticado');
  }

  const dataBuffer = fs.readFileSync(rutaArchivo);
  const pdfData = await pdfParse(dataBuffer);
  const texto = pdfData.text;

  console.log('Texto extraído del PDF:', texto);

  const datos = extraerDatosFactura(texto);
  console.log('Datos extraídos de la factura:', datos);

  // Llamadas sin realmId ni token (ya se obtienen internamente)
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
