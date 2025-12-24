import React from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, Pill, FileText } from '../components/Icons';
import { Button } from '../components/Button';
import { Medicine } from './Pharmacy';

interface MedicineDetailProps {
  medicine: Medicine;
  onBack: () => void;
  onAddToCart?: (medicine: Medicine) => void;
}

export const MedicineDetail: React.FC<MedicineDetailProps> = ({ medicine, onBack, onAddToCart }) => {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'OTC':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ScheduleH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'ScheduleH1':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Pharmacy</span>
      </button>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left - Medicine Image/Visual */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10">
          <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10" />
            <Pill className="w-32 h-32 text-cyan-400/50" />
            
            {/* Regulatory Badge */}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(medicine.regulatoryBadge)}`}>
              {medicine.regulatoryBadge}
            </div>

            {/* Stock Status */}
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
              medicine.inStock 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {medicine.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
        </div>

        {/* Right - Details */}
        <div className="space-y-6">
          {/* Header */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {medicine.name}
                </h1>
                <p className="text-slate-400 text-lg">{medicine.manufacturer}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                ₹{medicine.price}
              </span>
              <span className="text-slate-500">/ {medicine.stripQuantity}</span>
            </div>

            {/* Category & Use */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/20">
                {medicine.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-sm border border-teal-500/20">
                {medicine.use}
              </span>
            </div>

            {/* Prescription Warning */}
            {medicine.requiresPrescription && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-amber-400 font-semibold">Prescription Required</p>
                  <p className="text-amber-300/70 text-sm">This medicine requires a valid prescription from a registered medical practitioner.</p>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              onClick={() => {
                if (!medicine.inStock) {
                  alert('Out of stock, please come later.');
                  return;
                }
                onAddToCart?.(medicine);
              }}
              className={`w-full py-4 text-lg font-semibold ${
                medicine.inStock
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500'
                  : 'bg-slate-600 cursor-not-allowed'
              }`}
            >
              {medicine.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>

          {/* Description */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Description
            </h2>
            <p className="text-slate-300 leading-relaxed">
              {medicine.description}
            </p>
          </div>

          {/* Product Details */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Product Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                <span className="text-slate-400">Manufacturer</span>
                <span className="text-white font-medium">{medicine.manufacturer}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                <span className="text-slate-400">Category</span>
                <span className="text-white font-medium">{medicine.category}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                <span className="text-slate-400">Pack Size</span>
                <span className="text-white font-medium">{medicine.stripQuantity}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                <span className="text-slate-400">Primary Use</span>
                <span className="text-white font-medium">{medicine.use}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-400">Regulatory Status</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${getBadgeColor(medicine.regulatoryBadge)}`}>
                  {medicine.regulatoryBadge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            DCGI Approved
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-cyan-400" />
            100% Genuine
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            Quality Assured
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-400" />
            Secure Packaging
          </div>
        </div>
      </div>
    </div>
  );
};
