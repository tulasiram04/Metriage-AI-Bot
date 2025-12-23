import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';
import { AlertTriangle, CheckCircle, ShieldAlert, Stethoscope, ChevronRight, Send, Bot, User, Trash, Download, LogOut } from '../components/Icons';
import { analyzeSymptoms, startTriageChat } from '../services/geminiService';
import { AnalysisResult, RiskLevel, HistoryItem, ChatMessage } from '../types';
import { jsPDF } from 'jspdf';
import { api } from '../services/api';

interface TriageProps {
  onComplete: (item: HistoryItem) => void;
  onAuthRequired: () => void;
}

import { COMMON_SYMPTOMS_LIST, ALL_SYMPTOMS_AND_DISEASES } from '../data/symptoms';

export const Triage: React.FC<TriageProps> = ({ onComplete, onAuthRequired }) => {
  const [step, setStep] = useState<'input' | 'chat' | 'analyzing' | 'result'>('input');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    duration: ''
  });
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  // Chat state
  const [chatInstance, setChatInstance] = useState<ReturnType<typeof startTriageChat> | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check auth and auto-fill
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const me = JSON.parse(storedUser);
      if (me && me.name) setFormData(prev => ({ ...prev, name: me.name }));
    }
  }, []);

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      onAuthRequired();
      return false;
    }
    try {
      const user = JSON.parse(storedUser);
      if (!user || !user.id) {
        onAuthRequired();
        return false;
      }
      return true;
    } catch (e) {
      onAuthRequired();
      return false;
    }
  };

  const handleStartChat = () => {
    // Check Authentication first
    const isAuth = checkAuth();
    if (!isAuth) return;

    if (!formData.age || symptoms.length === 0 || !formData.duration) return;

    // Initialize Chat
    const chat = startTriageChat(
      parseInt(formData.age),
      formData.gender,
      symptoms,
      formData.duration
    );
    setChatInstance(chat);

    // Initial message from bot
    const initialMessage: ChatMessage = {
      id: 'init-1',
      role: 'model',
      text: `Hello${formData.name ? ' ' + formData.name : ''}. I understand you're experiencing ${symptoms.join(', ')} for ${formData.duration}. Can you tell me more about how you're feeling, or do you have any specific questions?`,
      timestamp: Date.now()
    };
    setMessages([initialMessage]);

    setStep('chat');
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !chatInstance) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const result = await chatInstance.sendMessage(userMsg.text, messages);
      const responseText = result.text || "I'm having trouble connecting right now.";

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error("Chat error", e);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting to the service. Please check your internet or try again later.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleAnalyze = async () => {
    // Prevent duplicate calls
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setStep('analyzing');

    // Compile chat history for context
    const consultationHistory = messages
      .map(m => `${m.role.toUpperCase()}: ${m.text}`)
      .join('\n');

    const analysis = await analyzeSymptoms(
      parseInt(formData.age),
      formData.gender,
      symptoms,
      formData.duration,
      consultationHistory
    );

    setResult(analysis);

    // Save to history
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      name: formData.name || 'Anonymous',
      age: parseInt(formData.age),
      gender: formData.gender,
      symptoms: symptoms,
      duration: formData.duration,
      timestamp: Date.now(),
      result: analysis,
      chatTranscript: consultationHistory
    };

    onComplete(historyItem);

    // Persist to Backend (attach server-side user ID if available)
    try {
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      if (meRes.ok) {
        const me = await meRes.json();
        const userId = me.id || me._id || me.userId;
        if (userId) {
          await api.triage.save({ ...historyItem, userId });
        }
      }
    } catch (e) {
      console.error('Failed to save to backend', e);
    }

    setStep('result');
  };

  const handleEndSession = () => {
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (rating: number) => {
    console.log(`User rated session: ${rating} stars`);

    try {
      // Resolve server-side user id if available
      let userId: string | null = null;
      try {
        const meRes = await fetch('/api/auth/me', { credentials: 'include' });
        if (meRes.ok) {
          const me = await meRes.json();
          userId = me.id || me._id || me.userId || null;
        }
      } catch (e) { /* ignore */ }

      await api.feedback.save({ rating, userId });
    } catch (e) {
      console.error("Failed to save feedback", e);
    }

    await handleAnalyze();
    setShowFeedbackModal(false);
  };

  const getLogoDataUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = '/report-logo.png';
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Canvas context not available');
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => {
        console.error('Failed to load logo for PDF');
        resolve('');
      };
    });
  };

  const downloadReport = async (item: HistoryItem) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Colors
    const primaryColor = '#0d9488'; // Medical Teal
    const darkColor = '#0f172a';    // Slate 900
    const lightGray = '#64748b';    // Slate 500
    const dangerColor = '#e11d48';  // Rose 600

    try {
      const logoDataUrl = await getLogoDataUrl();

      // --- Header Box ---
      doc.setFillColor(224, 242, 241); // #e0f2f1
      doc.rect(0, 0, pageWidth, 50, 'F');

      if (logoDataUrl) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, 10, 30, 30, 3, 3, 'F');
        doc.addImage(logoDataUrl, 'PNG', margin + 3, 13, 24, 24);
      }

      const textStartX = margin + 35;
      doc.setFont("times", "bold");
      doc.setFontSize(22);
      doc.setTextColor(primaryColor);
      doc.text("MedTriage AI", textStartX, 22);

      doc.setFont("times", "italic");
      doc.setFontSize(10);
      doc.setTextColor(darkColor);
      doc.text("Where Artificial Intelligence Meets", textStartX, 30);
      doc.text("Intelligent Healthcare Triage!", textStartX, 35);

      const dateStr = new Date(item.timestamp).toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Generated: ${dateStr}`, pageWidth - margin, 20, { align: 'right' });

      // --- Content ---
      let y = 65;
      const drawSectionHeading = (text: string, currentY: number) => {
        doc.setFont("times", "bold");
        doc.setFontSize(12);
        doc.setTextColor(primaryColor);
        doc.text(text.toUpperCase(), margin, currentY);
        doc.setDrawColor(primaryColor);
        doc.setLineWidth(0.5);
        doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
        return currentY + 12;
      };

      y = drawSectionHeading("Patient Summary", y);

      doc.setFont("times", "bold");
      doc.setFontSize(10);
      doc.setTextColor(darkColor);
      doc.text(`Name:`, margin, y);
      doc.setFont("times", "normal");
      doc.text(item.name || 'Anonymous', margin + 25, y);

      doc.setFont("times", "bold");
      doc.text(`Age:`, margin + 80, y);
      doc.setFont("times", "normal");
      doc.text(`${item.age}`, margin + 95, y);

      doc.setFont("times", "bold");
      doc.text(`Gender:`, margin + 130, y);
      doc.setFont("times", "normal");
      doc.text(item.gender, margin + 150, y);
      y += 8;

      doc.setFont("times", "bold");
      doc.text(`Duration:`, margin, y);
      doc.setFont("times", "normal");
      doc.text(item.duration, margin + 25, y);
      y += 15;

      y = drawSectionHeading("Reported Symptoms", y);
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.setTextColor(darkColor);
      const symptomsList = item.symptoms.join(", ");
      const splitSymptoms = doc.splitTextToSize(symptomsList, contentWidth);
      doc.text(splitSymptoms, margin, y);
      y += (splitSymptoms.length * 5) + 10;

      y = drawSectionHeading("Risk Assessment", y);
      let riskDisplayColor = [16, 185, 129];
      if (item.result.riskLevel === RiskLevel.MEDIUM) riskDisplayColor = [245, 158, 11];
      else if (item.result.riskLevel === RiskLevel.HIGH) riskDisplayColor = [225, 29, 72];

      doc.setFillColor(riskDisplayColor[0], riskDisplayColor[1], riskDisplayColor[2]);
      doc.roundedRect(margin, y - 4, 40, 8, 2, 2, 'F');
      doc.setFont("times", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(item.result.riskLevel, margin + 20, y + 1.5, { align: 'center' });
      y += 15;

      y = drawSectionHeading("AI Analysis", y);
      doc.setFont("times", "normal");
      doc.setTextColor(darkColor);
      const explanation = item.result.explanation;
      const maxExplanationLines = 15;
      let splitExplanation = doc.splitTextToSize(explanation, contentWidth);
      if (splitExplanation.length > maxExplanationLines) {
        splitExplanation = splitExplanation.slice(0, maxExplanationLines);
        splitExplanation.push("... [Analysis truncated for brevity]");
      }
      doc.text(splitExplanation, margin, y);
      y += (splitExplanation.length * 5) + 12;

      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, y, contentWidth, 30, 'FD');
      const boxY = y + 8;
      doc.setFont("times", "bold");
      doc.setTextColor(primaryColor);
      doc.text("RECOMMENDED SPECIALIST", margin + 5, boxY);
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.setTextColor(darkColor);
      doc.text(item.result.recommendation.specialization, margin + 5, boxY + 7);
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.setTextColor(lightGray);
      doc.text(item.result.recommendation.reason, margin + 5, boxY + 14, { maxWidth: contentWidth - 10 });

      const bottomY = pageHeight - 25;
      doc.setDrawColor(200);
      doc.line(margin, bottomY - 5, pageWidth - margin, bottomY - 5);
      doc.setFont("times", "italic");
      doc.setFontSize(8);
      doc.setTextColor(150);
      const disclaimer = "This report is generated by an AI system for educational and demonstration purposes only. It is not a medical diagnosis. Always consult a qualified healthcare professional.";
      doc.text(disclaimer, margin, bottomY, { maxWidth: contentWidth, align: 'justify' });

      doc.setFont("times", "normal");
      doc.setFontSize(8);
      doc.setTextColor(lightGray);
      doc.text("© MedTriage AI • AI Health Report • 2025", pageWidth / 2, pageHeight - 12, { align: 'center' });

      doc.save(`MedTriage_Report_${item.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
    }
  };

  // Symptom Input Handlers
  const handleAddSymptom = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms([...symptoms, trimmed]);
    }
    setSymptomInput('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSymptom(symptomInput);
    } else if (e.key === 'Backspace' && !symptomInput && symptoms.length > 0) {
      setSymptoms(symptoms.slice(0, -1));
    }
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const filteredSuggestions = ALL_SYMPTOMS_AND_DISEASES.filter(s =>
    s.toLowerCase().includes(symptomInput.toLowerCase()) &&
    !symptoms.includes(s)
  );

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'bg-emerald-500 text-white';
      case RiskLevel.MEDIUM: return 'bg-amber-500 text-white';
      case RiskLevel.HIGH: return 'bg-rose-500 text-white';
      default: return 'bg-gray-500';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return <CheckCircle className="w-12 h-12" />;
      case RiskLevel.MEDIUM: return <AlertTriangle className="w-12 h-12" />;
      case RiskLevel.HIGH: return <ShieldAlert className="w-12 h-12" />;
    }
  };

  if (step === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-medical-500 rounded-full border-t-transparent animate-spin"></div>
          <Stethoscope className="absolute inset-0 m-auto text-medical-600 w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Generating Report</h2>
        <p className="text-slate-500 dark:text-slate-400">Synthesizing consultation data & assessing risk...</p>
      </div>
    );
  }

  if (step === 'chat') {
    return (
      <div className="max-w-4xl mx-auto h-[80vh] flex flex-col animate-fade-in">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Consultation</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ask questions or provide more details</p>
          </div>
          <Button onClick={handleEndSession} className="bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-500/20 ring-rose-500 border-none">
            End Session
            <LogOut className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <GlassCard className="flex-grow flex flex-col p-0 overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-white/30 dark:bg-slate-900/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-medical-100 dark:bg-medical-900 flex items-center justify-center text-medical-600 dark:text-medical-300 flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-medical-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm'
                    }`}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
                    {msg.text.split('\n').map((line, i) => {
                      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('*') || line.trim().startsWith('-');

                      // Function to parse bold text
                      const parseBold = (text: string) => {
                        const parts = text.split(/(\*\*.*?\*\*)/g);
                        return parts.map((part, index) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={index} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        });
                      };

                      return (
                        <p key={i} className={`m-0 min-h-[1.2em] ${isBullet ? 'pl-4 relative' : ''}`}>
                          {isBullet && (
                            <span className="absolute left-0 top-0">•</span>
                          )}
                          {parseBold(line.replace(/^[•*-]\s*/, ''))}
                        </p>
                      );
                    })}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-medical-100 dark:bg-medical-900 flex items-center justify-center text-medical-600 dark:text-medical-300 flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="w-full pl-4 pr-12 py-3 rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-medical-500 outline-none text-slate-900 dark:text-white placeholder-slate-400"
                  disabled={isSending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isSending}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-medical-500 text-white hover:bg-medical-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        {showFeedbackModal && (
          <FeedbackModal
            onClose={() => setShowFeedbackModal(false)}
            onSkip={() => handleFeedbackSubmit(0)}
            onSubmit={handleFeedbackSubmit}
          />
        )}
      </div>
    );
  }

  if (step === 'result' && result) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <GlassCard className="p-8 border-l-8 overflow-hidden relative" style={{ borderColor: result.riskLevel === RiskLevel.HIGH ? '#f43f5e' : result.riskLevel === RiskLevel.MEDIUM ? '#f59e0b' : '#10b981' }}>

          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 relative z-10">
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4 ${getRiskColor(result.riskLevel)}`}>
                {result.riskLevel}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Assessment Complete</h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-xl text-lg leading-relaxed">
                {result.explanation}
              </p>
            </div>
            <div className={`p-4 rounded-full bg-white/20 backdrop-blur-sm self-start ${result.riskLevel === RiskLevel.HIGH ? 'text-rose-500' : result.riskLevel === RiskLevel.MEDIUM ? 'text-amber-500' : 'text-emerald-500'}`}>
              {getRiskIcon(result.riskLevel)}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-3 text-medical-700 dark:text-medical-400">
                <Stethoscope className="w-6 h-6" />
                <h3 className="font-semibold text-lg">Recommended Specialist</h3>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {result.recommendation.specialization}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {result.recommendation.reason}
              </p>
            </div>

            <div className="bg-rose-50/80 dark:bg-rose-900/20 rounded-xl p-6 border border-rose-100 dark:border-rose-800/30">
              <div className="flex items-center gap-3 mb-3 text-rose-700 dark:text-rose-400">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="font-semibold text-lg">Important Disclaimer</h3>
              </div>
              <p className="text-slate-700 dark:text-rose-100/80 text-sm leading-relaxed italic">
                "{result.disclaimer}"
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="secondary" onClick={() => downloadReport({
              id: Date.now().toString(),
              name: formData.name || 'Anonymous',
              age: parseInt(formData.age),
              gender: formData.gender,
              symptoms: symptoms,
              duration: formData.duration,
              timestamp: Date.now(),
              result: result,
              chatTranscript: messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n')
            })}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button onClick={() => {
              setStep('input');
              setFormData({ name: '', age: '', gender: 'Male', duration: '' });
              setSymptoms([]);
              setMessages([]);
              setChatInstance(null);
            }}>
              New Assessment
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Patient Intake</h2>
        <p className="text-slate-500 dark:text-slate-400">Please provide accurate details for the best assessment.</p>
      </div>

      <GlassCard className="p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name *</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                placeholder="Type your Name..."
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => checkAuth()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Age *</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                placeholder="25"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                onFocus={() => checkAuth()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender *</label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-medical-500 outline-none transition-all appearance-none cursor-pointer"
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value })}
              onFocus={() => checkAuth()}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Duration of Symptoms *</label>
            <div
              onClick={() => setShowDurationPicker(true)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-medical-500 outline-none transition-all cursor-pointer flex justify-between items-center group hover:bg-white/60 dark:hover:bg-slate-800/60"
            >
              <span className={formData.duration ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}>
                {formData.duration || "Select duration..."}
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-medical-500 transition-colors rotate-90" />
            </div>

            {/* iOS Style Glassmorphism Modal */}
            {showDurationPicker && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fade-in" onClick={() => setShowDurationPicker(false)}>
                <div
                  className="w-full max-w-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden animate-scale-up"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 text-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Duration</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">How long have symptoms lasted?</p>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {[
                      "1 Day", "2 Days", "3 Days", "4 Days", "5 Days", "6 Days",
                      "1 Week", "2 Weeks", "3 Weeks", "1 Month"
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFormData({ ...formData, duration: option });
                          setShowDurationPicker(false);
                        }}
                        className={`w-full p-4 text-center text-lg border-b border-slate-100/50 dark:border-slate-800/50 transition-colors active:bg-slate-100 dark:active:bg-slate-800 ${formData.duration === option
                          ? "text-medical-600 dark:text-medical-400 font-bold bg-medical-50/50 dark:bg-medical-900/20"
                          : "text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 bg-slate-50/50 dark:bg-slate-900/50">
                    <button
                      onClick={() => setShowDurationPicker(false)}
                      className="w-full p-3 rounded-2xl font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Symptoms *</label>
            </div>

            {/* Tag Input Container */}
            <div
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-medical-500 transition-all min-h-[56px] flex flex-wrap gap-2"
              onClick={() => document.getElementById('symptom-input')?.focus()}
            >
              {symptoms.map((sym, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-medical-100 dark:bg-medical-900/50 text-medical-700 dark:text-medical-300 text-sm">
                  {sym}
                  <button onClick={(e) => { e.stopPropagation(); removeSymptom(index); }} className="hover:text-medical-900 dark:hover:text-white">
                    <Trash className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                id="symptom-input"
                type="text"
                className="flex-grow bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 min-w-[120px]"
                placeholder={symptoms.length === 0 ? "Type symptom and press Enter..." : ""}
                value={symptomInput}
                onChange={(e) => {
                  setSymptomInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  checkAuth();
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && symptomInput && filteredSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent focus loss
                      handleAddSymptom(suggestion);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Quick add suggestions */}
            {symptoms.length < 3 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {COMMON_SYMPTOMS_LIST.slice(0, 6).filter(s => !symptoms.includes(s)).map(sym => (
                  <button
                    key={sym}
                    onClick={() => handleAddSymptom(sym)}
                    className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-medical-100 dark:hover:bg-medical-900 hover:text-medical-600 transition-colors"
                  >
                    + {sym}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            className="w-full text-lg mt-4"
            onClick={handleStartChat}
            disabled={!formData.name || !formData.age || symptoms.length === 0 || !formData.duration}
          >
            Start Consultation
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};