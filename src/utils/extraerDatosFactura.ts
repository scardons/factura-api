// src/utils/extraerDatosFactura.ts
export function extraerDatosFactura(texto: string) {
  const nombreMatch = texto.match(/Nombre del cliente:\s*(.+)/i);
  const emailMatch = texto.match(/Email del cliente:\s*(.+)/i);
  const productoMatch = texto.match(/Producto:\s*(.+)/i);
  const montoMatch = texto.match(/Monto:\s*([\d.,]+)/i); // sin '$' ni 'COP'

  return {
    nombreCliente: nombreMatch?.[1]?.trim() || '',
    emailCliente: emailMatch?.[1]?.trim() || '',
    nombreProducto: productoMatch?.[1]?.trim() || '',
    monto: parseFloat((montoMatch?.[1] || '0').replace(/[^\d.]/g, ''))
  };
}
