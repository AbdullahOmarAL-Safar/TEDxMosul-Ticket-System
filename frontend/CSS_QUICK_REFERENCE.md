# CSS Classes Quick Reference

## 🎯 Quick Reference Card for TEDxMosul Design System

### 🔘 Buttons

```jsx
<button className="btn">Default</button>
<button className="btn btn-primary">Primary (Red)</button>
<button className="btn btn-secondary">Secondary (Black)</button>
<button className="btn btn-outline">Outline</button>
<button className="btn btn-ghost">Ghost</button>

// Sizes
<button className="btn btn-sm">Small</button>
<button className="btn">Regular</button>
<button className="btn btn-lg">Large</button>

// Full width
<button className="btn btn-primary w-full">Full Width</button>
```

### 🎴 Cards

```jsx
// Basic Card
<div className="card">
  <div className="card-content">
    <h3 className="card-title">Title</h3>
    <p className="card-text">Description...</p>
  </div>
</div>

// Card with Image
<div className="card">
  <img src="..." alt="..." className="card-image" />
  <div className="card-content">
    <h3 className="card-title">Title</h3>
    <p className="card-text">Description...</p>
    <div className="card-footer">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>

// Ticket Card
<div className="ticket-card">
  <div className="ticket-header">
    <img src="..." alt="..." />
  </div>
  <div className="ticket-body">
    <h3 className="ticket-title">Event Title</h3>
    <div className="ticket-info">
      <div className="ticket-info-item">
        <span className="ticket-info-label">Label:</span>
        <span>Value</span>
      </div>
    </div>
    <div className="ticket-actions">
      <button className="btn">Action</button>
    </div>
  </div>
</div>
```

### 📝 Forms

```jsx
<div className="form-card">
  <h2 className="form-title">Form Title</h2>
  <p className="form-subtitle">Subtitle text</p>
  
  <form>
    <div className="form-group">
      <label className="form-label" htmlFor="email">Email</label>
      <input 
        id="email" 
        type="email" 
        className="form-input"
        placeholder="you@example.com"
      />
    </div>
    
    <button className="btn btn-primary btn-lg w-full">Submit</button>
  </form>
  
  <p className="form-footer">
    Footer text with <a href="#">link</a>
  </p>
</div>
```

### 🏷️ Badges

```jsx
<span className="badge">Default</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-danger">Danger</span>
<span className="badge badge-info">Info</span>
<span className="badge badge-primary">Primary</span>
```

### 🚨 Alerts

```jsx
<div className="alert alert-success">
  ✅ Success message here
</div>

<div className="alert alert-error">
  ❌ Error message here
</div>

<div className="alert alert-info">
  ℹ️ Info message here
</div>
```

### 🎨 Layout

```jsx
// Container
<div className="container">
  <div className="section">
    {/* Content with padding */}
  </div>
</div>

// Grid System
<div className="grid grid-2">  {/* 2 columns */}
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<div className="grid grid-3">  {/* 3 columns */}
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>

<div className="grid grid-4">  {/* 4 columns */}
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
  <div>Col 4</div>
</div>
```

### 🦸 Hero Section

```jsx
<div className="hero">
  <img src="..." alt="..." className="hero-image" />
  <div className="hero-overlay" />
  <div className="hero-content">
    <h1 className="hero-title">Big Title</h1>
    <p className="hero-subtitle">Subtitle text</p>
  </div>
</div>
```

### ⏳ Loading

```jsx
<div className="loading">
  <div className="spinner" />
</div>
```

### 📐 Flexbox Utilities

```jsx
<div className="flex">              {/* display: flex */}
<div className="flex-col">          {/* flex-direction: column */}
<div className="items-center">      {/* align-items: center */}
<div className="justify-center">    {/* justify-content: center */}
<div className="justify-between">   {/* justify-content: space-between */}

// Gaps
<div className="flex gap-1">  {/* gap: 8px */}
<div className="flex gap-2">  {/* gap: 16px */}
<div className="flex gap-3">  {/* gap: 24px */}
<div className="flex gap-4">  {/* gap: 32px */}
```

### 📏 Spacing

```jsx
// Margin Top
.mt-0  {/* margin-top: 0 */}
.mt-1  {/* margin-top: 8px */}
.mt-2  {/* margin-top: 16px */}
.mt-3  {/* margin-top: 24px */}
.mt-4  {/* margin-top: 32px */}
.mt-5  {/* margin-top: 48px */}
.mt-6  {/* margin-top: 64px */}

// Margin Bottom (same pattern)
.mb-0 through .mb-6
```

