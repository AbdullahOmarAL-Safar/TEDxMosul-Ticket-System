# 🎭 TEDxMosul Tickets System

Full-stack event management and ticketing platform for TEDx Mosul — featuring seat selection, QR tickets, and a professional admin dashboard.

---

## 🚀 Live Demo

🔗 Coming soon

---

## 🧠 Overview

TEDxMosul Tickets System streamlines event management from creation to check-in.
It includes authentication, seat booking, QR tickets, and admin control — all in one responsive web app.

### Highlights

- 🎫 Realistic seat selection (auditorium layout)
- 🔐 JWT authentication & role-based access
- 🎟️ QR + PDF tickets
- 🧾 Full CRUD admin panel
- 🌓 Dark/Light mode
- 📱 Fully responsive UI

---

## 🏗️ Tech Stack

**Frontend:** React 18 + TypeScript • Axios • React Router • jsPDF • html5-qrcode  
**Backend:** NestJS 10 • TypeORM • PostgreSQL • JWT • bcrypt • uuid  
**Tools:** Git • npm • ESLint • Nodemon

---

## ⚙️ Key Features

| Module | Core Functions |
|--------|----------------|
| Booking | Interactive seat map, QR ticket, PDF download |
| Auth | JWT login / register, hashed passwords, role control |
| Admin | CRUD for events / speakers / users / bookings, stats dashboard |
| Check-In | Camera QR scanner + manual ID validation |
| Speakers | Profiles with bios & social links |
| Theme | Dark / Light mode with smooth transition |

---

## 💡 Architecture

```
frontend/
 ├── components/ | pages/ | context/
backend/
 ├── auth/ | users/ | events/ | speakers/ | bookings/
database/
 └── PostgreSQL (users, events, speakers, bookings)
```

---

## 🧰 Setup

```bash
# Clone
git clone https://github.com/AbdullahOmarAL-Safar/TEDxMosul-Ticket-System.git
cd TEDxMosul-Ticket-System
```

### Backend
```bash
cd backend
npm install
# .env → configure PostgreSQL & JWT_SECRET
npm run start:dev
```

### Frontend
```bash
cd ../frontend
npm install
npm start
```

**Frontend:** http://localhost:3000  
**API:** http://localhost:3001

---

## 🔐 Default Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tedxmosul.com | admin123 |

---

## 🛡️ Security

- ✅ JWT tokens + role guards
- ✅ bcrypt hashed passwords
- ✅ DTO validation (class-validator)
- ✅ SQL injection & XSS protection
- ✅ Seat locking to prevent over-booking

---

## 📸 Screenshots (Preview)

![Homepage](https://via.placeholder.com/800x400?text=TEDxMosul+Homepage)

![Seat Selection](https://via.placeholder.com/800x400?text=Interactive+Seat+Map)

![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard)

---

## 🧑‍💻 Author

**Abdullah Omar AL-Safar**  
GitHub · [@AbdullahOmarAL-Safar](https://github.com/AbdullahOmarAL-Safar)  
Affiliation · TEDx Mosul / QAF Lab Bootcamp

---

## 📈 Status

**Version 1.0** · ✅ Production Ready  
**Next steps** → Payments · Email alerts · Multilingual support

---

<div align="center">

**Built with ❤️ for TEDx Mosul**  
*Ideas Worth Spreading*

</div>
