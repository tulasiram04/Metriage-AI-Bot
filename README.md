# 🏥 METRIAGE AI

METRIAGE AI is a **full-stack healthcare triage and pharmacy support platform** designed to assist users in assessing health conditions, managing profiles, viewing reports, and accessing pharmacy-related services. The project combines a modern **React + TypeScript frontend** with a **Node.js + Express backend**, integrated with AI services and cloud storage

---

## 🚀 Features

### 👤 User & Profile

* User authentication (login/signup)
* Profile management
* Avatar upload using Cloudinary

### 🧠 AI-Powered Triage

* Symptom-based triage flow
* AI service integration (Gemini)
* Health report generation

### 💊 Pharmacy & Orders

* Medicine categories
* Orders view
* Reports & history

### 📊 Dashboard Pages

* Home
* About
* Profile
* Reports
* Triage
* Pharmacy
* Order

---

## 🛠 Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS** (UI styling)

### Backend

* **Node.js**
* **Express.js**
* **MongoDB** (models)
* **Cloudinary** (avatar, image uploads)

### AI & Services

* **Gemini API** (AI triage & insights)

### Deployment

* **Vercel** (frontend)
* Backend deployable on Render / Railway / VPS

---

## 📁 Project Structure

```
METRIAGE AI/
│
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── services/          # API & AI services
│   ├── api.ts
│   └── geminiService.ts
│
├── views/              # Application pages
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Login.tsx
│   ├── Profile.tsx
│   ├── Reports.tsx
│   ├── Triage.tsx
│   └── Pharmacy.tsx
│
├── server/             # Backend
│   ├── models/
│   └── routes/
│       ├── auth.js
│       ├── user.js
│       ├── profile.js
│       ├── avatar.js
│       ├── orders.js
│       └── triage.js
│
├── public/
├── .env
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add:

```env
# Server
PORT=5000
MONGODB_URI=your_mongodb_connection

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI
GEMINI_API_KEY=your_gemini_api_key
```

⚠️ **Do not commit `.env` to GitHub**

---

## ▶️ How to Run the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/metriage-ai.git
cd metriage-ai
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Backend

```bash
cd server
npm install
npm run dev
```

### 4️⃣ Start Frontend

```bash
npm run dev
```

Open: **[http://localhost:3000](http://localhost:3000)**

---

## ☁️ Deployment

### Frontend (Vercel)

* Build Command: `npm run build`
* Output Directory: `dist`
* Add environment variables in Vercel dashboard

### Backend

* Deploy on Render / Railway / VPS
* Ensure `.env` variables are configured

---

## 🧪 Common Issues

### ❌ Cloudinary Error: `Must supply api_key`

✔ Ensure `.env` is loaded
✔ Restart backend server
✔ Cloudinary config runs **after dotenv.config()**

---

## 📌 Future Improvements

* Doctor consultation module
* Prescription uploads
* Payment integration
* Multi-language support
* Admin dashboard

---

## 👨‍💻 Author

**Tulasiram V**
Healthcare AI & Full-Stack Developer

---

## 📄 License

This project is licensed for educational and personal use.

---

⭐ If you like this project, give it a star on GitHub!
