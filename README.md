# SafeAShop Backend - PostgreSQL - Vulnerable Lab Version

This is the intentionally vulnerable version used before remediation.
Run it only in a local/controlled lab environment.

## Requirements

- Node.js 18+
- PostgreSQL 16
- Database named `safeashop`

## Setup

1. Install dependencies:

   npm install

2. Create `.env` from `.env.example` and update `DB_PASSWORD`.

3. Create the database in PostgreSQL:

   CREATE DATABASE safeashop;

4. Run `database/init.sql` against the `safeashop` database.

5. Start the API:

   npm run dev

6. Health check:

   GET http://localhost:3000/health

## Dummy users

- admin / Admin123! / ADMIN
- cliente1 / Cliente123! / CUSTOMER
- cliente2 / Cliente123! / CUSTOMER

## Intentionally vulnerable controls

- SQL Injection: `GET /api/products?name=...` concatenates the `name` value into SQL.
- Broken RBAC: authenticated CUSTOMER users can call `POST /api/products` and `PUT /api/products/:id`.
- BOLA/IDOR: `GET /api/orders/:id` does not verify order ownership.
- Weak JWT configuration: predictable/default secret and no issuer/audience checks.
- Plaintext passwords in PostgreSQL.
- No rate limiting on `/api/login`.

These weaknesses are intentional and are intended to be fixed in the remediation phase.
