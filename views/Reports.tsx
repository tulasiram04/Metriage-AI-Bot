import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { FileText, Download, Trash } from '../components/Icons';
import { HistoryItem, RiskLevel } from '../types';
import { jsPDF } from 'jspdf';

interface ReportsProps {
  history: HistoryItem[];
  onClear: () => void;
}

export const Reports: React.FC<ReportsProps> = ({ history, onClear }) => {
  const [showConfirm, setShowConfirm] = useState(false);


  const getLogoDataUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = '/report-logo.png';
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Set higher resolution for clarity
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
        // Fallback or reject - if logo fails, resolve empty so PDF can still generate without it
        console.error('Failed to load logo for PDF');
        resolve('');
      };
    });
  };

  const generatePDF = async (item: HistoryItem) => {
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
    const primaryColor = '#0d9488'; // Medical Teal (matching website)
    const darkColor = '#0f172a';    // Slate 900
    const lightGray = '#64748b';    // Slate 500
    const dangerColor = '#e11d48';  // Rose 600

    try {
      const logoDataUrl = await getLogoDataUrl();

      // --- Header Box ---
      // Soft Aqua/Medical Teal background
      doc.setFillColor(224, 242, 241); // #e0f2f1
      doc.rect(0, 0, pageWidth, 50, 'F');

      // Logo (Left) with soft border
      if (logoDataUrl) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, 10, 30, 30, 3, 3, 'F');
        doc.addImage(logoDataUrl, 'PNG', margin + 3, 13, 24, 24);
      }

      // Text Positioning (Right of Logo)
      const textStartX = margin + 35;

      // Title
      doc.setFont("times", "bold");
      doc.setFontSize(22);
      doc.setTextColor(primaryColor);
      doc.text("MedTriage AI", textStartX, 22);

      // Tagline
      doc.setFont("times", "italic");
      doc.setFontSize(10);
      doc.setTextColor(darkColor);
      doc.text("Where Artificial Intelligence Meets", textStartX, 30);
      doc.text("Intelligent Healthcare Triage!", textStartX, 35);

      // Date (Top Right)
      const dateStr = new Date(item.timestamp).toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Generated: ${dateStr}`, pageWidth - margin, 20, { align: 'right' });

      // --- Patient Summary Section ---
      let y = 65;

      // Section Heading Style Helper
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

      // Row 1
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

      // Row 2
      doc.setFont("times", "bold");
      doc.text(`Duration:`, margin, y);
      doc.setFont("times", "normal");
      doc.text(item.duration, margin + 25, y);

      y += 15;

      // --- Reported Symptoms ---
      y = drawSectionHeading("Reported Symptoms", y);

      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.setTextColor(darkColor);

      const symptomsList = item.symptoms.join(", ");
      const splitSymptoms = doc.splitTextToSize(symptomsList, contentWidth);
      doc.text(splitSymptoms, margin, y);

      y += (splitSymptoms.length * 5) + 10;

      // --- Risk Assessment ---
      y = drawSectionHeading("Risk Assessment", y);

      // Risk Indicator
      let riskDisplayColor = [16, 185, 129]; // Emerald (Low)
      if (item.result.riskLevel === RiskLevel.MEDIUM) riskDisplayColor = [245, 158, 11]; // Amber
      else if (item.result.riskLevel === RiskLevel.HIGH) riskDisplayColor = [225, 29, 72]; // Rose (High)

      doc.setFillColor(riskDisplayColor[0], riskDisplayColor[1], riskDisplayColor[2]);
      doc.roundedRect(margin, y - 4, 40, 8, 2, 2, 'F');

      doc.setFont("times", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(item.result.riskLevel, margin + 20, y + 1.5, { align: 'center' });

      y += 15;

      // --- AI Medical Explanation ---
      y = drawSectionHeading("AI Analysis", y);

      doc.setFont("times", "normal");
      doc.setTextColor(darkColor);
      const explanation = item.result.explanation;
      // Truncate if extremely long to strictly fit one page, assuming ~40 chars per line estimate for simple height calc
      // Real calculation is better:
      const maxExplanationLines = 15; // Roughly fits space
      let splitExplanation = doc.splitTextToSize(explanation, contentWidth);

      if (splitExplanation.length > maxExplanationLines) {
        splitExplanation = splitExplanation.slice(0, maxExplanationLines);
        splitExplanation.push("... [Analysis truncated for brevity]");
      }

      doc.text(splitExplanation, margin, y);
      y += (splitExplanation.length * 5) + 12;

      // --- Recommended Specialist ---
      // Box style
      doc.setFillColor(241, 245, 249); // slate-100
      doc.setDrawColor(203, 213, 225); // slate-300
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

      // --- Disclaimer (Bottom Fixed) ---
      const bottomY = pageHeight - 25;

      doc.setDrawColor(200);
      doc.line(margin, bottomY - 5, pageWidth - margin, bottomY - 5);

      doc.setFont("times", "italic");
      doc.setFontSize(8);
      doc.setTextColor(150);
      const disclaimer = "This report is generated by an AI system for educational and demonstration purposes only. It is not a medical diagnosis. Always consult a qualified healthcare professional.";
      doc.text(disclaimer, margin, bottomY, { maxWidth: contentWidth, align: 'justify' });

      // --- Footer ---
      doc.setFont("times", "normal");
      doc.setFontSize(8);
      doc.setTextColor(lightGray);
      doc.text("© MedTriage AI • AI Health Report • 2025", pageWidth / 2, pageHeight - 12, { align: 'center' });

      doc.save(`MedTriage_Report_${item.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error("PDF Generation failed", error);
    }
  };

  const getRiskBadgeColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case RiskLevel.MEDIUM: return 'bg-amber-100 text-amber-700 border-amber-200';
      case RiskLevel.HIGH: return 'bg-rose-100 text-rose-700 border-rose-200';
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 animate-fade-in">
        <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full">
          <FileText className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No Reports Yet</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          Complete a health check in the Triage section to see your generated reports here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Patient Reports</h2>
          <p className="text-slate-500 dark:text-slate-400">View and download past assessments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setShowConfirm(true)} className="text-rose-500 hover:bg-rose-50">
            <Trash className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        title="Clear All History?"
        message="Are you sure you want to clear all patient history? This action cannot be undone."
        confirmLabel="Yes, Clear All"
        cancelLabel="Cancel"
        onConfirm={() => {
          onClear();
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />

      <div className="grid gap-4">
        {history.slice().reverse().map((item) => (
          <GlassCard key={item.id} className="p-6 group hover:border-medical-300 dark:hover:border-medical-700 transition-colors">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {item.name} <span className="text-slate-400 font-normal">({item.age}y, {item.gender})</span>
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getRiskBadgeColor(item.result.riskLevel)}`}>
                    {item.result.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  <span className="font-semibold">Symptoms:</span> {item.symptoms.join(', ')}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 min-w-[200px] border-l border-slate-100 dark:border-slate-800 pl-6 ml-2">
                <div className="text-right mb-1">
                  <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Recommendation</span>
                  <p className="font-medium text-medical-600 dark:text-medical-400">
                    {item.result.recommendation.specialization}
                  </p>
                </div>
                <Button variant="secondary" onClick={() => generatePDF(item)} className="w-full text-xs py-2 h-auto">
                  <Download className="w-3 h-3 mr-2" />
                  PDF Report
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 hidden group-hover:block animate-fade-in">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold">Analysis:</span> {item.result.explanation}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div >
  );
};