import React from 'react';
import {
  Stethoscope,
  Shield,
  ClipboardList,
  CheckCircle
} from '../components/Icons';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT – No Sign In Message */}
        <div className="bg-slate-900/60 backdrop-blur border border-white/5 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              No Sign In Required
            </h2>
            <p className="text-lg text-cyan-400 font-semibold mb-4">
              No Credit Card Required
            </p>
          </div>

          <p className="text-slate-300 mb-6 max-w-sm">
            Start using MedTriage AI instantly. No account needed, no payment required. 
            Just open and get AI-powered health insights.
          </p>

          <a
            href="/"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold hover:scale-105 transition-transform"
          >
            Get Started Free
          </a>

          <div className="mt-8 text-xs text-slate-400">
            <Shield className="inline w-4 h-4 mr-1 text-cyan-400" />
            Healthcare-grade security • Your data stays private
            <div className="text-rose-300 mt-2">
              For early health awareness only. Not a medical diagnosis.
            </div>
          </div>
        </div>

        {/* RIGHT – INFO */}
        <div className="rounded-2xl p-8 bg-gradient-to-b from-cyan-900 to-blue-900 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-bold mb-3">Early awareness saves lives.</h3>
            <p className="text-sm text-slate-200 mb-6">
              MedTriage AI is an intelligent healthcare platform that helps you understand your symptoms, 
              get AI-powered health insights, and take proactive steps for your well-being.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 items-start">
                <Stethoscope className="w-5 h-5 text-cyan-200 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">AI Symptom Triage</span>
                  <p className="text-xs text-slate-300 mt-1">Chat with our AI to analyze symptoms and get preliminary health guidance</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <ClipboardList className="w-5 h-5 text-cyan-200 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Secure Health Reports</span>
                  <p className="text-xs text-slate-300 mt-1">Download detailed PDF reports with risk assessment and specialist recommendations</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-cyan-200 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">100% Free Access</span>
                  <p className="text-xs text-slate-300 mt-1">No registration, no credit card, no hidden fees</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <Shield className="w-5 h-5 text-cyan-200 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Privacy First</span>
                  <p className="text-xs text-slate-300 mt-1">Your health data is never stored or shared</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="border-t border-cyan-700/50 pt-4">
            <p className="text-xs text-slate-300 mb-2">
              Powered by Groq AI • Built with React & Node.js
            </p>
            <p className="text-xs text-slate-400">© 2025 MedTriage AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
