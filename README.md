# Burnout Risk Prediction System (BRPS) - Frontend Platform

BRPS Frontend is a fully functional, highly interactive, and beautifully designed occupational healthcare web application built using **React 19**, **Vite 8**, **React Router DOM**, and **Tailwind CSS v4**.

It communicates with a robust Express.js backend (using Supabase Auth) to calculate personal stress variables and run machine learning diagnostics on employee burnout probability.

---

## 🌟 Key Features

1. **Secure Session Guarding**:
   - Centralized authentication context (`AuthContext`) to manage user states, tokens, and registration payloads.
   - Customized Axios client with request interceptors to automatically inject JWT Bearer headers into protected requests.
   - `<ProtectedRoute>` router that restricts entry to dashboards and forces users with incomplete work parameters to complete their profile setup.

2. **Interactive Occupational Diagnostics**:
   - Multi-step Professional Wizard (`/setup-profile`) to capture job title, department, years of experience, work hours, and remote ratio indices.
   - Questionnaire Surveys (`/assessment`) featuring customized ranges and sliding scales, including an interactive 5-emoji scale for job satisfaction.

3. **AI Diagnostics Scan & Gauge Results**:
   - simulated neural-processing diagnostics scanner (`/assessment/:id/predict`) displaying processing steps as backend machine learning analysis executes.
   - SVG Circular Progress Gauge rendering risk thresholds (Low, Moderate, High) with corresponding color-coded borders.
   - Highly readable clinical action cards displaying HR directives and tailored AI self-care wellness tips.
   - Printable layouts allowing users to export physical copies of their diagnostics sheet easily.

---

## 🚀 Technology Stack

- **Framework**: React 19 (Hooks, Contexts, standard conditional render gates)
- **Tooling/Compiler**: Vite 8 (Ultra-fast Hot Module Replacement)
- **Styling**: Tailwind CSS v4 (Using modern compile directives `@import "tailwindcss"` and compiled theme customizations)
- **Icons**: Lucide React
- **Services**: Axios (automatic Bearer injection and unauthorized catchers)

---

## ⚙️ Environment Configuration

Create a `.env` file in your workspace root directory:
```env
VITE_API_BASE_URL=https://api-burnoutriskpredictionsystem.vercel.app
```
- **VITE_API_BASE_URL**: Points to the hosted or local backend server URL.

---

## 📦 Commands to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

### 3. Compile Production Bundle
```bash
npm run build
```

---

## 🛫 Vercel SPA Deployment Configuration

To ensure deep-linked routes (e.g. `/dashboard`, `/profile`) do not return `404 Not Found` when deployed to Vercel, a custom `vercel.json` file is configured in the root directory. It rewrites all path targets back to `/index.html` to be handled by React Router DOM.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
