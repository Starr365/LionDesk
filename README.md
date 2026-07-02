# LionDesk: Departmental Help-Desk & Ticketing System

An automated, web-based ticketing system designed specifically for the **Department of Computer Science, University of Nigeria, Nsukka (UNN)**. 

LionDesk bridges the communication gap between students, staff, and the Head of Department (HOD). It streamlines problem reporting, automates ticket routing based on issue categories, and provides administrative oversight with data-driven analytics.

---

## 🏗️ Architecture Overview

The system is split into two independent codebases:

1.  **`/server-side`**: A robust REST API built with Node.js, Express, and MySQL. It gates endpoints using JWT authentication, routes tickets dynamically using workload/category algorithms, and manages background escalation jobs using cron-jobs.
2.  **`/client-side`**: A modern Single Page Application (SPA) built using React 19, Vite, and TypeScript. It utilizes Tailwind CSS v4 for layout, Zustand for light client-side state, TanStack Query for server-cache state, and D3.js for administrative reports.

---

## 🛠️ Technology Stack

### Backend (`server-side`)
*   **Core:** Node.js, Express
*   **Database:** MySQL (Promise-based `mysql2`)
*   **Security:** JWT, `bcryptjs` (passwords hashed with cost factor $\ge 10$)
*   **Schedulers:** `node-cron` (escalations checked hourly)
*   **Email Engine:** Resend API Integration

### Frontend (`client-side`)
*   **Runtime/Build:** Vite, React 19 (TypeScript)
*   **Styles:** Tailwind CSS v4
*   **Routing:** React Router (v6+)
*   **State Management:**
    *   *Local/UI State:* Zustand (lightweight stores)
    *   *Server/Network State:* TanStack Query (caching, mutation tracking)
*   **Data Visualization:** D3.js (custom SVG-based analytics charts)

---

## 📂 Project Structure

```
LionDesk/
├── README.md               # Overall system guide (this file)
├── PRD.md                  # Authoritative Product Requirements Document
├── server-side/            # Node.js/Express & MySQL API
│   ├── src/
│   │   ├── config/         # Database connection setup
│   │   ├── controllers/    # Express controllers
│   │   ├── middleware/     # JWT verification & role validation middlewares
│   │   ├── routes/         # Express endpoint route mapping
│   │   ├── services/       # Notification delivery, auto-routing modules
│   │   └── app.js          # Express entrypoint
│   └── package.json
└── client-side/            # React + TypeScript Frontend
    ├── src/
    │   ├── components/     # UI Component system
    │   │   ├── shared/     # Generic elements (buttons, inputs)
    │   │   └── [pages]/    # Page-specific components (e.g. landing-page/)
    │   ├── pages/          # Router page containers
    │   ├── store/          # Zustand store definitions
    │   ├── App.tsx         # Main application Router setup
    │   ├── main.tsx        # React mounting entrypoint
    │   └── index.css       # Tailwind stylesheet
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## 🚀 Getting Started

### 📋 Prerequisites
*   Node.js (v18 or higher recommended)
*   MySQL Server running locally or remotely

### 🔌 Running the Backend (`server-side`)
1.  Navigate to the directory:
    ```bash
    cd server-side
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    Copy `.env.example` to `.env` and fill in your local configurations:
    ```bash
    cp .env.example .env
    ```
4.  Run in development mode:
    ```bash
    npm run dev
    ```

### 💻 Running the Frontend (`client-side`)
1.  Navigate to the directory:
    ```bash
    cd client-side
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run in development mode:
    ```bash
    npm run dev
    ```
