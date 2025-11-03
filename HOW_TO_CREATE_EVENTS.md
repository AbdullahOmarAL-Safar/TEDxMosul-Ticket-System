# 🎫 TEDxMosul Tickets System - Complete Guide

## How to Create an Event and Sell Tickets

### Step 1: Login as Admin
1. Go to http://localhost:3000
2. Click **Login**
3. Use admin credentials:
   - **Email:** admin@tedxmosul.com
   - **Password:** admin123

### Step 2: Create a New Event
1. After logging in as admin, you'll see a **"+ Create Event"** button in the navigation bar
2. Click on it to go to `/admin/events/create`
3. Fill in the event details:
   - **Event Title:** e.g., "Innovation in Technology"
   - **Description:** Detailed description of the event
   - **Date & Time:** Select when the event will happen
   - **Location:** e.g., "Mosul University Auditorium"
   - **Image URL:** (Optional) Paste an image URL from Unsplash or other sources
   - **Capacity:** Number of total seats (e.g., 150)
4. Click **Create Event**
5. The event will be created and appear on the home page!

### Step 3: Users Book Tickets
1. **Regular users** visit the home page
2. They can see all available events
3. Click on any event to see details
4. Click **"Book Tickets"**
5. Select their seats on the interactive seat map
6. Confirm the booking
7. The ticket is saved to their account

### Step 4: View My Tickets
1. Users can click **"My Tickets"** in the navigation
2. They will see all their booked tickets with:
   - Event details
   - Seat numbers
   - QR codes for check-in
   - Cancel or update options

### Step 5: Check-in at Event
1. Staff or Admin can use the **Check-in** page
2. Scan the QR code from the user's ticket
3. The system marks the ticket as checked-in

---

## 📋 Complete Workflow

```
ADMIN:
1. Login as admin → 2. Create Event → 3. Event appears on homepage

USER:
1. Browse events → 2. Click event → 3. Book tickets → 4. Select seats → 5. Confirm

USER (Day of Event):
1. Go to "My Tickets" → 2. Show QR code → 3. Staff scans → 4. Check-in complete
```

---

## 🎨 Features Included

✅ **Event Management** (Admin only)
- Create events with title, description, date, location, image, capacity
- Events automatically show on homepage

✅ **Ticket Booking** (Registered users)
- Interactive seat selection
- Real-time seat availability
- QR code generation

✅ **Search & Filter**
- Search events by title, description, or location
- Real-time filtering as you type

✅ **My Tickets**
- View all booked tickets
- QR codes for easy check-in
- Cancel or update bookings

✅ **Check-in System** (Staff/Admin)
- Scan QR codes
- Mark attendees as checked-in

---

## 🔐 User Roles

| Role | Permissions |
|------|------------|
| **Admin** | Create events, check-in, book tickets |
| **Staff** | Check-in attendees |
| **User** | Book tickets, view tickets |

---

## 🚀 Quick Start

1. **Backend:** `cd backend && npm run start:dev` (Port 4000)
2. **Frontend:** `cd frontend && npm start` (Port 3000)
3. **Admin Login:** admin@tedxmosul.com / admin123
4. **Create Event:** Click "+ Create Event" in navbar
5. **Book Ticket:** Browse event → Book → Select seats → Confirm

---

## 📸 Image Sources (for events)

Use these Unsplash URLs for event images:
- `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800`
- `https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800`
- `https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800`
- `https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800`

---

## 🎯 Next Steps

After creating events, you can:
1. Share the event link with users
2. Monitor bookings in the admin panel
3. Use the check-in system on event day
4. View reports and analytics

Happy event organizing! 🎉
