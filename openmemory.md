# OpenMemory Guide for Metriage AI

## Overview
MedTriage AI is a digital health triage and pharmacy support platform that provides early health risk awareness using AI-powered analysis. It assists users in understanding potential risk levels and next steps, while clearly not replacing licensed medical professionals. The platform categorizes patient risk levels and suggests relevant medical specializations, ensuring critical cases are prioritized while routine health concerns are guided efficiently.

**Key Features:**
- AI Symptom Triage: Real-time symptom analysis to categorize risk levels using advanced NLP
- Secure Health Reports: PDF generation and storage of assessments
- Medicine Tracking: INR-based pharmacy with prescription compliance
- User Authentication: Email/password, Google OAuth, guest access
- Chat-based AI Consultation: Interactive triage with Groq AI

**Technology Stack:**
- Frontend: React with TypeScript, Vite, Tailwind CSS, Glassmorphism UI
- Backend: Node.js with Express, RESTful API architecture
- Database: MongoDB with Mongoose ODM
- AI Model: Groq LLaMA 3 70B
- Media Storage: Cloudinary (secure image uploads)
- Authentication: JWT-based sessions, Google Identity Services

## Architecture
The application follows a client-server architecture with:
- **Client**: React SPA served by Vite dev server (port 3000), proxies API calls to backend
- **Server**: Express.js API server (port 5000) handling authentication, triage analysis, data persistence
- **Database**: MongoDB Atlas cluster for user data, triage history, orders, feedback
- **AI Integration**: Groq API for symptom analysis and chat functionality
- **File Storage**: Cloudinary for avatar uploads and media

**API Endpoints:**
- `/api/auth`: User registration, login, Google OAuth, guest access
- `/api/triage`: Symptom analysis, chat, history saving/loading
- `/api/orders`: Medicine ordering and tracking
- `/api/user`: User profile management
- `/api/profile`: Avatar upload and profile updates
- `/api/feedback`: User feedback submission

## User Defined Namespaces
- frontend
- backend
- database
- ai-integration
- authentication

## Components
- **App.tsx**: Main application component managing routing and global state
- **Header.tsx**: Navigation bar with logo and menu items
- **Footer.tsx**: Site footer with copyright
- **GlassCard.tsx**: Reusable glassmorphism UI component
- **Button.tsx**: Styled button component with variants
- **SignInModal.tsx**: Modal prompting user authentication
- **Login.tsx**: Full login/signup page with Google OAuth
- **Triage.tsx**: Main triage workflow (input → chat → analysis → report)
- **Home.tsx**: Landing page with feature overview
- **Reports.tsx**: User history and PDF report generation
- **Pharmacy.tsx**: Medicine browsing and ordering interface
- **Profile.tsx**: User profile management
- **About.tsx**: Product information and disclaimers

## Patterns
- **Authentication Flow**: Check localStorage for user data, fallback to /api/auth/me endpoint
- **Triage Process**: Form input → AI analysis → Chat consultation → Risk assessment → PDF report
- **Error Handling**: Try-catch blocks with user-friendly error messages and toast notifications
- **Data Persistence**: Save triage results to MongoDB with user association
- **UI Theme**: Dark mode with glassmorphism effects using Tailwind CSS
- **PDF Generation**: jsPDF for report creation with custom styling and branding

# Fix: Server startup failure due to incorrect dotenv path

Issue: When running 'npm run server', the server crashed with 'MongoDB Connection Error: The uri parameter to openUri() must be a string, got "undefined"'. This happened because dotenv.config({ path: '../.env' }) was trying to load .env from outside the project directory. Solution: Changed to dotenv.config() which loads .env from the current working directory (root of project). After fix, server connects to MongoDB successfully.

## Metadata
- memory_types: ["debug"]
- project_id: "tulasiram04/Metriage-AI"