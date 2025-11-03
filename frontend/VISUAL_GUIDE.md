# Visual Preview Guide - TEDxMosul UI Redesign

## 🎨 Quick Visual Tour

### 1. **Homepage**
```
┌─────────────────────────────────────────────────────────┐
│  [Fixed Navbar - Semi-transparent with blur]            │
│  TEDx Mosul Tickets    Home Speakers My Tickets [Logout]│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                                                          │
│              [Full-Width Hero Image]                     │
│                                                          │
│          ████████████████████████████████                │
│          ████   TEDxMosul   █████████████                │
│          ████ Ideas Worth Spreading █████                │
│          ████████████████████████████████                │
│                                                          │
└─────────────────────────────────────────────────────────┘

        Upcoming Events
        Discover inspiring talks and groundbreaking ideas

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ [Event Img] │  │ [Event Img] │  │ [Event Img] │
│             │  │             │  │             │
│ Event Title │  │ Event Title │  │ Event Title │
│ 📅 Date     │  │ 📅 Date     │  │ 📅 Date     │
│ 📍 Location │  │ 📍 Location │  │ 📍 Location │
│ 🎫 Seats    │  │ 🎫 Seats    │  │ 🎫 Seats    │
│             │  │             │  │             │
│[View Details]│  │[View Details]│  │[View Details]│
└─────────────┘  └─────────────┘  └─────────────┘
```

### 2. **Event Details Page**
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│              [Full Hero with Gradient Overlay]           │
│                                                          │
│               Event Title in Large Bold                  │
│            Wednesday, January 15, 2025 • Location        │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────┐  ┌──────────────────────┐
│ About This Event             │  │ [Sticky Booking Card]│
│                              │  │                      │
│ Long detailed description... │  │  Book Your Ticket    │
│ ...                          │  │                      │
│                              │  │  Availability        │
│ Featured Speakers            │  │  50/100 ██████░░░░   │
│                              │  │                      │
│ ┌─────────────────────────┐  │  │  ⚡ Only 50 left!   │
│ │ [Profile] Speaker Name  │  │  │                      │
│ │          Bio text...    │  │  │ [🎫 Book Your Seat] │
│ └─────────────────────────┘  │  │                      │
└──────────────────────────────┘  └──────────────────────┘
```

### 3. **My Tickets Page**
```
        My Tickets
        Manage your event bookings and check-in status

┌──────────────────────────────┐  ┌──────────────────────┐
│ [Event Image]    [confirmed] │  │ [Event Image] [✓]    │
│                              │  │                      │
│ Event Title                  │  │ Event Title          │
│                              │  │                      │
│ 📅 Date: Jan 15, 2025       │  │ 📅 Date: Jan 20      │
│ 📍 Location: Conference Hall │  │ 📍 Location: Hall B  │
│ 🎫 Booking ID: #123         │  │ 🎫 Booking ID: #124  │
│                              │  │ ✓ Checked-in: 2pm    │
│ ────────────────────────────│  │                      │
│ [Mark Cancelled] [Delete]    │  │                      │
└──────────────────────────────┘  └──────────────────────┘
```

### 4. **Login Page**
```
        ┌────────────────────────────┐
        │                            │
        │    Welcome Back            │
        │    Sign in to your account │
        │                            │
        │    Email Address           │
        │    [you@example.com      ] │
        │                            │
        │    Password                │
        │    [******************** ] │
        │                            │
        │    [Sign In →]             │
        │                            │
        │    Don't have an account?  │
        │    Create one              │
        │                            │
        └────────────────────────────┘
