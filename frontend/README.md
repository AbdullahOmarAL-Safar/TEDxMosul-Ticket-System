<div align="center"># Getting Started with Create React App



# ⚛️ TEDxMosul Ticket System – FrontendThis project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).



React client for event browsing, ticket booking, and admin management.## Available Scripts



![React](https://img.shields.io/badge/React-19.x-61dafb?logo=react&logoColor=000)In the project directory, you can run:

![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178c6?logo=typescript&logoColor=white)

![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios&logoColor=white)### `npm start`

![React Router](https://img.shields.io/badge/React%20Router-7.x-CA4245?logo=reactrouter&logoColor=white)

Runs the app in the development mode.\

</div>Open [http://localhost:3000](http://localhost:3000) to view it in the browser.



---The page will reload if you make edits.\

You will also see any lint errors in the console.

## 🎯 Description

### `npm test`

The frontend for **TEDxMosul Ticket System** delivers a responsive, user-friendly interface for browsing TEDx events, booking tickets with seat selection, managing profiles, and admin dashboards. Built with React 19 and TypeScript for type safety and maintainability.

Launches the test runner in the interactive watch mode.\

---See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.



## ✨ Features (Frontend-Specific)### `npm run build`



- 🎫 **Event Listings** – Browse upcoming events with speakers and detailsBuilds the app for production to the `build` folder.\

- 🪑 **Interactive Seat Selection** – Visual seat map for ticket bookingIt correctly bundles React in production mode and optimizes the build for the best performance.

- 🔐 **Authentication Flow** – Login/register with JWT token management

- 🎟️ **My Tickets** – View booked tickets with QR codes and PDF downloadThe build is minified and the filenames include the hashes.\

- 📊 **Admin Dashboard** – Manage users, events, speakers, and bookingsYour app is ready to be deployed!

- 📷 **QR Check-In** – Scanner UI using html5-qrcode library

- 🌙 **Dark Mode** – Toggle between light and dark themesSee the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

- 📱 **Responsive Design** – Mobile-first layout with CSS Modules

### `npm run eject`

---

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

## 📁 Folder Structure

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

```

frontend/Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

├─ public/

│  ├─ index.htmlYou don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

│  ├─ 123.png, 314.png, 713.png    # Screenshots

│  └─ manifest.json## Learn More

│

├─ src/You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

│  ├─ api/

│  │  ├─ axios.ts                  # Axios instance with interceptorsTo learn React, check out the [React documentation](https://reactjs.org/).

│  │  ├─ authService.ts            # Auth API calls
│  │  ├─ userService.ts            # User management APIs
│  │  └─ index.ts
│  │
│  ├─ components/
│  │  ├─ EventCard.tsx             # Event preview card
│  │  ├─ Navbar.tsx                # Top navigation bar
│  │  └─ ProtectedRoute.tsx        # Route guard for auth
│  │
│  ├─ context/
│  │  └─ AuthContext.tsx           # Global auth state (JWT, user, role)
│  │
│  ├─ pages/
│  │  ├─ Home.tsx                  # Landing page with event list
│  │  ├─ EventDetails.tsx          # Event detail view
│  │  ├─ SeatSelection.tsx         # Interactive seat picker
│  │  ├─ MyTickets.tsx             # User booking history
│  │  ├─ Speakers.tsx              # Speaker profiles
│  │  ├─ Login.tsx / Register.tsx  # Auth pages
│  │  ├─ CheckIn.tsx               # QR scanner for staff
│  │  ├─ Dashboard.tsx             # User dashboard
│  │  └─ admin/                    # Admin CRUD pages
│  │
│  ├─ styles/                      # Global CSS and theme variables
│  ├─ types/                       # TypeScript interfaces
│  ├─ utils/                       # Helper functions
│  ├─ App.tsx                      # Root component with routing
│  └─ index.tsx                    # Entry point
│
├─ .env                            # Environment variables
├─ package.json
└─ tsconfig.json
```

---

## 🛠️ Installation

**Prerequisites:**
- Node.js 18+ and npm
- Backend API running on port 4000 (see `../backend/README.md`)

**Steps:**

```bash
# Clone the repository (if not already)
git clone https://github.com/AbdullahOmarAL-Safar/TEDxMosul-Ticket-System.git
cd "TEDxMosul Ticket System/frontend"

# Install dependencies
npm install
```

---

## 🔧 Environment Setup

Create a `.env` file in the `frontend/` directory:

```env
PORT=3000
REACT_APP_API_URL=http://localhost:4000
```

**Variables:**
- `PORT` – Port for the React dev server (default: 3000)
- `REACT_APP_API_URL` – Backend API base URL

---

## 🚀 Development Commands

```bash
# Start development server (http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (not recommended)
npm run eject
```

---

## 🔗 API Integration Flow

The frontend communicates with the NestJS backend via **Axios**:

1. **Axios Instance** (`src/api/axios.ts`):
   - Base URL: `process.env.REACT_APP_API_URL`
   - Request interceptor: Attaches JWT token from `localStorage`
   - Response interceptor: Clears token on 401 errors

2. **Service Modules**:
   - `authService.ts` → `/auth/login`, `/auth/register`
   - `userService.ts` → `/users`, `/users/:id/role`
   - Event/Booking APIs called directly via `api.get()`, `api.post()`, etc.

3. **Example Request**:
   ```typescript
   import api from './api/axios';
   
   const { data } = await api.get('/events');
   const events = data; // Array of events
   ```

---

## 🔐 Authentication Flow

1. **Login/Register**:
   - User submits credentials via `Login.tsx` or `Register.tsx`
   - Frontend calls `/auth/login` or `/auth/register`
   - Backend returns `{ access_token: "...", user: {...} }`
   - Token stored in `localStorage` and managed by `AuthContext`

2. **JWT Decoding**:
   - Token payload decoded client-side to extract `{ sub, email, role }`
   - User info stored in `AuthContext` state

3. **Protected Routes**:
   - `ProtectedRoute.tsx` checks `token` existence
   - Redirects to `/login` if unauthenticated
   - Role-based guards (e.g., admin-only routes)

4. **Token Refresh**:
   - On 401 error, token cleared and user redirected to login

---

## 💅 UI/UX Design

**Color Palette** (TEDx Branding):
- Primary: `#EB0028` (TEDx Red)
- Secondary: `#000000` (Black)
- Accent: `#FFFFFF` (White)
- Dark Mode: `#1a1a1a`, `#2d2d2d`

**Typography**:
- Headings: Helvetica, Arial, sans-serif
- Body: System fonts for performance

**Layout**:
- Mobile-first responsive design
- CSS Modules for component-scoped styling
- Consistent spacing with 8px grid system

**Components**:
- `Navbar`: Sticky header with auth status
- `EventCard`: Card layout with hover effects
- `SeatSelection`: Grid-based interactive seat picker
- Dark mode toggle in user menu

---

## 🖼️ Screenshots / Preview

> See actual screenshots in the root README or at:
> - [Homepage](public/123.png)
> - [Seat Selection](public/314.png)
> - [Admin Dashboard](public/713.png)

---

## 🚧 Future Enhancements

- [ ] Real-time booking updates via WebSockets
- [ ] Multi-language support (Arabic/English)
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications for booking confirmations
- [ ] Progressive Web App (PWA) support
- [ ] Advanced analytics dashboard for admins
- [ ] Social media sharing for events
- [ ] Accessibility improvements (ARIA labels, screen reader support)

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](../LICENSE) file for details.

---

## 🙌 Credits

Built with ❤️ for **TEDx Mosul** by [Abdullah Omar AL-Safar](https://github.com/AbdullahOmarAL-Safar)

---

<div align="center">

**⚛️ Powered by React • 🚀 Ideas Worth Spreading**

</div>
