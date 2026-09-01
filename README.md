# SecureShop Backend

Backend local para SecureShop usando Node.js + Express + TypeScript y archivos JSON para simular PostgreSQL.

## Usuarios dummy

| Usuario | Password | Rol |
|---|---|---|
| `admin` | `Admin123!` | ADMIN |
| `cliente1` | `Cliente123!` | CUSTOMER |
| `cliente2` | `Cliente123!` | CUSTOMER |

> Las contraseñas dummy están en texto plano únicamente porque `users.json` funciona como una base de datos simulada para el laboratorio. Esto será un hallazgo de seguridad útil para la fase de auditoría y posteriormente puede remediarse con hashing.

## Ejecutar en PowerShell

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

API: `http://localhost:3000`

## Endpoints

- `GET /health`
- `POST /api/login`
- `GET /api/products`
- `POST /api/products` — ADMIN
- `PUT /api/products/:id` — ADMIN
- `POST /api/orders` — autenticado
- `GET /api/orders/:id` — propietario o ADMIN

## Login

```json
{
  "username": "cliente1",
  "password": "Cliente123!"
}
```

Las rutas protegidas usan:

```text
Authorization: Bearer <token>
```

## Persistencia JSON

- `src/data/users.json`
- `src/data/products.json`
- `src/data/orders.json`

Las altas y modificaciones se escriben directamente en esos archivos.

## Seguridad implementada

- JWT con expiración.
- RBAC para endpoints administrativos.
- Validación BOLA para pedidos.
- Validación básica de entradas.
- CORS configurable.

## Importante para la rúbrica

Al usar archivos JSON no existe SQL real, por lo que una PoC auténtica de SQL Injection no puede ejecutarse contra esta versión. La capa `src/services/jsonDb.ts` está separada para reemplazarla después por PostgreSQL y consultas parametrizadas sin cambiar los endpoints.
