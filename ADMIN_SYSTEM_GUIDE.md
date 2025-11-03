# 👑 TEDxMosul Admin System - Complete Implementation Guide

## 🎯 Overview

A complete Admin System has been implemented for the TEDxMosul Tickets application with full CRUD capabilities for Events, Speakers, Bookings, and Users. The system features role-based access control (RBAC) with three user roles: **Admin**, **Staff**, and **User**.

---

## 🔐 Admin Credentials

**Default Admin Account:**
- **Email:** `admin@tedxmosul.com`
- **Password:** `admin123`
- **Role:** Admin
- **Auto-created:** Yes (on backend startup if not exists)

---

## 🏗️ Backend Implementation

### 1. Role Management System

#### **New File: `backend/src/auth/role.enum.ts`**
```typescript
export enum Role {
    Admin = 'admin',
    User = 'user',
    Staff = 'staff',
}
```

**Purpose:** Type-safe role definitions across the entire backend

---

### 2. Updated Seed Service

#### **Modified: `backend/src/database/seed.service.ts`**

**Key Changes:**
- ✅ **Always checks for admin user** on startup
- ✅ Creates admin user if not found
- ✅ Uses `Role.Admin` enum for type safety
- ✅ Separates admin creation from sample data seeding

**Admin User Specs:**
```typescript
{
    name: 'Admin User',
    email: 'admin@tedxmosul.com',
    password: bcrypt.hash('admin123', 10),
    role: Role.Admin,
}
```

---

### 3. Users Management API

#### **Updated: `backend/src/users/users.controller.ts`**

**New Endpoints:**
- `GET /users` - Get all users (Admin only)
- `PATCH /users/:id/role` - Update user role (Admin only)

**Protected by:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
```

#### **Updated: `backend/src/users/users.service.ts`**

**New Methods:**
- `findAll()` - Returns users without password field
- `updateRole(userId, role)` - Updates user role

---

### 4. Enhanced Controllers

#### **Events Controller** (`backend/src/events/events.controller.ts`)
- ✅ Updated to use `Role.Admin` enum
- ✅ POST, PUT, DELETE protected (Admin only)
- ✅ GET endpoints remain public

#### **Speakers Controller** (`backend/src/speakers/speakers.controller.ts`)
- ✅ Updated to use `Role.Admin` enum
- ✅ POST, PUT, DELETE protected (Admin only)
- ✅ Supports event assignment

#### **Bookings Controller** (`backend/src/bookings/bookings.controller.ts`)
- ✅ Updated to use `Role.Admin` and `Role.Staff` enums
- ✅ GET all bookings (Admin only)
- ✅ Check-in endpoint (Admin/Staff)

---

## 🎨 Frontend Implementation

### 1. Admin Dashboard Layout

#### **New File: `frontend/src/pages/admin/AdminDashboard.tsx`**

**Features:**
- ✅ Sidebar navigation with 5 sections
- ✅ Auto-redirects non-admin users
- ✅ TEDx branded header
- ✅ User info display with role badge
- ✅ "Back to Site" button
- ✅ Uses React Router `<Outlet />` for nested routes

**Navigation Structure:**
```
/admin               → Dashboard Overview
/admin/events        → Events Management
/admin/speakers      → Speakers Management
/admin/bookings      → Bookings Overview
/admin/users         → Users Management
```

---

### 2. Admin Styling

#### **New File: `frontend/src/pages/admin/AdminDashboard.css`**

**Key Styles:**
- ✅ Fixed sidebar (280px width)
- ✅ Responsive grid layouts
- ✅ Modal system (overlay + content)
- ✅ Table styles with hover effects
- ✅ Form inputs with focus states
- ✅ Action buttons (Edit/Delete)
- ✅ Stats cards with animations
- ✅ TEDx red (#e62b1e) accent colors

---

### 3. Admin Pages

#### **3.1 Admin Home** (`frontend/src/pages/admin/AdminHome.tsx`)

**Features:**
- ✅ 4 stat cards (Events, Bookings, Users, Speakers)
- ✅ Quick action buttons to all sections
- ✅ Loads real-time data from API
- ✅ Welcome message with gradient banner

---

#### **3.2 Admin Events** (`frontend/src/pages/admin/AdminEvents.tsx`)

**Features:**
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Table with event details (ID, Title, Date, Location, Capacity, Available Seats)
- ✅ Modal forms for Add/Edit
- ✅ Delete confirmation dialog
- ✅ Success/Error toast notifications
- ✅ Real-time capacity tracking

**Form Fields:**
- Title *
- Description *
- Date & Time *
- Location *
- Image URL (optional)
- Capacity *

---

#### **3.3 Admin Speakers** (`frontend/src/pages/admin/AdminSpeakers.tsx`)

**Features:**
- ✅ Full CRUD operations
- ✅ Event assignment dropdown
- ✅ Bio text preview in table
- ✅ Modal forms for Add/Edit
- ✅ Event association support

**Form Fields:**
- Speaker Name *
- Bio *
- Image URL (optional)
- Assign to Event (dropdown)

---

#### **3.4 Admin Bookings** (`frontend/src/pages/admin/AdminBookings.tsx`)

**Features:**
- ✅ View all bookings with user and event details
- ✅ Filter by status (All, Confirmed, Checked In, Cancelled)
- ✅ Check-in button for confirmed bookings
- ✅ Stats summary (Total, Confirmed, Checked In, Cancelled)
- ✅ Seat information display
- ✅ Booking date/time

**Table Columns:**
- ID
- User (Name + Email)
- Event (Title + Date)
- Seats
- Status (Badge)
- Booked At
- Actions (Check In button)

---

#### **3.5 Admin Users** (`frontend/src/pages/admin/AdminUsers.tsx`)

**Features:**
- ✅ View all users with role badges
- ✅ Change user roles (Admin/Staff/User)
- ✅ Role confirmation dialogs
- ✅ Role distribution stats
- ✅ Warning notice about elevated permissions

**Available Actions:**
- Promote to Admin (👑)
- Assign Staff role (🛡️)
- Demote to User (👤)

**Role Stats Cards:**
- Total Admins
- Total Staff
- Total Users

---

### 4. Navigation Updates

#### **Modified: `frontend/src/components/Navbar.tsx`**

**Changes:**
- ✅ Removed "+ Create Event" button
- ✅ Added "👑 Admin Panel" button (visible only for admins)
- ✅ Gradient red background
- ✅ Links to `/admin` route

---

#### **Modified: `frontend/src/App.tsx`**

**New Routes:**
```typescript
<Route path="/admin" element={<AdminDashboard />}>
  <Route index element={<AdminHome />} />
  <Route path="events" element={<AdminEvents />} />
  <Route path="speakers" element={<AdminSpeakers />} />
  <Route path="bookings" element={<AdminBookings />} />
  <Route path="users" element={<AdminUsers />} />
