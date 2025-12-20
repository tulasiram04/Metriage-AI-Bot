# MedTriage AI – Smart E-Pharmacy & Health Triage Platform

MedTriage AI is a modern **AI-powered healthcare web application** that combines **symptom triage**, **Indian-compliant e-pharmacy**, and **early health risk awareness** into a single platform.

The system is designed to **assist users**, improve awareness, and demonstrate how AI can support healthcare workflows — **without replacing medical professionals**.

---

## Key Highlights

- AI-powered symptom triage
- Indian e-pharmacy with INR pricing
- Prescription-aware medicine dispensing
- Regulation-compliant UI (India focused)
- Clean, professional glassmorphism design
- Built for education, demos, and portfolio use

---

## Features

### AI Health Triage
- Collects user-reported symptoms
- Provides AI-generated risk insights
- Categorizes risk levels (Low / Medium / High)
- Encourages timely consultation with doctors

### Indian E-Pharmacy
- Prices displayed in **₹ INR**
- Common Indian medicines included
- Clear regulatory labels:
  - OTC
  - Schedule H
  - Schedule H1
- Prescription requirement enforced at UI level
- Medicine categories:
  - Fever & Pain
  - Cold, Cough & Allergy
  - Antibiotics
  - Diabetes Care
  - BP & Heart
  - Digestive Health
  - Vitamins & Supplements
  - Women’s Health
  - Elder Care

### Professional UI / UX
- Glassmorphism design system
- Dark healthcare theme
- Fully responsive layout
- Clean navigation and cards
- Clear disclaimers and trust indicators

---

## Screenshots

### E-Pharmacy Home Page
![E-Pharmacy Hero](public/pharmacy-hero.jpg)

> Image is stored in the `public/` folder and works correctly with Vite and Vercel.

---

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Glassmorphism UI (CSS backdrop-filter)

### AI Layer
- Gemini 2.5 Flash
- Prompt-driven medical triage logic
- Strict disclaimer-based outputs

### Backend / APIs
- REST-ready architecture
- Can integrate:
  - Node.js + Express
  - Firebase
  - MongoDB
- Environment-based API configuration

### Deployment
- Vercel
- Static production build (`dist/`)
- Environment variable support

---

## Project Structure

Campus Navigation System/
│
├── public/
│ ├── pharmacy-hero.jpg
│ ├── favicon.svg
│
├── views/
│ ├── Pharmacy.tsx
│ ├── Triage.tsx
│ ├── Orders.tsx
│ ├── Profile.tsx
│ ├── About.tsx
│
├── components/
│ ├── Header.tsx
│ ├── Button.tsx
│ ├── Icons.tsx
│ ├── AlertModal.tsx
│
├── services/
│ └── api.ts
│
├── App.tsx
├── main.tsx
├── index.html
├── package.json
└── README.md

yaml
Copy code

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2. Install Dependencies
bash
Copy code
npm install
3. Run Development Server
bash
Copy code
npm run dev
Application will run at:

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
Vercel Settings
Framework: Vite

Build Command: npm run build

Output Directory: dist

Environment Variables (Optional)
env
Copy code
VITE_API_URL=https://your-backend-url
VITE_AI_MODEL=gemini-2.5-flash
Medical Disclaimer
Important Notice

MedTriage AI is developed strictly for educational and demonstration purposes.

The system does not provide medical diagnosis

AI outputs are probabilistic

Always consult a registered medical practitioner

Prescription medicines are dispensed only against valid prescriptions

This platform does not replace doctors, pharmacists, or hospitals

Project Objective
The objective of MedTriage AI is to:

Reduce unnecessary load on healthcare facilities

Provide early health risk awareness

Encourage responsible medicine usage

Demonstrate AI’s role as a healthcare assistant

Improve accessibility to basic health information

Academic Use
This project is suitable for:

Final year projects

Mini projects

Hackathons

AI + Healthcare demonstrations

Technical interviews

Portfolio showcasing

License
This project is licensed for educational use only.
Commercial deployment requires regulatory approvals and licensed partnerships.

Acknowledgements
Indian medical regulatory guidelines

Open-source community

React, Tailwind, and Vite ecosystems

If you found this project useful, feel free to ⭐ star the repository.
