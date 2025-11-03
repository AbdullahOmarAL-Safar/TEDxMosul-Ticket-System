# 🚀 Quick Start - Admin Approval System Testing

## Prerequisites
- PostgreSQL running
- Node.js 18+ and npm installed
- Backend `.env` configured

---

## 🎬 Step 1: Start Backend

```powershell
cd "c:\Users\Abody\Desktop\TEDxMosul Tickets System\backend"
npm run start:dev
```

**Expected Output:**
- TypeORM will auto-create the `ticket_code` column in the `bookings` table
- Server starts on `http://localhost:3001`

---

## 🎨 Step 2: Start Frontend

```powershell
cd "c:\Users\Abody\Desktop\TEDxMosul Tickets System\frontend"
npm start
```

**Expected Output:**
- Frontend starts on `http://localhost:3000`
- Browser opens automatically

---

## ✅ Step 3: Test User Booking Flow

### 3.1 Register/Login as User
1. Navigate to `http://localhost:3000/register`
2. Create a new user account (role will be "user" by default)
3. Login with credentials

### 3.2 Book Event Seats
1. Go to Homepage → Click on any event
2. Click "Book Seats"
3. Select 1-9 seats on the interactive seat map
4. Click "Confirm Booking"
5. **✅ Expected:** Alert message says:
   > "✅ Booking request submitted!  
   > Your booking is awaiting admin approval..."

### 3.3 View "My Tickets"
1. Navigate to `/my-tickets`
2. **✅ Expected:** Booking card shows:
   - Yellow background with ⏳ icon
   - Status badge: "Pending" (yellow)
   - Message: "Pending Admin Approval"
   - NO QR code visible
   - "Cancel Booking" button available

---

## 👑 Step 4: Test Admin Approval

### 4.1 Login as Admin
1. Logout from user account
2. Login with admin credentials:
   - Email: `admin@tedxmosul.com`
   - Password: `admin123`

### 4.2 Navigate to Admin Panel
1. Click "Admin Panel" in navbar
2. Go to "📋 Bookings Overview"

### 4.3 Approve Booking
1. **✅ Expected:** See the pending booking with:
   - Status badge: "Pending" (yellow)
   - Actions: **✓ Approve** and **✗ Reject** buttons
2. Click **"✓ Approve"**
3. Confirm the dialog
4. **✅ Expected:**
   - Success message: "Booking approved! QR code generated."
   - Status changes to "Approved" (green)
   - Actions change to: **✓ Check In** button
   - Ticket code generated (e.g., `TEDX-ABC123`)

---

## 🎫 Step 5: Verify User Ticket

### 5.1 Switch Back to User Account
1. Logout from admin
2. Login with user credentials

### 5.2 Check "My Tickets"
1. Navigate to `/my-tickets`
2. **✅ Expected:** Booking card now shows:
   - Green background with ✓ icon
   - Status badge: "Approved" (green)
   - Message: "✓ Approved - Scan QR Code at Event"
   - **QR code is NOW VISIBLE** ✅
   - Ticket code displayed: `TEDX-ABC123`
   - Green "📥 Download Ticket as PDF" button

### 5.3 Download PDF Ticket
1. Click "📥 Download Ticket as PDF"
2. **✅ Expected:**
   - PDF downloads with QR code
   - Ticket shows booking details and QR code

---

## 📱 Step 6: Test Check-In

### 6.1 Login as Admin/Staff
1. Use admin account or create a staff account

### 6.2 Navigate to Check-In Page
1. Go to `/checkin`

### 6.3 Test QR Scanner
1. Click "📷 Start QR Scanner"
2. Hold the QR code from the PDF in front of camera
3. **✅ Expected:**
   - Scanner recognizes `TEDX-ABC123` ticket code
   - Booking details displayed
   - Status changes to "Checked In"
   - Success message: "✅ Check-in successful!"

### 6.4 Test Manual Check-In
1. Enter ticket code: `TEDX-ABC123`
2. Click "Check In"
3. **✅ Expected:** Same result as QR scanner

---

## 🚫 Step 7: Test Rejection Flow

### 7.1 Create Another Booking (as User)
1. Login as user
2. Book seats for another event
3. Verify it shows as "Pending"

### 7.2 Reject Booking (as Admin)
1. Login as admin
2. Go to "Bookings Overview"
3. Find the pending booking
4. Click **"✗ Reject"**
5. Confirm the dialog
6. **✅ Expected:**
   - Success message: "Booking rejected. Seats restored."
   - Status changes to "Rejected" (red)
   - Seats are restored to event capacity

