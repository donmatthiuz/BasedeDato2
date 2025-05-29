# Instalacion

Para instalar lo del fronted deberan usar yarn

```
yarn install
```

# Distribucion de trabajo

- Algoritmo | Mathew 
- Piece managment | Gaby 
- Puzzle managment | Abby

# LLamado a api 

Para ello deberan usar en /hooks/useApi.tsx que es un hook personalizado de React para realizar llamadas `fetch` a una API con diferentes configuraciones de headers, métodos HTTP, cuerpos, y archivos.

## Importación

```tsx
import useApi from './ruta/del/hook/useApi';
```

## Uso

```tsx
const {
  error,
  llamado,
  llamadowithoutbody,
  llamadowithheader,
  llamadowithheaderwithoutbody,
  llamadowithFileAndBody,
  setError,
  llamado_whit_link
} = useApi('https://tu-api.com/endpoint');
```

---

## Parámetro

- `link: string | URL | Request`: Ruta base o endpoint por defecto de la API.

---

## Métodos

### `llamado(body: any, metodo: string): Promise<any | null>`

Realiza una petición con cuerpo y método HTTP específico.

**Parámetros:**
- `body`: Objeto a enviar como JSON.
- `metodo`: Método HTTP (`"POST"`, `"PUT"`, etc.).

**Retorna:** JSON si la respuesta es exitosa, `null` si hay error.

---

### `llamadowithoutbody(metodo: string): Promise<any | null>`

Realiza una petición con un método HTTP pero sin cuerpo.

**Parámetros:**
- `metodo`: Método HTTP (`"GET"`, `"DELETE"`, etc.).

**Retorna:** JSON si la respuesta es exitosa, `null` si hay error.

---

### `llamadowithheader(headers: { title: string, value: string }[], body: any, metodo: string): Promise<any | null>`

Realiza una petición con headers personalizados y cuerpo.

**Parámetros:**
- `headers`: Arreglo de objetos con `title` y `value`.
- `body`: Objeto a enviar como JSON.
- `metodo`: Método HTTP.

**Retorna:** JSON si la respuesta es exitosa, `null` si hay error.

---

### `llamadowithheaderwithoutbody(headers: { title: string, value: string }[], metodo: string): Promise<any | null>`

Realiza una petición con headers personalizados pero sin cuerpo.

**Parámetros:**
- `headers`: Arreglo de objetos con `title` y `value`.
- `metodo`: Método HTTP.

**Retorna:** JSON si la respuesta es exitosa, `null` si hay error.

---

### `llamadowithFileAndBody(file: File, body: any, metodo: string): Promise<any | null>`

Realiza una petición con archivo y campos de cuerpo utilizando `FormData`.

**Parámetros:**
- `file`: Archivo a enviar.
- `body`: Campos adicionales a enviar en el `FormData`.
- `metodo`: Método HTTP (`"POST"`, `"PUT"`, etc.).

**Retorna:** JSON si la respuesta es exitosa, `null` si hay error.

---

### `llamado_whit_link(link_: string, metodo: string): Promise<any | null>`

Hace una llamada simple a un `link` específico con un método HTTP, sin cuerpo.

**Parámetros:**
- `link_`: Endpoint específico.
- `metodo`: Método HTTP.

**Retorna:** JSON si la respuesta es exitosa, `null` si hay error.

---

### `error: string`

Estado que contiene el último mensaje de error generado por alguna de las llamadas.

---

### `setError: React.Dispatch<React.SetStateAction<string>>`

Permite limpiar o establecer manualmente el estado de `error`.

---

## Ejemplo

```tsx
const { llamado, error } = useApi("https://api.example.com/login");

const login = async () => {
  const data = await llamado({ username: "user", password: "1234" }, "POST");
  if (data) {
    console.log("Login exitoso", data);
  } else {
    console.error("Error:", error);
  }
};
```


# Base URL

Para usar el endpoint de nuestro fronted sera en source_repo.tsx, que exporta una constante con el enlace base (`base URL`) del servidor backend o API. Se encuentra en /repositori/source_repo.ts


---

## Contenido

```ts
const source_link = "http://localhost:3000";
export default source_link;
```

---

## Propósito

La constante `source_link` se utiliza como el **endpoint base** para realizar peticiones a la API. Centraliza la configuración de la URL del backend, facilitando su reutilización en toda la aplicación y permitiendo modificarla desde un solo lugar si se cambia el entorno (por ejemplo, de desarrollo a producción).

---

## Uso

Puedes importar `source_link` en cualquier parte de tu aplicación para construir URLs de peticiones:

```ts
import source_link from './source_repo';

// Ejemplo de uso en una llamada fetch
fetch(`${source_link}/api/usuarios`)
  .then(res => res.json())
  .then(data => console.log(data));
```


# ID Puzzle. 

Se encuentra en /hooks/useID.tsx


Hook personalizado para manejar el ID del puzzle del usuario, utilizando `localStorage`.

---

## Descripción

`useID` es un hook de React que permite almacenar y recuperar el ID del puzzle desde el `localStorage` del navegador. Este ID puede representar, por ejemplo, el progreso actual del usuario en un puzzle o su identificador de sesión relacionada al puzzle.

---

## Código

```ts
import { useState, useEffect } from 'react';

// Hook para gestionar el ID de usuario
const useID = () => {
  const [userID, setUserID] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('user_id') : null
  );

  // Guarda el ID en localStorage cada vez que se actualice
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (userID) {
        localStorage.setItem('user_id', userID);
      } else {
        localStorage.removeItem('user_id');
      }
    }
  }, [userID]);

  return {
    userID,
    setUserID,
  };
};

export default useID;
```
## Uso


```tsx
import useID from './hooks/useID';

const PuzzleComponent = () => {
  const { userID, setUserID } = useID();

  const startPuzzle = () => {
    setUserID("puzzle-1234");
  };

  return (
    <div>
      <p>Tu ID de puzzle es: {userID}</p>
      <button onClick={startPuzzle}>Iniciar Puzzle</button>
    </div>
  );
};
```