```

### 5. **Speakers Page**
```
        Our Speakers
        Meet the inspiring voices sharing their ideas

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   ┌─────┐   │  │   ┌─────┐   │  │   ┌─────┐   │
│   │ ● ● │   │  │   │ ● ● │   │  │   │ ● ● │   │
│   │  ▼  │   │  │   │  ▼  │   │  │   │  ▼  │   │
│   └─────┘   │  │   └─────┘   │  │   └─────┘   │
│             │  │             │  │             │
│ Speaker Name│  │ Speaker Name│  │ Speaker Name│
│             │  │             │  │             │
│ Bio text... │  │ Bio text... │  │ Bio text... │
└─────────────┘  └─────────────┘  └─────────────┘
```

## 🎯 Key Visual Elements

### Color Usage
- **TEDx Red (#e62b1e)**: CTAs, badges, accents, active states
- **Black**: Headings, important text
- **White**: Backgrounds, cards
- **Gray Scale**: Supporting text, borders, subtle backgrounds

### Typography Hierarchy
```
H1 (3rem/48px)   - Page titles, hero text
H2 (2.25rem/36px) - Section headings
H3 (1.875rem/30px) - Card titles
H4 (1.5rem/24px)  - Subsections
Body (1rem/16px)  - Paragraph text
Small (0.875rem/14px) - Helper text, labels
```

### Spacing System
```
Tiny:   8px   (gap-1, mt-1, mb-1)
Small:  16px  (gap-2, mt-2, mb-2)
Medium: 24px  (gap-3, mt-3, mb-3)
Large:  32px  (gap-4, mt-4, mb-4)
XL:     48px  (gap-5, mt-5, mb-5)
XXL:    64px  (gap-6, mt-6, mb-6)
```

### Shadow Levels
```
sm:   Subtle elevation (inputs)
md:   Medium elevation (nav on scroll)
lg:   High elevation (cards on hover)
xl:   Very high elevation (modals)
2xl:  Maximum elevation (dropdowns)
```

### Border Radius
```
sm:   8px   - Small elements, inputs
md:   12px  - Buttons, small cards
lg:   16px  - Cards, containers
xl:   24px  - Large sections, hero
full: 9999px - Pills, badges, avatars
```

## 🎬 Animations & Interactions

### Hover Effects
- **Buttons**: Darker shade + slight lift (translateY(-1px))
- **Cards**: Shadow increase + lift (translateY(-4px))
- **Links**: Color change to darker red

### Loading States
- **Spinner**: Rotating circle with red accent
- **Buttons**: Text changes to "Loading..." with disabled state
- **Pages**: Centered spinner with padding

### Transitions
- **Fast (0.15s)**: Hover effects, focus states
- **Normal (0.3s)**: Color changes, transforms
- **Slow (0.5s)**: Large animations, page transitions

### Entrance Animations
- **fade-in**: Opacity 0→1 + translateY(20px→0)
- **slide-in**: translateX(-100%→0) + opacity 0→1

## 📱 Responsive Behavior

### Desktop (> 1024px)
- 3-column grid for events/speakers
- 2-column grid for tickets
- Full navbar with all links visible
- Large hero sections (500px height)
- Sticky booking card on event details

### Tablet (768px - 1024px)
- 2-column grid for events
- 2-column grid for speakers
- 2-column grid for tickets
- Condensed navbar spacing
- Medium hero sections (450px height)

### Mobile (< 768px)
- 1-column grid for all layouts
- Compact navbar (64px height)
- Smaller hero sections (400px height)
- Reduced font sizes
- Vertical button layouts
- No sticky positioning

## 🌈 Status Indicators

### Badges
```
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│✅Success│  │⚠️Warning│  │❌ Danger │  │ℹ️ Info  │
└─────────┘  └─────────┘  └─────────┘  └─────────┘
 Green bg     Yellow bg     Red bg      Blue bg
```

### Alerts
```
┌──────────────────────────────────────┐
│ ✅ Success message here              │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ❌ Error message here                │
└──────────────────────────────────────┘
```

## 🎨 Component Variations

### Buttons
```
[Primary]  [Secondary]  [Outline]  [Ghost]
  Red        Black      Red Border  Gray

[Small]  [Regular]  [Large]
  sm       md         lg
```

### Cards
```
Basic Card:
┌─────────────────┐
│ [Card Content]  │
└─────────────────┘

With Image:
┌─────────────────┐
│ [Image]         │
│─────────────────│
│ [Card Content]  │
└─────────────────┘

Form Card:
┌─────────────────┐
│     Title       │
│   Subtitle      │
│─────────────────│
│ [Form Fields]   │
└─────────────────┘
```

## 💡 Pro Tips for Visual Consistency

1. **Always use design tokens** (CSS variables) instead of hardcoded values
2. **Maintain spacing hierarchy** with predefined gaps
3. **Use shadow levels appropriately** for visual hierarchy
4. **Keep color usage consistent** (red for primary actions)
5. **Apply hover effects** to all interactive elements
6. **Use loading states** to provide feedback
7. **Add animations** for smooth transitions
8. **Test on mobile** for responsive behavior

---

**Design Philosophy**: Minimalist, Bold, Inspiring, Professional
**Inspiration**: Apple, Stripe, TED.com
**Brand Colors**: TEDx Red, Black, White
