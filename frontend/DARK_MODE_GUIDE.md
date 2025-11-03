# 🌓 Dark Mode Implementation Guide

## Overview
Professional dark/light mode toggle system for TEDxMosul Tickets System with smooth transitions, localStorage persistence, and elegant UI.

---

## 🎯 Features Implemented

✅ **React Context API** for global theme management  
✅ **localStorage persistence** - theme survives page reloads  
✅ **Smooth animations** - 0.3s transitions on all color changes  
✅ **Beautiful toggle button** - Moon/Sun icons with rotation animation  
✅ **Full app coverage** - All components adapt to theme  
✅ **Accessible** - Proper ARIA labels and keyboard navigation  
✅ **TEDx brand-aligned** - Red accent color maintained in both themes  

---

## 📁 Files Modified

### 1. **Created: `src/context/ThemeContext.tsx`**
Theme management with React Context API:
- `ThemeProvider` component wraps the entire app
- `useTheme()` hook for accessing theme state
- Automatic localStorage sync
- Applies theme class to `<html>` element

### 2. **Updated: `src/index.tsx`**
Wrapped `<App />` with `<ThemeProvider>`:
```tsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

### 3. **Updated: `src/components/Navbar.tsx`**
Added theme toggle button in navigation:
- Beautiful moon/sun icon toggle
- Smooth rotation animation on click
- Positioned in nav-links area
- Uses `useTheme()` hook

### 4. **Updated: `src/index.css`**
Comprehensive dark mode styling:
- CSS custom properties for theme colors
- `.dark` class styles
- All components updated (cards, forms, buttons, nav, etc.)
- Smooth transition effects

---

## 🎨 Color Palette

### Light Mode (Default)
```css
--bg-primary: #ffffff       /* Main background */
--bg-secondary: #f9fafb     /* Page background */
--bg-tertiary: #f3f4f6      /* Subtle elements */
--text-primary: #111827     /* Main text */
--text-secondary: #4b5563   /* Secondary text */
--text-tertiary: #6b7280    /* Muted text */
--border-color: #e5e7eb     /* Borders */
--card-bg: #ffffff          /* Card backgrounds */
--card-hover-bg: #f9fafb    /* Card hover state */
```

### Dark Mode
```css
--bg-primary: #121212       /* Main background */
--bg-secondary: #1a1a1a     /* Page background */
--bg-tertiary: #242424      /* Subtle elements */
--text-primary: #f5f5f5     /* Main text */
--text-secondary: #b8b8b8   /* Secondary text */
--text-tertiary: #8a8a8a    /* Muted text */
--border-color: #2a2a2a     /* Borders */
--card-bg: #1e1e1e          /* Card backgrounds */
--card-hover-bg: #242424    /* Card hover state */
```

### Accent (Both Themes)
```css
--ted-red: #e62b1e          /* Primary brand color */
```

---

## 🔧 How It Works

### 1. Theme Context
```tsx
import { useTheme } from '../context/ThemeContext';

const { theme, toggleTheme } = useTheme();
// theme: 'light' | 'dark'
// toggleTheme: () => void
```

### 2. Theme Toggle
When user clicks the toggle button:
1. Theme state changes ('light' ↔ 'dark')
2. `<html>` class updates (`.light` or `.dark`)
3. CSS variables automatically change
4. New theme saved to `localStorage`
5. All components transition smoothly (0.3s)

### 3. Persistence
- Theme stored in: `localStorage.getItem('tedx-theme')`
- Default: `'light'`
- Restored on page load automatically

---

## 💡 Usage Examples

### Using Theme in Components
```tsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div>
      Current theme: {theme}
      {theme === 'dark' && <p>Dark mode is active!</p>}
    </div>
  );
}
```

### Conditional Styling
No need for conditional logic - just use CSS variables:
```css
.my-element {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

These variables automatically update when theme changes!

---

## 🎭 Component Coverage

All components now support dark mode:

### Navigation
- ✅ Navbar background
- ✅ Nav links
- ✅ Brand logo
- ✅ Theme toggle button

### Cards
- ✅ Event cards
- ✅ Speaker cards
- ✅ Ticket cards
- ✅ Hover effects

### Forms
- ✅ Input fields
- ✅ Labels
- ✅ Form cards
- ✅ Focus states

### Typography
- ✅ Headings (h1-h6)
- ✅ Paragraphs
- ✅ Links

### UI Elements
- ✅ Buttons
- ✅ Loading spinners
- ✅ Borders
- ✅ Shadows

---

## 🎯 Customization Guide

### Change Default Theme
In `ThemeContext.tsx`:
```tsx
const [theme, setTheme] = useState<Theme>(() => {
  const savedTheme = localStorage.getItem('tedx-theme') as Theme;
  return savedTheme || 'dark'; // Change to 'dark' for dark default
});
```

### Adjust Colors
In `index.css` `:root` and `.dark` sections:
```css
.dark {
  --bg-primary: #0a0a0a;  /* Darker background */
  --ted-red: #ff5544;     /* Brighter red accent */
}
```

### Add Custom Animations
```css
.dark {
  /* Custom transition timing */
  --transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Style Specific Components
```css
.dark .my-component {
  /* Dark mode specific styles */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}
```

---

## 🚀 Best Practices

### ✅ DO:
- Use CSS variables (`var(--bg-primary)`) for all colors
- Add `transition` properties for smooth changes
- Test both themes when adding new components
- Use semantic variable names (`--text-primary` not `--color-1`)

### ❌ DON'T:
- Hardcode colors (#ffffff, #000000, etc.)
- Use inline styles with fixed colors
- Forget to add transitions
- Override theme colors in component styles

---

## 📱 Responsive Behavior

Theme toggle button adapts to screen size:
- **Desktop**: Full size button with icon
- **Tablet**: Slightly smaller
- **Mobile**: Compact but easily tappable

Toggle position:
- Always visible in navbar
- Positioned between nav links and login/logout
- Consistent across all pages

---

## ♿ Accessibility Features

- ✅ `aria-label="Toggle dark mode"` on button
- ✅ `title` attribute shows next theme state
- ✅ Keyboard accessible (Tab + Enter)
- ✅ High contrast ratios in both themes
- ✅ No color-only differentiation
- ✅ Focus states visible in both themes

---

## 🐛 Troubleshooting

### Theme not persisting?
Check localStorage:
```javascript
localStorage.getItem('tedx-theme') // Should return 'light' or 'dark'
```

### Colors not changing?
1. Verify `<html>` has `.dark` or `.light` class
2. Check CSS variables are used (not hardcoded colors)
3. Ensure `transition` is applied

### Toggle button not visible?
- Check navbar is rendering
- Verify ThemeProvider wraps App
- Check browser console for errors

---

## 🎉 Result

- ✨ Modern, professional dark/light mode system
- 🚀 Smooth animations and transitions
- 💾 Persistent user preference
- 🎨 TEDx brand identity maintained
- 📱 Fully responsive
- ♿ Accessible and keyboard-friendly

---

## 📚 Related Files

- **Theme Context**: `src/context/ThemeContext.tsx`
- **Global Styles**: `src/index.css`
- **Navbar**: `src/components/Navbar.tsx`
- **Entry Point**: `src/index.tsx`

---

**🌟 The dark mode is now live! Users can toggle between light and dark themes with a single click. The preference is saved automatically and applies across all pages instantly.**
