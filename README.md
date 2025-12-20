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
Setup Instructions
1. Clone the repository
bash
Copy code
git clone https://github.com/tulasiram04/Metriage-AI.git
cd Metriage-AI
2. Install dependencies
bash
Copy code
npm install
3. Start development server
bash
Copy code
npm run dev
Open in browser:

arduino
Copy code
http://localhost:5173
Production Build
bash
Copy code
npm run build
Build output:

Copy code
dist/
Deployment (Vercel)
Framework: Vite

Build command:

arduino
Copy code
npm run build
Output directory:

nginx
Copy code
dist
Environment Variables (example)
env
Copy code
VITE_API_BASE_URL=https://your-api-url
VITE_GEMINI_API_KEY=your_api_key
Disclaimer
This project is built only for learning and demonstration.

AI results are probabilistic

Not a substitute for professional medical advice

Prescription medicines must follow Indian regulations

Always consult a licensed medical practitioner

Author
Tulasiram V
GitHub: https://github.com/tulasiram04
