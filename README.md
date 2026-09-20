<div align="center">

  # 🛡️ DefenceRoger — Frontend Suite

  <p align="center">
    <strong>India’s Premier Defense Entry Scheme Eligibility Diagnostics & SSB Interview Preparation Suite</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vite-v8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Framer_Motion-13.4-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/KaTeX-LaTeX_Math-007ACC?style=for-the-badge&logo=latex&logoColor=white" alt="KaTeX" />
  </p>

  <br />

  <img src="./public/images/nda-sudan-building.png" alt="DefenceRoger Banner" width="880" style="border-radius: 16px; box-shadow: 0 12px 32px rgba(0,0,0,0.15);" />

</div>

---

## 🌟 Overview

**DefenceRoger** is a modern, ultra-responsive web platform built to guide defense aspirants preparing for **UPSC NDA, CDS, AFCAT, TES, TGC, JAG, and NCC Special Entries**. 

It combines precise **date-of-birth age calculations**, multi-criteria **qualification diagnostics**, interactive **SSB 5-Day interview workspace modules**, timed **mock test sessions** with KaTeX mathematical typesetting, and candidate **performance analytics**.

---

## 📸 Visual Showcase & Key Features

### 1. Defense Entry Eligibility Calculator Engine
Calculates candidate age down to exact years and decimal months against official cut-off dates (e.g. `2026-07-01`), evaluating eligibility across 15+ Armed Forces entry schemes.

<div align="center">
  <img src="./public/images/main-piq.png" alt="Eligibility Diagnostics" width="780" style="border-radius: 12px; border: 1px solid #e2e8f0;" />
</div>

> [!TIP]
> Checks streams (PCM / General), degree completion status, JEE Main mandatory ranks (TES / B.Tech Navy), NCC 'C' Certificates, and remaining attempt counters.

---

### 2. Defense Preparation Workspace Modules
Interactive detail modules providing visual breakdowns for all major selection phases:
- **SSB 5-Day Selection Pipeline**: Screening (OIR/PPDT), Stage-II Psych Tests (TAT, WAT, SRT, SDT), GTO Obstacles, and Board Conference.
- **Candidate Cutoff Monitor**: Historic and predicted written exam cutoff statistics.
- **15 Officer-Like Qualities (OLQ) Framework**: Factor-wise breakdown (Planning, Social Adjustment, Dynamic Traits, Emotional Stability).

<div align="center">
  <img src="./public/images/reco.png" alt="SSB Workspace" width="780" style="border-radius: 12px; border: 1px solid #e2e8f0;" />
</div>

---

### 3. Timed Mock Test & Exam Simulator
Full-featured exam interface featuring:
- **KaTeX (LaTeX) Mathematical Rendering**: Crisp typesetting for complex math formulas in NDA & CDS questions.
- **Per-Question Timers & Progress Palette**: Color-coded question status (Answered, Unanswered, Current).
- **Auto-Submission & Idempotent Finalization**: Seamless session sync with the backend Express API.

---

## 🏗️ Architecture Flow

```mermaid
flowchart TD
    subgraph Client ["Frontend App (React 19 + Vite)"]
        UI["React Router Navigation"]
        Pages["Home / Workspace / Calculator / Mocks / TestSeries"]
        State["Auth Context (JWT + LocalStorage)"]
        API_Hook["API Layer (src/hooks/api.js)"]
    end

    subgraph DevProxy ["Vite Development Proxy"]
        Proxy["/api Proxy -> http://localhost:8080"]
    end

    subgraph Backend ["Backend API Server (Express + Node.js)"]
        AuthRoute["/api/auth/* (Signup / Login)"]
        UserRoute["/api/users/* (Exams / Sessions / Analytics)"]
        AdminRoute["/api/admin/* (Crud Exams & Users)"]
        DB[(MongoDB Atlas Cloud)]
    end

    UI --> Pages
    Pages --> State
    Pages --> API_Hook
    API_Hook --> Proxy
    Proxy --> AuthRoute
    Proxy --> UserRoute
    Proxy --> AdminRoute
    AuthRoute --> DB
    UserRoute --> DB
    AdminRoute --> DB
```

---

## 🛠️ Tech Stack & Ecosystem

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 (`react`, `react-dom`) | Component architecture & dynamic state rendering |
| **Routing** | React Router DOM v7 | Client-side routing with protected layout guards |
| **Styling** | Tailwind CSS v4 + `@tailwindcss/vite` | Modern utility-first CSS design system |
| **Animations** | Framer Motion & GSAP | Smooth page transitions, parallax layers, and modal dynamics |
| **Math Typesetting** | KaTeX (`katex`, `react-katex`) | Rendering LaTeX mathematical expressions |
| **Icons** | Lucide React & Phosphor Icons | Clean vector iconography |
| **Build Tool** | Vite v8 | High-speed HMR development & optimized production bundling |

---

## 📁 Folder Structure

```text
Frontend/new-ft/
├── public/
│   ├── images/          # Platform visuals & banner assets
│   ├── blogs/           # Static SSB candidate story data
│   └── icons.svg
├── src/
│   ├── assets/          # Custom typography fonts (Deltha, Megunso, Runtime)
│   ├── components/
│   │   ├── ui/          # Logo, DefenseBentoGrid, PageTransition, ParallaxComponent
│   │   └── hero/        # SlidingEaseVerticalBars
│   ├── hooks/
│   │   ├── api.js       # Centralized API fetch wrapper & eligibility engine
│   │   └── useAuth.jsx  # React Auth Provider & Session Context
│   ├── Layouts/
│   │   ├── Header.jsx   # Top navigation bar & mobile drawer
│   │   ├── Footer.jsx   # Footer links & copyright info
│   │   └── ProtectedRoute.jsx # Route authentication guard
│   ├── Routes/
│   │   ├── Home/        # Hero section, Bento Grid, 15 OLQs
│   │   ├── Calculator/  # Multi-criteria eligibility calculator
│   │   ├── Workspace/   # Visual workspace detail modules (/workspace/:id)
│   │   ├── TestSeries/  # Exam list, Mock test session, Results, Analytics
│   │   ├── Mocks/       # Downloadable PYQs library
│   │   ├── SSBDocuments/# SSB interview document checklist & PIQ form guide
│   │   └── Admin/       # Admin management dashboard (Exams, Tests, Users)
│   ├── App.jsx          # Main route registrations
│   ├── index.css        # Tailwind v4 import & font source-of-truth
│   └── main.jsx         # Application entry point
├── vite.config.js       # Port 8080 API proxy configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SAURABH-sys-png/new-ft.git
   cd new-ft
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local dev server**:
   ```bash
   npm run dev
   ```
   The application will launch at **`http://localhost:5173`**.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🔌 Backend API Connection & Proxy Configuration

During development, `/api` requests are automatically proxied via Vite to the running backend server:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

---

<div align="center">
  <p>Made with ❤️ for Indian Defense Aspirants</p>
  <p><strong>DefenceRoger — Know Your Eligibility. Own Your SSB.</strong></p>
</div>
