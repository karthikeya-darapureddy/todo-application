# TaskFlow - MERN Task Management Application
*(Built with Express, Next.js, Tailwind CSS, and local file persistence)*

TaskFlow is a beautifully designed, premium productivity companion built to handle all your task management needs with a modern UI and deep functionality.

## 🚀 Getting Started (Zero Installation Required)

Since you didn't have Node.js installed, I built an automated setup script that downloads a portable version of Node.js for this project, installs all dependencies, and launches both servers automatically!

To start the app anytime, open PowerShell in this directory and run:
```powershell
.\setup.ps1
```

*This will:*
1. Automatically download and configure portable Node.js if missing.
2. Install dependencies for the `server/` and `client/`.
3. Launch the **Backend (Express)** on `http://localhost:5000`.
4. Launch the **Frontend (Next.js)** on `http://localhost:3000`.
5. Seed demo data (a demo user with 20 tasks, analytics, etc.).

## 🔑 Demo Account
* **Email:** `demo@taskflow.io`
* **Password:** `Demo@1234`

## ✨ Key Features

- **Stunning UI/UX:** Built with a premium dark mode, glassmorphism shadows, interactive Framer Motion animations, custom Recharts tooltips, and tailored Tailwind colors (Indigo, Violet, Cyan).
- **No Database Required:** Built an in-memory JSON file store for the Express backend (`server/data/store.json`). It provides robust local persistence equivalent to a database but with zero setup required.
- **Full Authentication System:** Register, Login, Forgot Password, Reset Password, Email Verification.
- **Task Management CRUD:** Create, edit, and organize tasks with Priorities (High, Medium, Low), Statuses, Categories, and Tags.
- **Productivity Analytics:** See your Task Activity, Category distribution, and Priority charts using Recharts.
- **Advanced State Management:** Used Zustand for global stores (`useAuthStore`, `useTaskStore`, `useThemeStore`) with `localStorage` persistence.
- **Smart Filtering:** Search tasks, filter by multiple criteria simultaneously, and sort dynamically.

## 🛠 Tech Stack
- **Frontend:** Next.js 14, React, Tailwind CSS, Zustand, Framer Motion, Recharts, React Hook Form, Zod, React Hot Toast, Lucide Icons.
- **Backend:** Node.js, Express, jsonwebtoken, bcryptjs, multer, cors.
- **Data Layer:** Custom in-memory store synchronized to `store.json`.
