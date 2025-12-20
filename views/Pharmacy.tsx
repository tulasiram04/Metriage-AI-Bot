import React, { useState } from 'react';
import {
  Search,
  X,
  Bot,
  AlertTriangle,
  Send,
  CheckCircle,
  FileText,
  Pill
} from '../components/Icons';
import { Button } from '../components/Button';
import { AlertModal } from '../components/AlertModal';
import { Orders } from './Orders';

/* ---------------- TYPES ---------------- */
export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  requiresPrescription: boolean;
  use: string;
  description: string;
  manufacturer: string;
  stripQuantity: string;
  regulatoryBadge: 'OTC' | 'ScheduleH' | 'ScheduleH1';
}

/* ---------------- SAMPLE DATA (SHORTENED – ADD YOUR FULL LIST BELOW) ---------------- */
const MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Dolo 650',
    category: 'Fever & Pain',
    price: 30,
    inStock: true,
    requiresPrescription: false,
    use: 'Fever & Pain',
    description: 'Paracetamol 650mg for fever and pain relief.',
    manufacturer: 'Micro Labs',
    stripQuantity: '15 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '2',
    name: 'Azithral 500',
    category: 'Antibiotics',
    price: 120,
    inStock: false,
    requiresPrescription: true,
    use: 'Bacterial Infection',
    description: 'Azithromycin antibiotic tablet.',
    manufacturer: 'Alembic',
    stripQuantity: '5 Tablets',
    regulatoryBadge: 'ScheduleH1'
  }
];

/* ---------------- CATEGORIES ---------------- */
const CATEGORIES = [
  'All',
  'Fever & Pain',
  'Antibiotics',
  'Diabetes Care',
  'BP & Heart',
  'Vitamins & Supplements'
];

/* ---------------- COMPONENT ---------------- */
export const Pharmacy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showStockAlert, setShowStockAlert] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  const filteredMedicines = MEDICINES.filter(med => {
    const matchCategory =
      selectedCategory === 'All' || med.category === selectedCategory;
    const matchSearch = med.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-8 pb-12">

      {/* ================= HERO ================= */}
      <div className="relative rounded-3xl glass-panel p-8 md:p-12 border border-white/10 shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-4">
              <Bot className="w-4 h-4" />
              AI-Powered E-Pharmacy (India)
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Smart & Safe <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                Online Pharmacy
              </span>
            </h1>

            <p className="text-slate-300 mb-8 max-w-xl">
              Genuine medicines dispensed as per Indian regulations.
            </p>

            <div className="flex gap-4">
              <Button
                onClick={() => setActiveTab('catalog')}
                className={activeTab === 'catalog'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600'
                  : 'bg-white/5 hover:bg-white/10'}
              >
                Browse Medicines
              </Button>

              <Button
                onClick={() => setActiveTab('orders')}
                className={activeTab === 'orders'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600'
                  : 'bg-white/5 hover:bg-white/10'}
              >
                Track Orders
              </Button>
            </div>
          </div>

          {/* RIGHT IMAGE — ✅ LOCAL IMAGE */}
          <div className="relative">
            <img
              src="/pharmacy-hero.jpg"
              alt="Indian pharmacy healthcare"
              className="w-full h-[220px] md:h-[300px] object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
          </div>
        </div>

        {/* TRUST */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            DCGI Approved
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Secure Rx Upload
          </div>
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-blue-400" />
            Licensed Medicines
          </div>
          <div className="flex items-center gap-2">
            🇮🇳 Data Stored in India
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {activeTab === 'orders' ? (
        <Orders />
      ) : (
        <div className="grid lg:grid-cols-4 gap-8">

          {/* SIDEBAR */}
          <div className="hidden lg:block glass-panel p-6 rounded-2xl">
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`block w-full text-left px-4 py-2 rounded-lg mb-1 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* MAIN */}
          <div className="lg:col-span-3 space-y-6">

            {/* SEARCH */}
            <div className="relative glass-panel p-4 rounded-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search medicines..."
                className="w-full bg-transparent pl-12 pr-4 py-3 text-white outline-none"
              />
            </div>

            {/* GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map(med => (
                <div key={med.id} className="glass-panel p-5 rounded-xl">
                  <h3 className="text-white font-bold">{med.name}</h3>
                  <p className="text-xs text-slate-400">{med.manufacturer}</p>
                  <p className="text-sm text-slate-300 mt-2">{med.use}</p>

                  <div className="mt-4 flex justify-between items-end">
                    <div>
                      <span className="text-xl font-bold text-white">
                        ₹{med.price}
                      </span>
                      <div className="text-xs text-slate-500">
                        {med.stripQuantity}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setShowStockAlert(true)}
                      className="bg-slate-600 hover:bg-slate-500"
                    >
                      {med.inStock ? 'Add' : 'Out'}
                    </Button>
                  </div>

                  {med.requiresPrescription && (
                    <div className="mt-2 text-xs text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Prescription Required
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ALERT */}
      <AlertModal
        isOpen={showStockAlert}
        message="This item is currently unavailable."
        onClose={() => setShowStockAlert(false)}
      />

      {/* CHAT (OPTIONAL) */}
      {showAssistant && (
        <div className="fixed bottom-6 right-6 w-80 h-96 glass-panel rounded-xl">
          <div className="p-4 flex justify-between items-center">
            <span className="text-white">AI Assistant</span>
            <X onClick={() => setShowAssistant(false)} />
          </div>
          <div className="p-4">
            <input
              placeholder="Ask about medicines..."
              className="w-full p-2 bg-slate-800 rounded"
            />
            <Button className="mt-2 w-full">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