### 📝 Text Alignment

```jsx
<div className="text-center">  {/* text-align: center */}
<div className="text-left">    {/* text-align: left */}
<div className="text-right">   {/* text-align: right */}
```

### 📦 Sizing

```jsx
<div className="w-full">  {/* width: 100% */}
<div className="h-full">  {/* height: 100% */}
```

### 🎭 Visibility

```jsx
<div className="hidden">           {/* display: none */}
<div className="hide-mobile">      {/* hidden on mobile */}
<div className="show-mobile">      {/* visible only on mobile */}
```

### ✨ Animations

```jsx
<div className="fade-in">   {/* Fade in animation */}
<div className="slide-in">  {/* Slide in animation */}
```

## 🎨 Color Variables

```css
/* Use in inline styles */
style={{ color: 'var(--ted-red)' }}
style={{ background: 'var(--gray-100)' }}
style={{ borderColor: 'var(--gray-300)' }}

/* Available Variables */
--ted-red
--ted-red-dark
--ted-red-light
--ted-black
--ted-white

--gray-50   (lightest)
--gray-100
--gray-200
--gray-300
--gray-400
--gray-500
--gray-600
--gray-700
--gray-800
--gray-900  (darkest)

--radius-sm  (8px)
--radius-md  (12px)
--radius-lg  (16px)
--radius-xl  (24px)
--radius-full (9999px)

--shadow-sm
--shadow
--shadow-md
--shadow-lg
--shadow-xl

--transition-fast  (0.15s)
--transition       (0.3s)
--transition-slow  (0.5s)
```

## 🎯 Common Patterns

### Empty State
```jsx
<div className="text-center" style={{ padding: '64px 0' }}>
  <h3 style={{ color: 'var(--gray-500)' }}>No items found</h3>
  <p style={{ color: 'var(--gray-400)' }}>Try again later!</p>
</div>
```

### Loading State
```jsx
{loading ? (
  <div className="loading">
    <div className="spinner" />
  </div>
) : (
  <div>Content...</div>
)}
```

### Success/Error Message
```jsx
{message && (
  <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} fade-in`}>
    {message.type === 'success' ? '✅' : '❌'} {message.text}
  </div>
)}
```

### Responsive Grid
```jsx
<div className="grid grid-3">  {/* 3 cols on desktop, 1 on mobile */}
  {items.map(item => (
    <div key={item.id} className="card fade-in">
      {/* Card content */}
    </div>
  ))}
</div>
```

### Form with Validation
```jsx
<form onSubmit={handleSubmit}>
  <div className="form-group">
    <label className="form-label" htmlFor="email">Email</label>
    <input 
      id="email"
      type="email"
      className="form-input"
      placeholder="you@example.com"
      required
      autoComplete="email"
    />
  </div>
  
  {error && (
    <div className="alert alert-error">
      ❌ {error}
    </div>
  )}
  
  <button className="btn btn-primary btn-lg w-full" disabled={loading}>
    {loading ? 'Submitting...' : 'Submit'}
  </button>
</form>
```

### Card with CTA
```jsx
<div className="card">
  <div className="card-content">
    <h3 className="card-title">Title</h3>
    <p className="card-text">Description text goes here...</p>
    <div className="card-footer">
      <button className="btn btn-primary w-full">Action</button>
    </div>
  </div>
</div>
```

### Hero Section
```jsx
<div className="hero">
  <img 
    src="https://example.com/image.jpg" 
    alt="Hero"
    className="hero-image"
  />
  <div className="hero-overlay" />
  <div className="hero-content">
    <h1 className="hero-title">Main Title</h1>
    <p className="hero-subtitle">Subtitle or description</p>
  </div>
</div>
```

## 💡 Pro Tips

1. **Combine classes**: `className="btn btn-primary btn-lg w-full"`
2. **Use variables**: `style={{ color: 'var(--ted-red)' }}`
3. **Responsive grids**: `grid-3` becomes single column on mobile automatically
4. **Add animations**: Add `fade-in` class to any element
5. **Consistent spacing**: Use `gap-*`, `mt-*`, `mb-*` instead of custom values
6. **Full width buttons**: Add `w-full` to make buttons span full width
7. **Loading states**: Always show spinners while data is loading
8. **Error handling**: Use `alert-error` for error messages

---

**Quick Start**: Copy-paste patterns and customize as needed!
