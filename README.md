# 🏥 MedTriage AI – Smart Healthcare Triage & E-Pharmacy Platform

MedTriage AI is a modern, AI-assisted healthcare web application designed to provide **symptom triage**, **risk awareness**, and an **India-compliant e-pharmacy interface**.  
This project is built for **educational and demonstration purposes** and follows Indian medical regulations.

---

## 📸 Preview

> Add this image to `/public/pharmacy-hero.jpg`

```md
![MedTriage AI](public/pharmacy-hero.jpg)
✨ Features
🧠 AI-Powered Triage

Symptom analysis

Risk categorization

Suggested medical specializations

💊 E-Pharmacy (India-Focused)

INR pricing

OTC / Schedule H / Schedule H1 labels

Prescription compliance

Category-based medicine browsing

🧾 Reports & Orders

Order tracking

Medical report placeholders

🎨 Modern UI

Glassmorphism design

Tailwind CSS

Responsive layout

🧱 Technology Stack
Frontend
React 18

TypeScript

Vite

Tailwind CSS

Backend (Optional / Extensible)
Node.js

Express

MongoDB

REST APIs

AI Model
Gemini 2.5 Flash (configurable)

Deployment
Vercel

Static production build (dist/)

Environment variable support

📂 Project Structure
txt
Copy code
Campus Navigation System/
│
├── public/
│   ├── pharmacy-hero.jpg
│   ├── favicon.svg
│
├── views/
│   ├── Home.tsx
│   ├── Pharmacy.tsx
│   ├── Triage.tsx
│   ├── Orders.tsx
│   ├── Reports.tsx
│   ├── Profile.tsx
│   └── About.tsx
│
├── components/
│   ├── Header.tsx
│   ├── Button.tsx
│   ├── Icons.tsx
│   └── AlertModal.tsx
│
├── services/
│   └── api.ts
│
├── App.tsx
├── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── README.md
⚙️ Installation & Setup
1️⃣ Clone the Repository
bash
Copy code
git clone https://github.com/tulasiram04/Metriage-AI.git
cd Metriage-AI
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Run Development Server
bash
Copy code
npm run dev
The application will be available at:

txt
Copy code
http://localhost:5173
🏗️ Production Build
bash
Copy code
npm run build
Output folder:

txt
Copy code
dist/
🚀 Deployment (Vercel)
Import the GitHub repository into Vercel

Framework Preset: Vite

Build Command:

txt
Copy code
npm run build
Output Directory:

txt
Copy code
dist
Environment Variables (Example)
env
Copy code
VITE_API_BASE_URL=https://your-api-url.com
VITE_GEMINI_API_KEY=your_api_key
⚠️ Disclaimer
Important Notice

This software is developed strictly for educational and demonstration purposes.

AI outputs are probabilistic

This system does NOT replace medical professionals

Prescription medicines must be dispensed only against valid prescriptions

Always consult a registered medical practitioner

🇮🇳 Legal & Compliance
Designed with Indian healthcare context

Follows Drugs & Cosmetics Act, 1940

Schedule H / H1 medicines clearly marked

Data intended to be stored within India

👨‍💻 Author
Tulasiram V
GitHub: https://github.com/tulasiram04

⭐ Support
If you find this project useful:

⭐ Star the repository

🍴 Fork it

🧠 Learn from it

📌 Status
✔ Active Development
✔ Ready for Demo
✔ Vercel Deployable

Built with care for learning, innovation, and responsible AI.
