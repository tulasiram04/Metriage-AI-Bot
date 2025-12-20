# MedTriage AI

**MedTriage AI** is an AI-assisted healthcare web application that provides
early symptom triage, risk awareness, and an India-focused e-pharmacy
experience.  
The system is designed for **educational and demonstration purposes**.

---

## What This Project Does

- Analyzes user symptoms using AI
- Categorizes health risk levels
- Suggests relevant medical specializations
- Provides an INR-based e-pharmacy UI
- Follows Indian medical and prescription norms

---

## Key Features

- AI-powered symptom triage  
- India-compliant e-pharmacy (OTC / Schedule H / H1)  
- INR pricing  
- Clean, modern UI with Glassmorphism  
- Responsive design  
- Vercel-ready deployment  

---

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS

**Backend (optional / extendable)**
- Node.js
- Express
- MongoDB

**AI**
- Gemini 2.5 Flash (configurable)

**Deployment**
- Vercel
- Static build (`dist/`)

---

## Project Structure

```text
Campus Navigation System
├── public
│   ├── pharmacy-hero.jpg
│   └── favicon.svg
│
├── views
│   ├── Home.tsx
│   ├── Pharmacy.tsx
│   ├── Triage.tsx
│   ├── Orders.tsx
│   ├── Reports.tsx
│   ├── Profile.tsx
│   └── About.tsx
│
├── components
│   ├── Header.tsx
│   ├── Button.tsx
│   ├── Icons.tsx
│   └── AlertModal.tsx
│
├── services
│   └── api.ts
│
├── App.tsx
├── main.tsx
├── index.html
├── package.json
└── README.md
