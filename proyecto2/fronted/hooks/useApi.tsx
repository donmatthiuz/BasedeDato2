import { useState } from 'react';

const useApi = (link: string | URL | Request) => {
  const [error, setError] = useState("");

  const llamado = async (body: any, metodo: any) => {
    try {
      const fetchOptions = {
        method: metodo,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(link, fetchOptions);
      const data = await response.json();

      if (response.ok) {
        return data;
      }
      if (response.status === 401){
        setError("Credenciales no validas");
      }else if (response.status >= 500 && response.status < 600){
        setError("Error en el servidor");
      }
      return null;
       // Asegura un retorno en todos los casos
    } catch (err) {
      if (error instanceof TypeError) {
        // Error de red (fallo de fetch)
        setError("No hay conexion con el servidor"); // No se pudo conectar al servidor
      } else {
        setError("No hay conexion con el servidor"); // Error desconocido
      }
      return null
    }
  };

  const llamado_whit_link = async (link_:string, metodo: any) => {
    try {
      const fetchOptions = {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(link_, fetchOptions);
      const data = await response.json();

      if (response.ok) {
        return data;
      }
      setError(data);
      return null; // Asegura un retorno en todos los casos
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const llamadowithheader = async (headers: { map: (arg0: (header: { title: any; value: any; }) => any[]) => Iterable<readonly [PropertyKey, any]>; }, body: any, metodo: any) => {
    try {
      const fetchOptions = {
        method: metodo,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(headers.map((header: { title: any; value: any; }) => [header.title, header.value])),
        },
      };
      const response = await fetch(link, fetchOptions);
      const data = await response.json();

      if (response.ok) {
        return data;
      }
      setError(data);
      return null; // Asegura un retorno en todos los casos
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const llamadowithheaderwithoutbody = async (headers, metodo) => {
    try {
      const fetchOptions = {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(headers.map((header) => [header.title, header.value])),
        },
      };
      const response = await fetch(link, fetchOptions);
      const data = await response.json();

      if (response.ok) {
        return data;
      }
      setError(data);
      return null; // Asegura un retorno en todos los casos
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const llamadowithoutbody = async (metodo) => {
    try {
      const fetchOptions = {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(link, fetchOptions);
      const data = await response.json();

      if (response.ok) {
        return data;
      }
      setError(data);
      return null; // Asegura un retorno en todos los casos
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const llamadowithFileAndBody = async (file, body, metodo) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Append body fields to FormData
      Object.entries(body).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const fetchOptions = {
        method: metodo,
        body: formData,
      };

      const response = await fetch(link, fetchOptions);
      const data = await response.json();

      if (response.ok) {
        return data;
      }

      setError(data);
      return null;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  return {
    error,
    llamado,
    llamadowithoutbody,
    llamadowithheader,
    llamadowithheaderwithoutbody,
    llamadowithFileAndBody,
    setError,
    llamado_whit_link
  };
};

export default useApi;