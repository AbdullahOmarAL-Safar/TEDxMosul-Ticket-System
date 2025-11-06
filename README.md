<div align="center">

# 🎟️ TEDxMosul Ticket System

Production‑ready event ticket booking and management platform for TEDx Mosul.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Made with TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11.x-e0234e?logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61dafb?logo=react&logoColor=000)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql&logoColor=white)

<sub>Docs for both apps: <a href="backend/README.md">backend/README.md</a> • <a href="frontend/README.md">frontend/README.md</a></sub>

</div>

---

## 🎯 Overview / Purpose

TEDxMosul Ticket System powers the full lifecycle of TEDx events: from publishing events and speakers, to secure ticket booking, approval workflow, QR code check‑in, and admin management. It’s designed for clarity, speed, and maintainability using a clean NestJS/React stack.

Key highlights:
- 🔐 JWT auth with role‑based access control (Admin, Staff, User)
- 🎫 Seat selection and ticket booking with approval workflow
- 🧾 QR/PDF tickets and on‑site scanning support
- 🗂️ Admin dashboard for users, events, speakers, and bookings
- 🌙 Dark mode and responsive UI

---

## 🧱 System Architecture

```
┌────────────────────┐        Axios (HTTP)         ┌──────────────────────┐         TypeORM         ┌────────────────────┐
│  React Frontend    │  <──────────────────────>   │  NestJS API (4000)   │  <──────────────────>  │   PostgreSQL DB    │
│  (Vite/CRA • 3000) │        CORS + JWT           │  Auth • Events • ... │       Entities/DTOs    │  users • events... │
└────────────────────┘                             └──────────────────────┘                         └────────────────────┘
```

---

## ✅ Features Summary

- Authentication & Authorization: JWT login/register, password hashing (bcrypt), RBAC guards
- Event Management: CRUD for events, capacity, scheduling, speaker linking
- Booking Workflow: Pending → Approve/Reject, capacity checks, user history
- Speakers: Profiles, bios, social links, event mapping
- Admin: Manage users/roles, bookings, events, speakers; metrics‑ready structure
- UX: Dark mode, responsive layout, QR code scanning support

---

## 📁 Directory Structure

```
TEDxMosul Ticket System/
├─ backend/                      # NestJS app (API + DB)
│  ├─ src/
│  │  ├─ auth/                  # JWT, guards, strategies
│  │  ├─ users/                 # users CRUD, roles, DTOs
│  │  ├─ events/                # events module
│  │  ├─ bookings/              # booking module
│  │  ├─ speakers/              # speakers module
│  │  ├─ database/              # database module & seeding
│  │  └─ main.ts                # bootstrap (CORS, pipes, port)
│  ├─ .env                      # backend environment (PORT=4000, DB, JWT)
│  └─ README.md
│
└─ frontend/                    # React app (UI)
   ├─ src/
   │  ├─ api/                   # axios instance + services
   │  ├─ components/            # reusable UI components
   │  ├─ pages/                 # routed screens
   │  └─ App.tsx / index.tsx
   ├─ .env                      # frontend environment (PORT=3000)
   └─ README.md
```

---

## 🛠️ Installation

Prerequisites:
- Node.js 18+ and npm
- PostgreSQL 13+ running locally

Clone the repository:

```bash
git clone https://github.com/AbdullahOmarAL-Safar/TEDxMosul-Ticket-System.git
cd "TEDxMosul Ticket System"
```

Install dependencies for both apps:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## ▶️ Run Both Servers

Run individually in two terminals:

```bash
# Terminal A — Backend (NestJS)
cd backend
npm run start:dev   # http://localhost:4000

# Terminal B — Frontend (React)
cd frontend
npm start           # http://localhost:3000
```

Notes:
- The frontend talks to the backend via `REACT_APP_API_URL` (default http://localhost:4000)
- CORS is enabled in `backend/src/main.ts` for http://localhost:3000

---

## 🔧 Environment Variables

Create `.env` files as shown below.

Backend (`backend/.env`):

```env
PORT=4000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=tedxmosul_db
JWT_SECRET=change_me
```

Frontend (`frontend/.env`):

```env
PORT=3000
REACT_APP_API_URL=http://localhost:4000
```

---

## 🧩 Tech Stack

| Area      | Technology |
|-----------|------------|
| Backend   | NestJS 11, TypeScript, TypeORM, class‑validator, bcrypt |
| Frontend  | React + TypeScript, React Router, Axios, CSS Modules |
| Database  | PostgreSQL |
| Security  | JWT Auth, Role Guards, ValidationPipe, CORS |

---

## 🔄 Data Flow

```text
User → Frontend (React)
	→ POST /auth/login → Backend (NestJS) → Validate (bcrypt/DB) → Issue JWT → Frontend stores token
	→ GET /events → Backend → DB → Events list
	→ POST /bookings (JWT) → Create booking (PENDING)
Admin → PATCH /bookings/:id/approve → Seats decrement → QR issued
On-site → QR scan → Verify ticket → Check‑in
```

---

## 🖼️ Screenshots / Preview

> Replace placeholders with real screenshots.

![Homepage](https://github.com/AbdullahOmarAL-Safar/TEDxMosul-Ticket-System/blob/main/frontend/public/123.png)
![Seat Selection](https://github.com/AbdullahOmarAL-Safar/TEDxMosul-Ticket-System/blob/main/frontend/public/314.png)
![Admin Dashboard](https://github.com/AbdullahOmarAL-Safar/TEDxMosul-Ticket-System/blob/main/frontend/public/713.png)
---

## 🤝 Contributing

Contributions are welcome! To propose a change:

1. Fork the repo and create a feature branch
2. Commit with clear messages (Conventional Commits preferred)
3. Open a Pull Request describing the change and context
4. Add screenshots for UI changes where possible

Please review coding style in the respective app READMEs:
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙌 Credits / Acknowledgment

- Built by: **Abdullah Omar AL‑Saffar** · GitHub: [@AbdullahOmarAL-Safar](https://github.com/AbdullahOmarAL-Safar)
- For: **TEDx Mosul** — Ideas Worth Spreading
- Thanks to contributors and the open‑source community

---

<div align="center">

Made with ❤️ for the TEDx community.

</div>
