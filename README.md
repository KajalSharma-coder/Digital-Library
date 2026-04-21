# Digital Library Management System

A full-stack Digital Library Management System built with React, Node.js, Express, and MongoDB.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt

## Project Structure

```text
DLMS/
  client/
  server/
  .gitignore
  README.md
```

## Features

- Modern responsive landing page
- Student registration and login
- Separate admin login
- JWT authentication with role-based access
- Book search, filtering, pagination
- Issue request and approval workflow
- Student and admin dashboards
- Toast notifications, loaders, skeletons, empty states
- Deployment-ready environment configuration

## Setup

### 1. Install dependencies

```bash
cd DLMS
npm install

cd server
npm install

cd ../client
npm install
```

### 2. Configure environment variables

Ready-to-run local `.env` files are already included:

```bash
client/.env
server/.env
```

If you want to regenerate them from the examples:

```bash
cd server
copy .env.example .env

cd ../client
copy .env.example .env
```

### 3. Start MongoDB

Use a local MongoDB instance or MongoDB Atlas.

### 4. Run the backend

```bash
cd server
npm run dev
```

### 5. Run the frontend

```bash
cd client
npm run dev
```

### 6. Run the full project automatically

```bash
cd DLMS
npm run dev
```

## Default Admin

On server start, the app seeds an admin using the credentials in `server/.env`:

- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Demo Data

If the books collection is empty, the server automatically seeds demo books into MongoDB on startup so the dashboards have data immediately.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login/student`
- `POST /api/auth/login/admin`
- `GET /api/books`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`
- `POST /api/transactions/request/:bookId`
- `PATCH /api/transactions/:id/approve`
- `PATCH /api/transactions/:id/reject`
- `PATCH /api/transactions/:id/return`
- `GET /api/transactions/my-history`
- `GET /api/admin/stats`
- `GET /api/admin/users`

## Deployment Notes

- Frontend is configured to use `VITE_API_URL`
- Backend enables CORS with `CLIENT_URL`
- Set strong secrets in production
- Use MongoDB Atlas or a managed MongoDB instance