</Route>
```

**Route Protection:**
- Admin panel automatically redirects non-admin users to home
- Uses `useAuth()` hook to check `user.role === 'admin'`

---

## 🚀 How to Use the Admin System

### Step 1: Start the Application

**Backend:**
```bash
cd backend
npm run start:dev
```
✅ Admin user will be auto-created on startup

**Frontend:**
```bash
cd frontend
npm start
```

---

### Step 2: Login as Admin

1. Go to `http://localhost:3000`
2. Click **Login**
3. Enter credentials:
   - Email: `admin@tedxmosul.com`
   - Password: `admin123`
4. Click **Login**

---

### Step 3: Access Admin Panel

1. After login, you'll see "👑 Admin Panel" button in navbar
2. Click it to go to `/admin`
3. You'll see the dashboard with stats and sidebar navigation

---

### Step 4: Manage Resources

#### **Events Management** (`/admin/events`)
1. Click "➕ Create Event"
2. Fill in event details
3. Click "Create Event"
4. Event appears in table
5. Click "✏️ Edit" to modify
6. Click "🗑️ Delete" to remove

#### **Speakers Management** (`/admin/speakers`)
1. Click "➕ Create Speaker"
2. Fill in speaker details
3. Optionally assign to an event
4. Click "Create Speaker"
5. Manage via Edit/Delete buttons

#### **Bookings Overview** (`/admin/bookings`)
1. View all bookings in table
2. Use filter dropdown to filter by status
3. Click "✓ Check In" for confirmed bookings
4. View stats at bottom

#### **Users Management** (`/admin/users`)
1. View all registered users
2. See current roles with badges
3. Click role buttons to change user roles:
   - "👑 Admin" - Full access
   - "🛡️ Staff" - Check-in access
   - "👤 User" - Standard user
4. Confirm role change in dialog

---

## 🔒 Security & Authorization

### Backend Guards

**JwtAuthGuard:**
- Validates JWT token
- Extracts user info from token

**RolesGuard:**
- Checks if user has required role
- Uses `@Roles()` decorator

**Example:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Delete(':id')
remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
}
```

---

### Frontend Protection

**Route-level:**
- Admin routes check `user.role === 'admin'`
- Auto-redirect to home if unauthorized

**Component-level:**
- Navbar conditionally renders Admin Panel button
- Based on `role` from `useAuth()` context

---

## 📊 Role Permissions Matrix

| Feature | Admin | Staff | User |
|---------|-------|-------|------|
| View Events | ✅ | ✅ | ✅ |
| Create/Edit/Delete Events | ✅ | ❌ | ❌ |
| View Speakers | ✅ | ✅ | ✅ |
| Create/Edit/Delete Speakers | ✅ | ❌ | ❌ |
| View All Bookings | ✅ | ❌ | ❌ |
| Check-in Attendees | ✅ | ✅ | ❌ |
| View Own Bookings | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ |
| Change Roles | ✅ | ❌ | ❌ |
| Access Admin Panel | ✅ | ❌ | ❌ |

---

## 🎨 UI/UX Features

### Design System
- **Primary Color:** TEDx Red (#e62b1e)
- **Success:** Green (#28a745)
- **Info:** Blue (#0066cc)
- **Warning:** Yellow (#ffc107)
- **Danger:** Red (#dc3545)

### Interactive Elements
- ✅ Hover effects on tables and buttons
- ✅ Loading spinners during API calls
- ✅ Toast notifications (success/error)
- ✅ Confirmation dialogs for destructive actions
- ✅ Modal forms with overlay
- ✅ Smooth animations and transitions

### Responsive Design
- ✅ Sidebar collapses on mobile
- ✅ Table horizontal scroll on small screens
- ✅ Grid layouts adapt to viewport
- ✅ Touch-friendly buttons

---

## 🧪 Testing Guide

### 1. Admin User Creation
```bash
# Restart backend
npm run start:dev

