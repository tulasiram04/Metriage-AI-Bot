import React, { useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import { IOSSelectModal } from "../components/IOSSelectModal";
import { AlertModal } from "../components/AlertModal";
import {
  Heart,
  Shield,
  FileText,
  Phone,
  User,
  ChevronRight,
} from "../components/Icons";
import { updateUserProfile, checkNameAvailability, UserData } from "../services/userSession";

interface OnboardingProps {
  odessa: string;
  onComplete: (user: UserData) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ odessa, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    bloodGroup: "",
    allergies: [] as string[],
    conditions: [] as { name: string; status: string }[],
    height: "",
    weight: "",
  });

  const [allergyInput, setAllergyInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [conditionStatus, setConditionStatus] = useState("Ongoing");
  const [nameError, setNameError] = useState<string | null>(null);

  // Modals
  const [showBloodGroupModal, setShowBloodGroupModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showRelationModal, setShowRelationModal] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; message: string; title?: string }>({
    isOpen: false,
    message: "",
    title: "Notice"
  });

  // Options
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genderOptions = ["Male", "Female", "Other"];
  const relationOptions = ["Father", "Mother", "Spouse", "Sibling", "Friend", "Other"];
  const conditionStatusOptions = ["Ongoing", "Controlled", "Resolved"];

  const validateStep1 = async (): Promise<boolean> => {
    if (!formData.fullName.trim()) {
      setAlertModal({ isOpen: true, message: "Please enter your full name", title: "Required" });
      return false;
    }
    
    // Check name uniqueness
    setIsLoading(true);
    const { available, error } = await checkNameAvailability(formData.fullName, odessa);
    setIsLoading(false);
    
    if (!available) {
      setNameError(error || "This name is already taken");
      return false;
    }
    setNameError(null);

    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      setAlertModal({ isOpen: true, message: "Please enter a valid age (1-120)", title: "Required" });
      return false;
    }
    if (!formData.gender) {
      setAlertModal({ isOpen: true, message: "Please select your gender", title: "Required" });
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!formData.bloodGroup) {
      setAlertModal({ isOpen: true, message: "Please select your blood group", title: "Required" });
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (step === 1) {
      const valid = await validateStep1();
      if (valid) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const updates = {
        name: formData.fullName,
        age: parseInt(formData.age),
        gender: formData.gender,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactRelation: formData.emergencyContactRelation,
        emergencyContactPhone: formData.emergencyContactPhone,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies.length > 0 ? formData.allergies : [],
        conditions: formData.conditions,
        height: formData.height,
        weight: formData.weight,
      };

      const updatedUser = await updateUserProfile(odessa, updates);
      if (updatedUser) {
        onComplete(updatedUser);
      }
    } catch (error: any) {
      setAlertModal({ isOpen: true, message: error.message || "Failed to save profile", title: "Error" });
    } finally {
      setIsLoading(false);
    }
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()]
      }));
      setAllergyInput("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addCondition = () => {
    if (conditionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, { name: conditionInput.trim(), status: conditionStatus }]
      }));
      setConditionInput("");
    }
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <GlassCard className="p-8 border-slate-700/40">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to MedTriage AI</h1>
            <p className="text-slate-400">Let's set up your medical profile for personalized health insights</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-12 h-1 mx-1 ${step > s ? 'bg-cyan-500' : 'bg-slate-700'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Personal Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-500 uppercase font-semibold">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      setNameError(null);
                    }}
                    className={`w-full mt-1 bg-slate-900/50 border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none ${
                      nameError ? 'border-rose-500' : 'border-slate-700'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {nameError && <p className="text-rose-400 text-sm mt-1">{nameError}</p>}
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Age *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="Years"
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Gender *</label>
                  <button
                    onClick={() => setShowGenderModal(true)}
                    className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white text-left flex justify-between items-center hover:border-cyan-500/50"
                  >
                    <span className={formData.gender ? 'text-white' : 'text-slate-500'}>{formData.gender || "Select"}</span>
                    <span className="text-slate-500">▼</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} disabled={isLoading}>
                  {isLoading ? 'Checking...' : 'Next'} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Medical Information */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Medical Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Blood Group *</label>
                  <button
                    onClick={() => setShowBloodGroupModal(true)}
                    className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white text-left flex justify-between items-center hover:border-cyan-500/50"
                  >
                    <span className={formData.bloodGroup ? 'text-white' : 'text-slate-500'}>{formData.bloodGroup || "Select"}</span>
                    <span className="text-slate-500">▼</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Height</label>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="e.g., 175 cm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Weight</label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="e.g., 70 kg"
                    />
                  </div>
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="text-xs text-slate-500 uppercase font-semibold">Allergies (if any)</label>
                <div className="flex gap-2 mt-1 mb-2">
                  <input
                    type="text"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="Type allergy and press Enter"
                  />
                  <Button onClick={addAllergy} variant="secondary">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm border border-amber-500/30">
                      {allergy}
                      <button onClick={() => removeAllergy(allergy)} className="ml-1 hover:text-amber-200">×</button>
                    </span>
                  ))}
                  {formData.allergies.length === 0 && <span className="text-slate-500 text-sm italic">None added</span>}
                </div>
              </div>

              {/* Chronic Conditions */}
              <div>
                <label className="text-xs text-slate-500 uppercase font-semibold">Chronic Conditions (if any)</label>
                <div className="flex gap-2 mt-1 mb-2">
                  <input
                    type="text"
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="Condition name"
                  />
                  <select
                    value={conditionStatus}
                    onChange={(e) => setConditionStatus(e.target.value)}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    {conditionStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Button onClick={addCondition} variant="secondary">Add</Button>
                </div>
                <div className="space-y-2">
                  {formData.conditions.map((cond, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700">
                      <span className="text-white">{cond.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${cond.status === 'Controlled' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {cond.status}
                        </span>
                        <button onClick={() => removeCondition(i)} className="text-slate-400 hover:text-rose-400">×</button>
                      </div>
                    </div>
                  ))}
                  {formData.conditions.length === 0 && <span className="text-slate-500 text-sm italic">None added</span>}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleNext}>Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
              </div>
            </div>
          )}

          {/* Step 3: Emergency Contact (Optional) */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Emergency Contact</h2>
                <span className="text-xs text-slate-500">(Optional)</span>
              </div>

              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Contact Person</label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Relationship</label>
                    <button
                      onClick={() => setShowRelationModal(true)}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white text-left flex justify-between items-center hover:border-cyan-500/50"
                    >
                      <span className={formData.emergencyContactRelation ? 'text-white' : 'text-slate-500'}>
                        {formData.emergencyContactRelation || "Select"}
                      </span>
                      <span className="text-slate-500">▼</span>
                    </button>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium">Your data is secure</h4>
                  <p className="text-sm text-slate-400">All medical information is encrypted and stored securely.</p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Complete Setup'}
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Modals */}
      <IOSSelectModal
        isOpen={showBloodGroupModal}
        onClose={() => setShowBloodGroupModal(false)}
        title="Select Blood Group"
        options={bloodGroups}
        onSelect={(val) => {
          setFormData({ ...formData, bloodGroup: val });
          setShowBloodGroupModal(false);
        }}
        selectedValue={formData.bloodGroup}
      />
      <IOSSelectModal
        isOpen={showGenderModal}
        onClose={() => setShowGenderModal(false)}
        title="Select Gender"
        options={genderOptions}
        onSelect={(val) => {
          setFormData({ ...formData, gender: val });
          setShowGenderModal(false);
        }}
        selectedValue={formData.gender}
      />
      <IOSSelectModal
        isOpen={showRelationModal}
        onClose={() => setShowRelationModal(false)}
        title="Select Relationship"
        options={relationOptions}
        onSelect={(val) => {
          setFormData({ ...formData, emergencyContactRelation: val });
          setShowRelationModal(false);
        }}
        selectedValue={formData.emergencyContactRelation}
      />
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
      />
    </div>
  );
};
