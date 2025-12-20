This is a comprehensive, professionally formatted README.md file for your MedTriage AI project. I have corrected the project structure naming, enhanced the visual hierarchy, and ensured all technical details are aligned with modern GitHub documentation standards.🏥 MedTriage AI – Smart Healthcare Triage & E-PharmacyMedTriage AI is a modern, AI-assisted healthcare web application designed to provide intelligent symptom triage, health risk awareness, and an India-compliant e-pharmacy interface.Built with a focus on user experience and safety, this project demonstrates how AI can bridge the gap between initial symptoms and professional medical consultation while adhering to Indian medical regulations.📸 PreviewModern Glassmorphism UI for Healthcare✨ Key Features🧠 AI-Powered TriageSymptom Analysis: Real-time analysis of user-reported symptoms.Risk Categorization: Visual indicators for Low, Medium, and High-risk cases.Medical Specializations: Suggests which doctor to visit (e.g., Cardiologist, Neurologist).💊 E-Pharmacy (India-Focused)Local Pricing: All products listed in INR (₹).Regulatory Labels: Distinct markers for OTC, Schedule H, and Schedule H1 drugs.Prescription Compliance: Built-in logic for mandatory prescription uploads for restricted medicines.Category Browsing: Seamless filtering by Wellness, Chronic Care, and First Aid.🎨 Modern UI/UXGlassmorphism Design: Sleek, semi-transparent interface components.Tailwind CSS: Fully responsive layout optimized for Mobile, Tablet, and Desktop.Accessibility: High-contrast text and intuitive navigation.🧱 Technology StackLayerTechnologyFrontendReact 18, TypeScript, ViteStylingTailwind CSS, Framer MotionIconsLucide ReactAI EngineGemini 2.0 Flash (via Google Generative AI SDK)DeploymentVercel📂 Project StructurePlaintextMedTriage-AI/
├── public/                # Static assets (favicons, hero images)
├── src/
│   ├── components/        # Reusable UI components (Buttons, Modals, Cards)
│   ├── services/          # API integration and Gemini AI logic
│   ├── views/             # Page components
│   │   ├── Home.tsx       # Landing page
│   │   ├── Pharmacy.tsx   # E-pharmacy catalog
│   │   ├── Triage.tsx     # AI symptom checker
│   │   ├── Orders.tsx     # Order history
│   │   └── Reports.tsx    # Lab report management
│   ├── App.tsx            # Main routing logic
│   └── main.tsx           # Entry point
├── .env.example           # Template for environment variables
├── tailwind.config.js     # Styling configuration
└── vite.config.ts         # Build tool configuration
⚙️ Installation & Setup1️⃣ Clone the RepositoryBashgit clone https://github.com/tulasiram04/Metriage-AI.git
cd Metriage-AI
2️⃣ Install DependenciesBashnpm install
3️⃣ Configure Environment VariablesCreate a .env file in the root directory:Code snippetVITE_API_BASE_URL=https://your-api-url.com
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
4️⃣ Run Development ServerBashnpm run dev
The application will be available at: http://localhost:5173🚀 DeploymentVercel (Recommended)Import your GitHub repository to Vercel.Framework Preset: Vite.Build Command: npm run buildOutput Directory: distAdd your VITE_GEMINI_API_KEY in the Vercel Environment Variables settings.⚖️ Legal & Compliance (India)This project is designed with the Indian healthcare context in mind:Drugs & Cosmetics Act, 1940: Compliance frameworks for online medicine sales.Schedule H/H1: Clear labeling to prevent the sale of restricted drugs without verification.Data Residency: Architectural placeholders for storing sensitive medical data within Indian borders.⚠️ Disclaimer[!IMPORTANT]Educational Purposes Only. This software is developed strictly for demonstration.AI outputs are probabilistic and may contain errors.This system does NOT replace medical professionals.Prescription medicines must be dispensed only against valid prescriptions provided to a licensed pharmacist.Always consult a registered medical practitioner for health concerns.👨‍💻 AuthorTulasiram V - GitHub: @tulasiram04Project Status: ✔ Active DevelopmentBuilt with care for learning, innovation, and responsible AI.
