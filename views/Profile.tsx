import React, { useState, useEffect } from "react";
import { ViewState, RiskLevel } from "../types";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { IOSSelectModal } from "../components/IOSSelectModal";
import { AlertModal } from "../components/AlertModal";
import {
  Heart,
  Activity,
  Calendar,
  Shield,
  Edit2,
  Save,
  Lock,
  FileText,
  Phone,
  AlertCircle,
  ShoppingBag,
  ChevronRight,
  User,
} from "../components/Icons";
import { initializeUserSession, updateUserProfile, getStoredUserId, checkNameAvailability } from "../services/userSession";

interface ProfileProps {
  onNavigate: (view: ViewState) => void;
}

interface Condition {
  name: string;
  status: string;
}

interface MedicalData {
  // Personal Details
  fullName: string;
  age: string;
  gender: string;
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  // Medical Information
  bloodGroup: string;
  allergies: string[];
  conditions: Condition[];
  // Additional Medical Details
  height: string;
  weight: string;
  currentMedications: string;
  pastMedicalHistory: string;
  specialNotes: string;
}

interface UserStats {
  totalConsults: number;
  lastTriageDate: string | null;
  latestRisk: RiskLevel | null;
}

interface MedicineView {
  medicineId: string;
  name: string;
  strength: string;
  price: number;
  timestamp: string;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [odessa, setOdessa] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalConsults: 0,
    lastTriageDate: null,
    latestRisk: null,
  });
  const [recentlyViewed, setRecentlyViewed] = useState<MedicineView[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [medicalData, setMedicalData] = useState<MedicalData>({
    fullName: "",
    age: "",
    gender: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    bloodGroup: "",
    allergies: [],
    conditions: [],
    height: "",
    weight: "",
    currentMedications: "",
    pastMedicalHistory: "",
    specialNotes: "",
  });

  const [allergyInput, setAllergyInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [conditionStatus, setConditionStatus] = useState("Ongoing");

  // Modals
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
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

  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    setIsLoading(true);
    try {
      // Initialize or retrieve user session
      const { odessa: userId, user } = await initializeUserSession();
      setOdessa(userId);
      
      // Populate medical data from user
      setMedicalData({
        fullName: user.name || "",
        age: user.age?.toString() || "",
        gender: user.gender || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactRelation: user.emergencyContactRelation || "",
        emergencyContactPhone: user.emergencyContactPhone || "",
        bloodGroup: user.bloodGroup || "",
        allergies: Array.isArray(user.allergies) ? user.allergies : [],
        conditions: Array.isArray(user.conditions) ? user.conditions : [],
        height: user.height || "",
        weight: user.weight || "",
        currentMedications: user.currentMedications || "",
        pastMedicalHistory: user.pastMedicalHistory || "",
        specialNotes: user.specialNotes || "",
      });

      if (user.medicalInfoUpdatedAt) {
        setLastUpdated(new Date(user.medicalInfoUpdatedAt).toLocaleString());
      }
    } catch (e) {
      console.error('Session init error', e);
    } finally {
      setIsLoading(false);
    }

    // Load recently viewed
    const viewedStr = localStorage.getItem('recentlyViewed');
    if (viewedStr) {
      const viewed = JSON.parse(viewedStr);
      const now = Date.now();
      const validViewed = viewed.filter((v: any) => now - v.timestamp < 30 * 60 * 1000);
      setRecentlyViewed(validViewed);
      localStorage.setItem('recentlyViewed', JSON.stringify(validViewed));
    }

    // Load triage stats
    const historyStr = localStorage.getItem("medtriage_history");
    const loadedHistory = historyStr ? JSON.parse(historyStr) : [];
    const lastItem = loadedHistory.length > 0 ? loadedHistory[loadedHistory.length - 1] : null;

    setStats({
      totalConsults: loadedHistory.length,
      lastTriageDate: lastItem ? new Date(lastItem.timestamp).toLocaleDateString() : "N/A",
      latestRisk: lastItem ? lastItem.result.riskLevel : null,
    });
  };

  const handleSaveProfile = async () => {
    if (!odessa) {
      setAlertModal({ isOpen: true, message: "User session not initialized. Please refresh the page.", title: "Error" });
      return;
    }

    // Check name uniqueness
    if (medicalData.fullName.trim()) {
      const { available, error } = await checkNameAvailability(medicalData.fullName, odessa);
      if (!available) {
        setAlertModal({ isOpen: true, message: error || "This name is already taken", title: "Error" });
        return;
      }
    }

    const updates = {
      name: medicalData.fullName,
      age: medicalData.age ? parseInt(medicalData.age) : null,
      gender: medicalData.gender,
      emergencyContactName: medicalData.emergencyContactName,
      emergencyContactRelation: medicalData.emergencyContactRelation,
      emergencyContactPhone: medicalData.emergencyContactPhone,
      bloodGroup: medicalData.bloodGroup,
      allergies: medicalData.allergies,
      conditions: medicalData.conditions,
      height: medicalData.height,
      weight: medicalData.weight,
      currentMedications: medicalData.currentMedications,
      pastMedicalHistory: medicalData.pastMedicalHistory,
      specialNotes: medicalData.specialNotes,
    };

    try {
      const updatedUser = await updateUserProfile(odessa, updates);
      if (updatedUser?.medicalInfoUpdatedAt) {
        setLastUpdated(new Date(updatedUser.medicalInfoUpdatedAt).toLocaleString());
      }
      setAlertModal({ isOpen: true, message: "Medical information saved successfully!", title: "Success" });
    } catch (error: any) {
      setAlertModal({ isOpen: true, message: error.message || "Error saving profile", title: "Error" });
    }

    setIsEditMode(false);
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !medicalData.allergies.includes(allergyInput.trim())) {
      setMedicalData(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()]
      }));
      setAllergyInput("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setMedicalData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addCondition = () => {
    if (conditionInput.trim()) {
      setMedicalData(prev => ({
        ...prev,
        conditions: [...prev.conditions, { name: conditionInput.trim(), status: conditionStatus }]
      }));
      setConditionInput("");
      setConditionStatus("Ongoing");
    }
  };

  const removeCondition = (index: number) => {
    setMedicalData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const handleClearData = () => {
    localStorage.removeItem("medtriage_history");
    loadData();
    setShowClearDataConfirm(false);
  };

  const getRiskColor = (risk: RiskLevel | null) => {
    if (!risk) return "text-slate-400";
    switch (risk) {
      case RiskLevel.LOW: return "text-emerald-400";
      case RiskLevel.MEDIUM: return "text-amber-400";
      case RiskLevel.HIGH: return "text-rose-400";
      default: return "text-slate-400";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your medical profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard
          className="p-5 flex items-center gap-4 border-slate-700/30 cursor-pointer hover:border-cyan-500/30 transition-all group"
          onClick={() => onNavigate("reports")}
        >
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Consults</p>
            <p className="text-2xl font-bold text-white">{stats.totalConsults}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-5 flex items-center gap-4 border-slate-700/30">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Last Triage</p>
            <p className="text-lg font-bold text-white">{stats.lastTriageDate || "No visits yet"}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-5 flex items-center gap-4 border-slate-700/30">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Latest Risk Level</p>
            <p className={`text-lg font-bold ${getRiskColor(stats.latestRisk)}`}>
              {stats.latestRisk || "Unknown"}
            </p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Medical Information Card */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className={`p-6 border-slate-700/40 transition-all ${isEditMode ? "ring-2 ring-cyan-500/20 bg-slate-800/40" : ""}`}>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Medical Information</h3>
                {isEditMode && (
                  <span className="text-xs text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-800">Editing</span>
                )}
              </div>
              <Button
                variant="secondary"
                className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white border-2"
                onClick={isEditMode ? handleSaveProfile : () => setIsEditMode(true)}
              >
                {isEditMode ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                {isEditMode ? "Save" : "Edit"}
              </Button>
            </div>

            {/* Personal Details */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Personal Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Full Name</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={medicalData.fullName}
                      onChange={(e) => setMedicalData({ ...medicalData, fullName: e.target.value })}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  ) : (
                    <p className="text-white font-medium mt-1">{medicalData.fullName || <span className="text-slate-500 italic">Not set</span>}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Age</label>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={medicalData.age}
                      onChange={(e) => setMedicalData({ ...medicalData, age: e.target.value })}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="Years"
                    />
                  ) : (
                    <p className="text-white font-medium mt-1">{medicalData.age ? `${medicalData.age} years` : <span className="text-slate-500 italic">Not set</span>}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Gender</label>
                  {isEditMode ? (
                    <button
                      onClick={() => setShowGenderModal(true)}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-left flex justify-between items-center hover:border-cyan-500/50"
                    >
                      <span>{medicalData.gender || "Select"}</span>
                      <span className="text-slate-500">▼</span>
                    </button>
                  ) : (
                    <p className="text-white font-medium mt-1">{medicalData.gender || <span className="text-slate-500 italic">Not set</span>}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mb-6 p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
              <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Contact Person</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={medicalData.emergencyContactName}
                      onChange={(e) => setMedicalData({ ...medicalData, emergencyContactName: e.target.value })}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  ) : (
                    <p className="text-white font-medium mt-1">{medicalData.emergencyContactName || <span className="text-slate-500 italic">Not set</span>}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Relationship</label>
                  {isEditMode ? (
                    <button
                      onClick={() => setShowRelationModal(true)}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-left flex justify-between items-center hover:border-cyan-500/50"
                    >
                      <span>{medicalData.emergencyContactRelation || "Select"}</span>
                      <span className="text-slate-500">▼</span>
                    </button>
                  ) : (
                    <p className="text-white font-medium mt-1">{medicalData.emergencyContactRelation || <span className="text-slate-500 italic">Not set</span>}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Phone Number</label>
                  {isEditMode ? (
                    <input
                      type="tel"
                      value={medicalData.emergencyContactPhone}
                      onChange={(e) => setMedicalData({ ...medicalData, emergencyContactPhone: e.target.value })}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="+91 9876543210"
                    />
                  ) : (
                    <p className="text-white font-medium mt-1">
                      {medicalData.emergencyContactPhone ? (
                        <a href={`tel:${medicalData.emergencyContactPhone}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                          <Phone className="w-4 h-4" /> {medicalData.emergencyContactPhone}
                        </a>
                      ) : (
                        <span className="text-slate-500 italic">Not set</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Info Row */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4" /> Medical Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blood Group */}
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Blood Group</label>
                  {isEditMode ? (
                    <button
                      onClick={() => setShowBloodGroupModal(true)}
                      className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-left flex justify-between items-center hover:border-cyan-500/50"
                    >
                      <span>{medicalData.bloodGroup || "Select"}</span>
                      <span className="text-slate-500">▼</span>
                    </button>
                  ) : (
                    <div className="mt-1">
                      {medicalData.bloodGroup ? (
                        <span className="inline-block px-4 py-2 bg-rose-500/20 text-rose-400 font-bold text-lg rounded-lg border border-rose-500/30">
                          {medicalData.bloodGroup}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Not set</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Height & Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Height</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={medicalData.height}
                        onChange={(e) => setMedicalData({ ...medicalData, height: e.target.value })}
                        className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        placeholder="e.g., 175 cm"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">{medicalData.height || <span className="text-slate-500 italic">—</span>}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Weight</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={medicalData.weight}
                        onChange={(e) => setMedicalData({ ...medicalData, weight: e.target.value })}
                        className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        placeholder="e.g., 70 kg"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">{medicalData.weight || <span className="text-slate-500 italic">—</span>}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div className="mb-6">
              <label className="text-xs text-slate-500 uppercase font-semibold">Allergies</label>
              {isEditMode ? (
                <div className="mt-2">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={allergyInput}
                      onChange={(e) => setAllergyInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                      className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="Type allergy and press Enter"
                    />
                    <Button onClick={addAllergy} variant="secondary" className="px-4">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {medicalData.allergies.map((allergy, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm border border-amber-500/30">
                        {allergy}
                        <button onClick={() => removeAllergy(allergy)} className="ml-1 hover:text-amber-200">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {medicalData.allergies.length > 0 ? (
                    medicalData.allergies.map((allergy, i) => (
                      <span key={i} className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm border border-amber-500/30">
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <span className="text-emerald-400 font-medium">None</span>
                  )}
                </div>
              )}
            </div>

            {/* Chronic Conditions */}
            <div className="mb-6">
              <label className="text-xs text-slate-500 uppercase font-semibold">Chronic Conditions</label>
              {isEditMode ? (
                <div className="mt-2">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={conditionInput}
                      onChange={(e) => setConditionInput(e.target.value)}
                      className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="Condition name"
                    />
                    <select
                      value={conditionStatus}
                      onChange={(e) => setConditionStatus(e.target.value)}
                      className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    >
                      {conditionStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Button onClick={addCondition} variant="secondary" className="px-4">Add</Button>
                  </div>
                  <div className="space-y-2">
                    {medicalData.conditions.map((cond, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700">
                        <span className="text-white">{cond.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${cond.status === 'Controlled' ? 'bg-emerald-500/20 text-emerald-400' : cond.status === 'Resolved' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {cond.status}
                          </span>
                          <button onClick={() => removeCondition(i)} className="text-slate-400 hover:text-rose-400">×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  {medicalData.conditions.length > 0 ? (
                    medicalData.conditions.map((cond, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-white font-medium">{cond.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${cond.status === 'Controlled' ? 'bg-emerald-500/20 text-emerald-400' : cond.status === 'Resolved' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {cond.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-emerald-400 font-medium">None</span>
                  )}
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="mb-6 grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs text-slate-500 uppercase font-semibold">Current Medications</label>
                {isEditMode ? (
                  <textarea
                    value={medicalData.currentMedications}
                    onChange={(e) => setMedicalData({ ...medicalData, currentMedications: e.target.value })}
                    className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                    rows={2}
                    placeholder="List current medications..."
                  />
                ) : (
                  <p className="text-white mt-1">{medicalData.currentMedications || <span className="text-slate-500 italic">None</span>}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase font-semibold">Past Medical History</label>
                {isEditMode ? (
                  <textarea
                    value={medicalData.pastMedicalHistory}
                    onChange={(e) => setMedicalData({ ...medicalData, pastMedicalHistory: e.target.value })}
                    className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                    rows={2}
                    placeholder="Surgeries, hospitalizations, past illnesses..."
                  />
                ) : (
                  <p className="text-white mt-1">{medicalData.pastMedicalHistory || <span className="text-slate-500 italic">None</span>}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase font-semibold">Special Notes for Doctors</label>
                {isEditMode ? (
                  <textarea
                    value={medicalData.specialNotes}
                    onChange={(e) => setMedicalData({ ...medicalData, specialNotes: e.target.value })}
                    className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                    rows={2}
                    placeholder="Any special instructions or notes..."
                  />
                ) : (
                  <p className="text-white mt-1">{medicalData.specialNotes || <span className="text-slate-500 italic">None</span>}</p>
                )}
              </div>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="pt-4 border-t border-slate-700/50 text-xs text-slate-500">
                Last Updated: {lastUpdated}
              </div>
            )}
          </GlassCard>

          {/* Privacy & Security */}
          <GlassCard className="p-6 border-slate-700/40">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Privacy & Security</h3>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-full h-fit">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Data Encryption Active</h4>
                  <p className="text-sm text-slate-400">Your health data is stored securely in the database.</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-rose-400 hover:bg-rose-500/10 whitespace-nowrap"
                onClick={() => setShowClearDataConfirm(true)}
              >
                Clear My Data
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Continue Shopping Sidebar */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 h-full border-slate-700/40 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Continue Shopping</h3>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {recentlyViewed.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center opacity-50">
                  <ShoppingBag className="w-12 h-12 mb-3 text-slate-600" />
                  <p className="text-slate-500 text-sm">No recently viewed medicines.</p>
                  <Button variant="ghost" className="mt-2 text-cyan-400" onClick={() => onNavigate("pharmacy")}>
                    Go to Pharmacy
                  </Button>
                </div>
              ) : (
                recentlyViewed.map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                      <AlertCircle className="w-6 h-6 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{item.strength}</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate("pharmacy")}
                      className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Modals */}
      <IOSSelectModal
        isOpen={showBloodGroupModal}
        onClose={() => setShowBloodGroupModal(false)}
        title="Select Blood Group"
        options={bloodGroups}
        onSelect={(val) => {
          setMedicalData({ ...medicalData, bloodGroup: val });
          setShowBloodGroupModal(false);
        }}
        selectedValue={medicalData.bloodGroup}
      />
      <IOSSelectModal
        isOpen={showGenderModal}
        onClose={() => setShowGenderModal(false)}
        title="Select Gender"
        options={genderOptions}
        onSelect={(val) => {
          setMedicalData({ ...medicalData, gender: val });
          setShowGenderModal(false);
        }}
        selectedValue={medicalData.gender}
      />
      <IOSSelectModal
        isOpen={showRelationModal}
        onClose={() => setShowRelationModal(false)}
        title="Select Relationship"
        options={relationOptions}
        onSelect={(val) => {
          setMedicalData({ ...medicalData, emergencyContactRelation: val });
          setShowRelationModal(false);
        }}
        selectedValue={medicalData.emergencyContactRelation}
      />
      <ConfirmationModal
        isOpen={showClearDataConfirm}
        title="Clear All Data"
        message="This will permanently delete your triage history."
        confirmLabel="Delete Everything"
        onConfirm={handleClearData}
        onCancel={() => setShowClearDataConfirm(false)}
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