### 7.3 Verify User View
1. Logout and login as user
2. Go to "My Tickets"
3. **✅ Expected:**
   - Red card with ❌ icon
   - Status badge: "Rejected" (red)
   - Message: "Booking Request Not Approved"
   - NO QR code
   - No actions available

---

## 🎯 Step 8: Test Edge Cases

### 8.1 Try Check-In with Pending Booking
1. As admin, try to check-in a pending booking (use booking ID)
2. **✅ Expected:** Error: "Booking is pending admin approval"

### 8.2 Try Check-In with Rejected Booking
1. Try to check-in a rejected booking
2. **✅ Expected:** Error: "Booking was rejected"

### 8.3 Try Approving When Event is Full
1. Create a booking for an event with 0 available seats
2. Try to approve it
3. **✅ Expected:** Error: "Not enough available seats to approve this booking"

### 8.4 Cancel Pending Booking
1. As user, cancel a pending booking
2. **✅ Expected:**
   - Booking deleted
   - No seats restored (since they were never decremented)

### 8.5 Cancel Approved Booking
1. As user, cancel an approved booking
2. **✅ Expected:**
   - Booking deleted
   - Seats restored to event

---

## 📊 Step 9: Verify Dashboard Stats

### 9.1 Check Admin Dashboard
1. Login as admin
2. Go to `/admin` (Admin Home)
3. **✅ Expected Stats Cards:**
   - "Total Bookings" - all bookings count
   - "Pending Approval" - count with ⏳ icon
   - "Approved" - approved bookings count
   - "Total Users"
   - "Total Speakers"

### 9.2 Test "Review Now" Link
1. If pending bookings exist, click "Review Now →"
2. **✅ Expected:** Redirects to Bookings Overview page

---

## 🎨 Step 10: Test UI States

### Booking Status Colors
| Status | Color | Card Style |
|--------|-------|------------|
| Pending | Yellow (#ffc107) | Yellow gradient, dashed border |
| Approved | Green (#28a745) | Green gradient, solid border |
| Rejected | Red (#dc3545) | Red gradient, solid border |
| Checked In | Blue (#0066cc) | Blue badge |

### Filter Dropdown (Admin Bookings)
1. Test filtering by:
   - All Status
   - Pending
   - Approved
   - Rejected
   - Checked In
   - Cancelled

---

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Check PostgreSQL is running
# Verify .env configuration
cd backend
npm install
npm run start:dev
```

### TypeORM migration issues
```powershell
# Drop and recreate database (DEVELOPMENT ONLY!)
# In PostgreSQL:
DROP DATABASE tedxmosul_tickets;
CREATE DATABASE tedxmosul_tickets;

# Restart backend - TypeORM will recreate tables
```

### Frontend compilation errors
```powershell
cd frontend
npm install
npm start
```

### QR Scanner not working
- Grant camera permissions in browser
- Use HTTPS or localhost (camera requires secure context)
- Test with manual booking ID entry instead

---

## ✅ Success Criteria

All tests passed if:
- [x] User bookings create with "pending" status
- [x] No QR code visible for pending bookings
- [x] Admin can approve → ticket code generated
- [x] Admin can reject → seats restored
- [x] Approved bookings show QR code
- [x] Rejected bookings show error message
- [x] Check-in works with ticket codes
- [x] Check-in rejects pending bookings
- [x] Dashboard shows pending count
- [x] Seats only decremented on approval
- [x] Cancel logic handles pending vs approved correctly

---

## 📝 Test Report Template

```
Date: ___________
Tester: ___________

✅ User Booking Flow: [ PASS / FAIL ]
✅ Admin Approval: [ PASS / FAIL ]
✅ QR Code Display: [ PASS / FAIL ]
✅ Check-In: [ PASS / FAIL ]
✅ Rejection Flow: [ PASS / FAIL ]
✅ Edge Cases: [ PASS / FAIL ]
✅ Dashboard Stats: [ PASS / FAIL ]

Issues Found:
_________________________________
_________________________________
```

---

**Happy Testing! 🎉**

If you encounter any issues, check:
1. `ADMIN_APPROVAL_SYSTEM.md` - Full implementation guide
2. Browser Console (F12) - Frontend errors
3. Backend Terminal - API errors
4. PostgreSQL logs - Database issues

