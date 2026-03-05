
# SOC Lens — Security Operations Center Dashboard

## Overview
A premium cybersecurity log analysis dashboard with dark theme, glowing cyan accents, glass-style cards, and professional SOC aesthetic. The app connects to a local backend API for log upload and analysis.

## Design System
- **Background**: Deep dark (#0b0f14) with subtle gradients
- **Accent**: Electric cyan (#3be7ff) with glow effects
- **Secondary**: Purple/blue gradients for depth
- **Cards**: Glass-morphism style with soft borders and shadows
- **Typography**: Inter font, high contrast white text
- **Animations**: Smooth hover transitions, skeleton loaders, toast notifications

## Pages & Features

### 1. Login Page
- Split layout: left branding (SOC Lens title, subtitle, 3 feature bullets) + right login card
- Email/password fields with glowing focus states
- "Sign In" button + "Continue with Demo" button
- Demo mode pre-fills mock data and skips upload

### 2. Log Upload Page
- Top navbar with tabs: Upload | Dashboard | Alerts | Assistant + user avatar
- Centered drag-and-drop zone accepting .log, .txt, .gz files
- Upload progress bar, file preview, success toast
- Sends POST multipart to `http://127.0.0.1:8000/upload`
- Stores response (summary, risk, alerts, analytics, events_preview) in app state
- Auto-redirects to Dashboard on success

### 3. Security Dashboard
- **KPI Cards** (4): Total Events, Unique IPs, Risk Level, Alert Count — with icons and gradient highlights
- **Charts** (Recharts): Traffic Over Time (line), Top IPs (bar), HTTP Status Distribution (donut), Alerts by Rule (bar) — with tooltips and animations
- **Filter Bar**: Date range (Today/7d/30d/Custom), IP dropdown, Alert rule dropdown — charts update dynamically
- **Events Table**: Timestamp, IP, Path/Domain, Status columns with search bar and pagination

### 4. Alerts Page
- Table: Severity, Rule ID, IP Address, Time Window, Alert Count, Actions
- Eye button opens a side drawer with investigation details:
  - Rule condition, observed metrics, matched examples table
  - "Copy Alert JSON" button

### 5. AI Assistant Page
- Left panel: Incident summary card, risk score, top triggered rules
- Right panel: Chat interface with message bubbles
- Quick action buttons: "Generate Incident Narrative", "Generate Executive Summary"
- Mock AI responses for now

### 6. Shared Components
- Persistent top navigation bar across all pages (post-login)
- Skeleton loading states for all data sections
- Toast notifications for errors and successes
- Context/state management to share uploaded analysis data across pages
