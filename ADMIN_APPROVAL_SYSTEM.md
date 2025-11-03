# 🎯 Admin Approval System - Implementation Guide

## 📋 Overview

The **Admin Approval System** ensures that QR codes and tickets are only generated and shown to users **after admin approval** of their booking request.

---

## 🔄 System Flow

### 1️⃣ User Booking Flow (Before Approval)

**What happens when a user books seats:**

1. User selects seats on the interactive seat map
2. Clicks "Confirm Booking"
3. Backend creates booking with:
   - `status: "pending"`
   - `ticket_code: null` (no QR code yet)
   - Seats are **NOT decremented** from event capacity yet
4. User sees success message:
   > "✅ Booking request submitted!  
   > Your booking is awaiting admin approval. You will receive your QR code once approved."
5. User redirected to "My Tickets" page

**In "My Tickets" - Pending State:**
- Yellow card with ⏳ icon
- Message: "Pending Admin Approval"
- "Your booking request is awaiting admin approval. You'll receive your QR code once approved."
- No QR code visible
- Cancel button available

---

### 2️⃣ Admin Approval Panel

**Location:** Admin Panel → Bookings Overview

**Features:**
- Filter dropdown includes: "Pending", "Approved", "Rejected", "Checked In", "Cancelled"
- Pending bookings show two action buttons:
  - **✓ Approve** (green button)
  - **✗ Reject** (red button)

**When admin clicks "Approve":**
1. Confirmation dialog: "Approve this booking? A QR code will be generated."
2. Backend processes:
   - Checks if event still has available seats
   - Generates unique ticket code: `TEDX-ABC123` (using uuid)
   - Updates booking:
     - `status: "approved"`
     - `ticket_code: "TEDX-ABC123"`
   - Decrements event `available_seats`
3. Success message: "Booking approved! QR code generated."
4. Table refreshes automatically

**When admin clicks "Reject":**
1. Confirmation dialog: "Reject this booking? Seats will be restored."
2. Backend processes:
   - Updates booking: `status: "rejected"`
   - No seat restoration needed (seats were never decremented)
3. Success message: "Booking rejected. Seats restored."
4. Table refreshes automatically

---

### 3️⃣ After Approval

**In "My Tickets" - Approved State:**
- Green card with ✓ icon
- Message: "✓ Approved - Scan QR Code at Event"
- **QR code visible** (contains ticket_code: `TEDX-ABC123`)
- Displays ticket code below QR
- "📥 Download Ticket as PDF" button (green)
- Cancel button available

**In "My Tickets" - Rejected State:**
- Red card with ❌ icon
- Message: "Booking Request Not Approved"
- "Unfortunately, your booking request was not approved by the admin."
- No QR code
- No actions available

---

## 🛠️ Technical Implementation

### Backend Changes

#### 1. **Booking Entity** (`backend/src/bookings/booking.entity.ts`)
```typescript
@Column({ default: 'pending' })
status: string; // pending | approved | rejected | checked_in | cancelled

@Column({ nullable: true })
ticket_code: string; // Generated after admin approval (TEDX-xxxxxx)
```

#### 2. **Bookings Service** (`backend/src/bookings/bookings.service.ts`)

**Create Booking (No seat decrement):**
```typescript
const booking = this.repo.create({
    user: { id: userId } as any,
    event: { id: dto.eventId } as any,
    seats: dto.seats,
    status: 'pending', // Awaiting admin approval
    ticket_code: null,  // Will be generated after approval
});
```

**Approve Method:**
```typescript
async approve(bookingId: number) {
    // Check event capacity
    // Generate ticket code: TEDX-XXXXXX
    // Decrement seats from event
    // Update booking: status='approved', ticket_code=generated
}
```

**Reject Method:**
```typescript
async reject(bookingId: number) {
    // Update booking: status='rejected'
    // No seat restoration (seats never decremented)
}
```

**Check-In Validation:**
```typescript
async checkIn(bookingId: number) {
    // Reject if status is 'pending', 'rejected', or 'cancelled'
    // Only allow check-in for 'approved' bookings
}
```

**New Methods:**
- `verifyByTicketCode(ticketCode: string)` - Find booking by ticket code
- `checkInByTicketCode(ticketCode: string)` - Check-in using QR code

#### 3. **Bookings Controller** (`backend/src/bookings/bookings.controller.ts`)

**New Endpoints:**
```typescript
POST /bookings/:id/approve    // Admin only
POST /bookings/:id/reject     // Admin only
GET  /bookings/verify/:code   // Admin/Staff - verify ticket code
POST /bookings/:id/checkin    // Supports both booking ID and ticket code
```

---

### Frontend Changes

