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


