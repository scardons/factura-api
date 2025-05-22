// src/clients/quickbooks.client.ts
import axios from 'axios';
import { getAccessTokenSeguro, cargarTokens } from '../services/auth.service';

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
}

export async function buscarOCrearCliente(nombre: string, email: string) {
  const tokens = await cargarTokens();
  const token = await getAccessTokenSeguro();
  const realmId = tokens?.realmId;

  if (!token || !realmId) {
    throw new Error('QuickBooks no autenticado correctamente (token o realmId faltante)');
  }

  const query = `select * from Customer where DisplayName='${nombre}'`;
  const res = await axios.get(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(query)}`,
    { headers: authHeaders(token) }
  );

  if (res.data.QueryResponse?.Customer?.length > 0) {
    return res.data.QueryResponse.Customer[0];
  }

  const createRes = await axios.post(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/customer`,
    {
      DisplayName: nombre,
      PrimaryEmailAddr: { Address: email },
    },
    { headers: authHeaders(token) }
  );

  return createRes.data.Customer;
}

export async function buscarOCrearProducto(nombre: string) {
  const tokens = await cargarTokens();
  const token = await getAccessTokenSeguro();
  const realmId = tokens?.realmId;

  if (!token || !realmId) {
    throw new Error('QuickBooks no autenticado correctamente (token o realmId faltante)');
  }

  const query = `select * from Item where Name='${nombre}'`;
  const res = await axios.get(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(query)}`,
    { headers: authHeaders(token) }
  );

  if (res.data.QueryResponse?.Item?.length > 0) {
    return res.data.QueryResponse.Item[0];
  }

  const createRes = await axios.post(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/item`,
    {
      Name: nombre,
      Type: 'Service',
      IncomeAccountRef: {
        value: '79',
        name: 'Sales of Product Income',
      },
    },
    { headers: authHeaders(token) }
  );

  return createRes.data.Item;
}

export async function crearFacturaQuickBooks(factura: any) {
  const tokens = await cargarTokens();
  const accessToken = await getAccessTokenSeguro();
  const realmId = tokens?.realmId;

  if (!accessToken || !realmId) {
    throw new Error('QuickBooks no autenticado correctamente (token o realmId faltante)');
  }

  const res = await axios.post(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/invoice`,
    factura,
    {
      headers: {
        ...authHeaders(accessToken),
        'Content-Type': 'application/json',
      },
    }
  );

  return res.data;
}