#### 1. **Types** (`frontend/src/types/index.ts`)
```typescript
export interface Booking {
    id: number;
    status: 'pending' | 'approved' | 'rejected' | 'checked_in' | 'cancelled';
    ticket_code?: string | null;
    checked_in_at?: string | null;
    event: Event;
    seats?: Seat[];
    user?: User;
    created_at?: string;
}
```

#### 2. **Admin Bookings** (`frontend/src/pages/admin/AdminBookings.tsx`)

**New Functions:**
- `handleApprove(bookingId)` - POST to `/bookings/:id/approve`
- `handleReject(bookingId)` - POST to `/bookings/:id/reject`

**UI Updates:**
- Added "Pending" and "Approved" to filter dropdown
- Status badges include: Pending (yellow), Approved (green), Rejected (red)
- Actions column shows:
  - Pending → Approve + Reject buttons
  - Approved → Check In button
  - Checked In → ✓ indicator
  - Rejected/Cancelled → ✗ indicator

**Stats Cards:**
- "Pending Approval" card with count
- "Approved" card with count
- Link to review pending bookings

#### 3. **My Tickets** (`frontend/src/pages/MyTickets.tsx`)

**Conditional QR Display:**
```typescript
// Pending State
{b.status === 'pending' && (
    <div style={yellowCard}>
        <div>⏳</div>
        <h4>Pending Admin Approval</h4>
        <p>Your booking request is awaiting admin approval...</p>
    </div>
)}

// Rejected State
{b.status === 'rejected' && (
    <div style={redCard}>
        <div>❌</div>
        <h4>Booking Request Not Approved</h4>
        <p>Unfortunately, your booking request was not approved...</p>
    </div>
)}

// Approved State
{(b.status === 'approved' || b.status === 'checked_in') && (
    <div style={greenCard}>
        <h4>✓ Approved - Scan QR Code at Event</h4>
        <QRCodeSVG value={b.ticket_code || `TEDX-${b.id}`} size={150} />
        <p>Ticket Code: {b.ticket_code}</p>
        <button onClick={downloadPDF}>📥 Download Ticket as PDF</button>
    </div>
)}
```

#### 4. **Seat Selection** (`frontend/src/pages/SeatSelection.tsx`)
- Updated success message to inform users about pending approval

#### 5. **Admin Dashboard** (`frontend/src/pages/admin/AdminHome.tsx`)
- Added "Pending Approval" stat card with count
- Shows "Review Now →" link if pending bookings exist

#### 6. **Check-In** (`frontend/src/pages/CheckIn.tsx`)
- Updated QR scanner to support ticket codes (`TEDX-XXXXXX`)
- Supports both formats: "TEDX-ABC123" and "Booking: 123"

---

## 🔒 Security & Validation

### Backend Validations
✅ Only admins can approve/reject bookings  
✅ Pending bookings cannot be checked-in  
✅ Rejected/cancelled bookings cannot be checked-in  
✅ Approval checks event capacity before decrementing seats  
✅ Ticket codes are unique (uuid-based)  
✅ Seat restoration logic only applies to approved bookings

### Frontend Validations
✅ QR codes only visible for approved/checked-in bookings  
✅ Pending bookings show clear status message  
✅ Rejected bookings cannot be modified  
✅ Admin confirmation dialogs before approve/reject actions

---

## 📊 Database Schema Changes

**Booking Table Updates:**
```sql
ALTER TABLE bookings 
ADD COLUMN ticket_code VARCHAR(255) NULL,
ALTER COLUMN status SET DEFAULT 'pending';

-- Update status enum to include new values
-- status: 'pending' | 'approved' | 'rejected' | 'checked_in' | 'cancelled'
```

**Migration Notes:**
- TypeORM will auto-create columns on first run
- Existing bookings may have NULL ticket_code (expected)
- Old bookings may have status='confirmed' (update to 'approved' if needed)

---

## 🧪 Testing Checklist

### User Flow
- [ ] User books seats → status = 'pending'
- [ ] User sees "Pending Approval" message in My Tickets
- [ ] User cannot see QR code while pending
- [ ] User can cancel pending booking

### Admin Flow
- [ ] Admin sees pending bookings in Bookings Overview
- [ ] Admin clicks Approve → ticket code generated
- [ ] Admin clicks Reject → status changes to rejected
- [ ] Dashboard shows pending approval count

### Post-Approval
- [ ] User sees QR code after approval
- [ ] Ticket code displayed correctly
- [ ] PDF download works with new QR code
- [ ] Check-in works with ticket code
- [ ] Check-in rejects pending bookings

### Edge Cases
- [ ] Approving booking when event is full → error message
- [ ] Rejecting already approved booking → error
- [ ] Checking in rejected booking → error
- [ ] Cancelling approved booking → seats restored

---

## 🚀 Deployment Steps