# Check console output:
✅ Admin user created: admin@tedxmosul.com / admin123
# or
✅ Admin user already exists
```

### 2. Admin Login
1. Login with admin credentials
2. Check navbar for "👑 Admin Panel" button
3. Verify button only visible when logged in as admin

### 3. Events Management
1. Go to `/admin/events`
2. Create a test event
3. Verify it appears in table
4. Edit the event
5. Delete the event

### 4. Role Management
1. Create a regular user via `/register`
2. Login as admin
3. Go to `/admin/users`
4. Find the new user
5. Change their role to Staff
6. Logout and login as that user
7. Verify "Check-in" link appears in navbar

### 5. Bookings Check-in
1. Create a booking as regular user
2. Login as admin (or staff)
3. Go to `/admin/bookings` (admin) or `/checkin` (staff)
4. Check-in the booking
5. Verify status changes to "Checked In"

---

## 🐛 Troubleshooting

### Issue: Admin user not created
**Solution:** Restart backend. Check database connection. Verify seed service is running.

### Issue: "Admin Panel" button not showing
**Solution:** Check user role in JWT token. Logout and login again. Clear localStorage.

### Issue: 403 Forbidden on admin endpoints
**Solution:** Verify JWT token is valid. Check user role is 'admin'. Backend guards may be misconfigured.

### Issue: Modal not closing
**Solution:** Click outside modal or press X button. Check console for errors.

### Issue: Table not loading
**Solution:** Check API endpoints are running. Verify CORS is enabled. Check browser console for errors.

---

## 📦 Files Created/Modified

### Backend Files Created:
- ✅ `backend/src/auth/role.enum.ts`

### Backend Files Modified:
- ✅ `backend/src/database/seed.service.ts`
- ✅ `backend/src/users/users.controller.ts`
- ✅ `backend/src/users/users.service.ts`
- ✅ `backend/src/events/events.controller.ts`
- ✅ `backend/src/speakers/speakers.controller.ts`
- ✅ `backend/src/bookings/bookings.controller.ts`

### Frontend Files Created:
- ✅ `frontend/src/pages/admin/AdminDashboard.tsx`
- ✅ `frontend/src/pages/admin/AdminDashboard.css`
- ✅ `frontend/src/pages/admin/AdminHome.tsx`
- ✅ `frontend/src/pages/admin/AdminEvents.tsx`
- ✅ `frontend/src/pages/admin/AdminSpeakers.tsx`
- ✅ `frontend/src/pages/admin/AdminBookings.tsx`
- ✅ `frontend/src/pages/admin/AdminUsers.tsx`

### Frontend Files Modified:
- ✅ `frontend/src/components/Navbar.tsx`
- ✅ `frontend/src/App.tsx`

---

## 🎯 Next Steps & Enhancements

### Potential Improvements:
1. **Analytics Dashboard:**
   - Revenue tracking
   - Popular events
   - User growth charts
   - Booking trends

2. **Email Notifications:**
   - Booking confirmations
   - Event reminders
   - Role change notifications

3. **Export Features:**
   - Export bookings to CSV
   - Generate event reports
   - Attendee lists

4. **Bulk Operations:**
   - Bulk check-in
   - Bulk email
   - Mass role updates

5. **Advanced Filters:**
   - Date range filters
   - Search functionality
   - Sort by columns

6. **Activity Logs:**
   - Track admin actions
   - Audit trail
   - Change history

---

## ✅ Summary

The TEDxMosul Admin System is now fully operational with:

✅ **Role-Based Access Control** (Admin, Staff, User)  
✅ **Auto-Created Admin Account** (admin@tedxmosul.com)  
✅ **Full CRUD for Events** (Create, Read, Update, Delete)  
✅ **Full CRUD for Speakers** (with event assignment)  
✅ **Bookings Management** (View, Filter, Check-in)  
✅ **Users Management** (View, Change Roles)  
✅ **Professional Admin UI** (Sidebar, Tables, Modals, Forms)  
✅ **Type-Safe Backend** (Role enum, Guards)  
✅ **Protected Routes** (Frontend & Backend)  
✅ **Toast Notifications** (Success/Error feedback)  
✅ **Responsive Design** (Mobile-friendly)  
✅ **TEDx Branding** (Red/Black/White theme)  

**All requirements from the specification have been implemented successfully!** 🎉

---

## 📞 Support

For issues or questions:
1. Check console logs (browser & backend)
2. Verify database connection
3. Clear browser cache/localStorage
4. Restart backend service
5. Check API endpoint responses in Network tab

---

**Happy Administrating! 🚀**