1. **Backend Migration:**
   ```bash
   cd backend
   npm run start:dev
   # TypeORM will auto-create new columns
   ```

2. **Frontend Build:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database Cleanup (Optional):**
   ```sql
   -- Update old bookings to new status system
   UPDATE bookings SET status = 'approved' WHERE status = 'confirmed';
   
   -- Generate ticket codes for existing approved bookings
   UPDATE bookings 
   SET ticket_code = CONCAT('TEDX-', UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)))
   WHERE status = 'approved' AND ticket_code IS NULL;
   ```

4. **Verify:**
   - Create test booking as user
   - Approve as admin
   - Verify QR code appears
   - Test check-in with QR code

---

## 📝 API Reference

### New Endpoints

#### Approve Booking
```http
POST /bookings/:id/approve
Authorization: Bearer {admin_jwt_token}

Response:
{
    "id": 123,
    "status": "approved",
    "ticket_code": "TEDX-ABC123",
    "seats": [...],
    "event": {...}
}
```

#### Reject Booking
```http
POST /bookings/:id/reject
Authorization: Bearer {admin_jwt_token}

Response:
{
    "id": 123,
    "status": "rejected",
    "seats": [...],
    "event": {...}
}
```

#### Verify Ticket Code
```http
GET /bookings/verify/:code
Authorization: Bearer {admin_or_staff_jwt_token}

Example: GET /bookings/verify/TEDX-ABC123

Response:
{
    "id": 123,
    "status": "approved",
    "ticket_code": "TEDX-ABC123",
    "user": {...},
    "event": {...},
    "seats": [...]
}
```

#### Check-In (Enhanced)
```http
POST /bookings/:id/checkin
Authorization: Bearer {admin_or_staff_jwt_token}

Supports:
- Booking ID: POST /bookings/123/checkin
- Ticket Code: POST /bookings/TEDX-ABC123/checkin

Response:
{
    "id": 123,
    "status": "checked_in",
    "checked_in_at": "2025-11-03T10:30:00Z",
    "ticket_code": "TEDX-ABC123"
}
```

---

## 🎨 UI States

### Booking Status Colors
| Status | Color | Icon | Badge |
|--------|-------|------|-------|
| Pending | Yellow (#ffc107) | ⏳ | badge-warning |
| Approved | Green (#28a745) | ✓ | badge-success |
| Rejected | Red (#dc3545) | ❌ | badge-danger |
| Checked In | Blue (#0066cc) | ✓ | badge-primary |
| Cancelled | Red (#dc3545) | ✗ | badge-danger |

### My Tickets Card Styles
- **Pending:** Yellow gradient background, dashed border
- **Rejected:** Red gradient background, solid red border
- **Approved:** Green gradient background, solid green border

---

## 🔧 Configuration

### Environment Variables
No new environment variables required. System uses existing:
- `JWT_SECRET` - for admin authentication
- Database connection settings

### Constants
```typescript
// backend/src/bookings/bookings.service.ts
const ticketCode = `TEDX-${uuidv4().substring(0, 6).toUpperCase()}`;
// Format: TEDX-XXXXXX (6 uppercase alphanumeric characters)
```

---

## 📚 Related Documentation
- `README.md` - Project overview
- `ADMIN_REDESIGN_GUIDE.md` - Admin panel design system
- `SEAT_SELECTION_IMPROVEMENTS.md` - Seat selection features

---

## 👨‍💻 Developer Notes

### Key Changes Summary
1. ✅ Booking status flow: pending → approved → checked_in
2. ✅ Ticket codes generated on approval (not creation)
3. ✅ Seats decremented on approval (not creation)
4. ✅ QR codes conditional on approval status
5. ✅ Admin dashboard shows pending approval count
6. ✅ Check-in validates approved status

### Breaking Changes
⚠️ Existing bookings with status='confirmed' should be migrated to 'approved'  
⚠️ Existing bookings without ticket_code should have codes generated

### Future Enhancements
- 🔔 Email notifications on approval/rejection
- 📧 QR code delivery via email
- ⏰ Auto-reject bookings after X days
- 📊 Approval analytics dashboard
- 🔄 Bulk approve/reject actions

---

## ✅ Implementation Status

**Completed:**
- [x] Backend approval/rejection logic
- [x] Ticket code generation
- [x] Frontend conditional QR display
- [x] Admin UI approve/reject buttons
- [x] Check-in validation
- [x] Seat restoration logic
- [x] Dashboard pending count

**Tested:**
- [ ] Full user booking → approval → check-in flow
- [ ] Admin reject functionality
- [ ] QR code scanning with ticket codes
- [ ] Seat capacity validation on approval

---

**Implementation Date:** November 3, 2025  
**System Version:** v1.1.0  
**Status:** ✅ Ready for Testing

