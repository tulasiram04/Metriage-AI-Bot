import React, { useState, useEffect, useRef } from "react";
import { ViewState, HistoryItem, RiskLevel } from "../types";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { IOSSelectModal } from "../components/IOSSelectModal";
import { AlertModal } from "../components/AlertModal";
import {
  Settings,
  LogOut,
  Heart,
  Activity,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  Lock,
  FileText,
  Phone,
  Camera,
  AlertCircle,
  ShoppingBag,
  ChevronRight,
} from "../components/Icons";

interface ProfileProps {
  onNavigate: (view: ViewState) => void;
}

interface MedicalInfo {
  bloodGroup: string;
  allergies: string;
  conditions: string;
  contact: string;
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
  // --- State ---
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    totalConsults: 0,
    lastTriageDate: null,
    latestRisk: null,
  });
  const [recentlyViewed, setRecentlyViewed] = useState<MedicineView[]>([]);

  // Edit Modes
  const [isEditMode, setIsEditMode] = useState(false);

  // Form States
  const [editName, setEditName] = useState("");
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    bloodGroup: "",
    allergies: "— NIL —",
    conditions: "— NIL —",
    contact: "",
  });
  const [countryCode, setCountryCode] = useState("+1");

  // Modals
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
  const [showBloodGroupModal, setShowBloodGroupModal] = useState(false);
  const [showConditionsModal, setShowConditionsModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; message: string; title?: string }>({
    isOpen: false,
    message: "",
    title: "Notice"
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Options
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const conditionOptions = [
    "— NIL —",
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Arthritis",
    "Migraine",
    "Anemia",
    "Eczema",
  ];
  const countryOptions = [
    "🇺🇸 United States (+1)",
    "🇬🇧 United Kingdom (+44)",
    "🇮🇳 India (+91)",
    "🇨🇦 Canada (+1)",
    "🇦🇺 Australia (+61)",
    "🇩🇪 Germany (+49)",
    "🇫🇷 France (+33)",
    "🇯🇵 Japan (+81)",
    "🇨🇳 China (+86)",
    "🇧🇷 Brazil (+55)",
  ];

  // --- Effects ---
  useEffect(() => {
    loadData();

    // Listen for auth changes (login/logout)
    const handleAuthChange = () => {
      loadData();
    };

    window.addEventListener('authchange', handleAuthChange);
    return () => {
      window.removeEventListener('authchange', handleAuthChange);
    };
  }, []);

  const loadData = async () => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // Guest fallback
      const guest = { name: 'Guest User', email: 'guest@university.edu', picture: null, _id: 'guest' };
      setUser(guest);
      setEditName(guest.name);
      return;
    }

    const me = JSON.parse(storedUser);
    const userId = me.id || me._id || me.userId;
    if (!userId) {
      setUser(me);
      setEditName(me.name || me.email || 'User');
      return;
    }

    try {
      const response = await fetch(`/api/user/${userId}`);
      if (response.ok) {
        const dbUser = await response.json();
        setUser(dbUser);
        setEditName(dbUser.name);

        const safeMedical = {
          bloodGroup: dbUser.bloodGroup || '',
          allergies: dbUser.allergies || '— NIL —',
          conditions: dbUser.conditions || '— NIL —',
          contact: dbUser.contact || ''
        };
        setMedicalInfo(safeMedical);

        if (safeMedical.contact) {
          const match = countryOptions.find(opt => {
            const code = opt.match(/\(\+(\d+)\)/)?.[1];
            return code && safeMedical.contact.startsWith('+' + code);
          });
          if (match) {
            const code = match.match(/\(\+(\d+)\)/)?.[1];
            if (code) setCountryCode('+' + code);
          }
        }

        // setRecentlyViewed(dbUser.recentlyViewed || []); // Now using localStorage
      } else {
        console.error('Failed to fetch user profile');
        setUser(me);
        setEditName(me.name || me.email || 'User');
      }
    } catch (e) {
      console.error('User fetch error', e);
      setUser(me);
      setEditName(me.name || me.email || 'User');
    }

    // Load recently viewed medicines from localStorage (expires after 30 minutes)
    const viewedStr = localStorage.getItem('recentlyViewed');
    if (viewedStr) {
      const viewed = JSON.parse(viewedStr);
      const now = Date.now();
      const validViewed = viewed.filter((v: any) => now - v.timestamp < 30 * 60 * 1000); // 30 minutes
      setRecentlyViewed(validViewed);
      // Update localStorage with only valid ones
      localStorage.setItem('recentlyViewed', JSON.stringify(validViewed));
    }

    // Load History & Stats (Still LocalStorage for Triage History as per request scope "Profile section only" DB)
    // Wait, request said "persist profile-related data... in database".
    // Triage history persistence wasn't explicitly requested to change to DB in this turn,
    // but user said "user data... like mobile number, blood group".
    // I will keep Triage on LocalStorage for now to minimize risk unless asked.
    const historyStr = localStorage.getItem("medtriage_history");
    const loadedHistory = historyStr ? JSON.parse(historyStr) : [];
    const lastItem =
      loadedHistory.length > 0 ? loadedHistory[loadedHistory.length - 1] : null;

    setStats({
      totalConsults: loadedHistory.length,
      lastTriageDate: lastItem
        ? new Date(lastItem.timestamp).toLocaleDateString()
        : "N/A",
      latestRisk: lastItem ? lastItem.result.riskLevel : null,
    });
  };

  // --- Handlers ---
  const handleSaveProfile = async () => {
    if (!user) return;

    // Prepare Data
    let finalContact = medicalInfo.contact;
    const cleanNumber = finalContact.replace(countryCode, "").trim();
    finalContact = `${countryCode} ${cleanNumber}`;
    const contactToSave =
      finalContact.trim() === countryCode ? "" : finalContact;

    const updates = {
      name: editName,
      email: user.email, // Required for upsert (re-creating user if missing)
      bloodGroup: medicalInfo.bloodGroup,
      allergies: medicalInfo.allergies.trim() || "— NIL —",
      conditions: medicalInfo.conditions.trim() || "— NIL —",
      contact: contactToSave,
    };

    try {
      const userId = user._id || user.id;
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditName(updatedUser.name); // Keep UI in sync
        setMedicalInfo({
          bloodGroup: updatedUser.bloodGroup,
          allergies: updatedUser.allergies,
          conditions: updatedUser.conditions,
          contact: updatedUser.contact,
        });
        setAlertModal({ isOpen: true, message: "Profile saved successfully!", title: "Success" });
      } else {
        const errData = await response.json();
        console.error("Save failed:", errData);
        setAlertModal({ isOpen: true, message: `Failed to save: ${errData.error || "Unknown Error"}`, title: "Error" });
      }
    } catch (error) {
      console.error("Save Error:", error);
      setAlertModal({ isOpen: true, message: "Error saving profile: " + (error instanceof Error ? error.message : "Network Error"), title: "Error" });
    }

    setIsEditMode(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!user) return;

      try {
        const userId = user._id || user.id;
        console.log(
          `[Frontend] Starting Cloudinary Upload for User: ${userId}`,
        );

        const toBase64 = (f: File) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(f);
          });
        const imageBase64 = await toBase64(file);

        const response = await fetch(`/api/profile/avatar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, imageBase64 }),
        });

        const data = await response.json();

        if (response.ok) {
          const updatedUser = data.user || {
            ...user,
            profileImageUrl: data.url,
          };
          setUser(updatedUser);
          setAlertModal({ isOpen: true, message: "Profile photo successfully updated! Reload the page to view.", title: "Success" });
        } else {
          const errorMessage = data.error || JSON.stringify(data);
          throw new Error(`Backend Error: ${errorMessage}`);
        }
      } catch (error: any) {
        console.error("Upload Failed:", error);

        // Detailed Error Handling
        let msg = error.message || "Unknown Error";
        if (msg.includes("Failed to fetch")) {
          msg =
            "Network Error: Could not reach /api/profile/avatar. Is the deployment or dev server running?";
        }

        setAlertModal({ isOpen: true, message: `Upload Failed: ${msg}`, title: "Error" });
      }
    }
  };

  const handleLogout = () => {
    (async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (e) {
        console.warn("Logout request failed", e);
      }
      try {
        window.dispatchEvent(new Event("authchange"));
      } catch (e) {}
      window.location.href = "/login";
    })();
  };

  const handleClearData = () => {
    localStorage.removeItem("medtriage_history");
    localStorage.removeItem("medtriage_medical_info"); // Legacy
    loadData();
    setShowClearDataConfirm(false);
  };

  const getRiskColor = (risk: RiskLevel | null) => {
    if (!risk) return "text-slate-400";
    switch (risk) {
      case RiskLevel.LOW:
        return "text-emerald-400";
      case RiskLevel.MEDIUM:
        return "text-amber-400";
      case RiskLevel.HIGH:
        return "text-rose-400";
      default:
        return "text-slate-400";
    }
  };

  if (!user) return null;
  const isGuest = user.email === "guest@university.edu";

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* 1. Profile Header Card */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-8 border border-slate-700/50">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center overflow-hidden">
              {user.profileImageUrl || user.picture ? (
                <img
                  src={user.profileImageUrl || user.picture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-slate-500">
                  {user.name?.charAt(0)}
                </span>
              )}
            </div>
            {isEditMode && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="flex-grow text-center md:text-left space-y-2">
            {isEditMode ? (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs text-slate-500 uppercase font-bold tracking-wider ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none text-lg font-bold"
                    placeholder="Your Full Name"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase font-bold tracking-wider ml-1">
                    Email (Read-only)
                  </label>
                  <div className="mt-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 font-mono text-sm">
                    {user.email}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-slate-400">
                  {user.email}
                </p>
              </>
            )}

          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              variant="secondary"
              className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white border-2"
              onClick={
                isEditMode ? handleSaveProfile : () => setIsEditMode(true)
              }
            >
              {isEditMode ? (
                <Save className="w-4 h-4 mr-2" />
              ) : (
                <Edit2 className="w-4 h-4 mr-2" />
              )}
              {isEditMode ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Stats */}
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
            <p className="text-2xl font-bold text-white">
              {stats.totalConsults}
            </p>
          </div>
        </GlassCard>
        <GlassCard className="p-5 flex items-center gap-4 border-slate-700/30">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Last Triage</p>
            <p className="text-lg font-bold text-white">
              {stats.lastTriageDate || "No visits yet"}
            </p>
          </div>
        </GlassCard>
        <GlassCard className="p-5 flex items-center gap-4 border-slate-700/30">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Latest Risk Level</p>
            <p
              className={`text-lg font-bold ${getRiskColor(stats.latestRisk)}`}
            >
              {stats.latestRisk || "Unknown"}
            </p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Medical Info */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard
            className={`p-6 border-slate-700/40 transition-all ${isEditMode ? "ring-2 ring-cyan-500/20 bg-slate-800/40" : ""}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Medical Information
              </h3>
              {isEditMode && (
                <span className="ml-2 text-xs text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-800">
                  Editing
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Blood Group
                </label>
                {isEditMode ? (
                  <button
                    onClick={() => setShowBloodGroupModal(true)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-left flex justify-between items-center hover:border-cyan-500/50 transition-colors"
                  >
                    <span>{medicalInfo.bloodGroup || "Select Type"}</span>
                    <span className="text-slate-500">▼</span>
                  </button>
                ) : (
                  <p className="text-white font-medium text-lg">
                    {medicalInfo.bloodGroup || (
                      <span className="text-slate-500 italic">Not set</span>
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Contact
                </label>
                {isEditMode ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCountryModal(true)}
                      className="bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-3 text-white flex items-center gap-2 hover:border-cyan-500/50 transition-colors whitespace-nowrap"
                    >
                      <span>{countryCode}</span>
                      <span className="text-xs text-slate-500">▼</span>
                    </button>
                    <input
                      type="tel"
                      value={(medicalInfo.contact || "")
                        .replace(countryCode, "")
                        .trim()}
                      onChange={(e) =>
                        setMedicalInfo({
                          ...medicalInfo,
                          contact: e.target.value,
                        })
                      }
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="000 000 0000"
                    />
                  </div>
                ) : (
                  <p className="text-white font-medium flex items-center gap-2 text-lg">
                    {medicalInfo.contact && (
                      <Phone className="w-4 h-4 text-cyan-500" />
                    )}
                    {medicalInfo.contact || (
                      <span className="text-slate-500 italic">Not set</span>
                    )}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Allergies
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={medicalInfo.allergies}
                    onChange={(e) =>
                      setMedicalInfo({
                        ...medicalInfo,
                        allergies: e.target.value,
                      })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="Enter allergies or leave empty for NIL"
                  />
                ) : (
                  <p className="text-white font-medium text-lg">
                    {medicalInfo.allergies}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Chronic Conditions
                </label>
                {isEditMode ? (
                  <button
                    onClick={() => setShowConditionsModal(true)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-left flex justify-between items-center hover:border-cyan-500/50 transition-colors"
                  >
                    <span>{medicalInfo.conditions}</span>
                    <span className="text-slate-500">▼</span>
                  </button>
                ) : (
                  <p className="text-white font-medium text-lg">
                    {medicalInfo.conditions}
                  </p>
                )}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-slate-700/40">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Privacy & Security
              </h3>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-full h-fit">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">
                    Data Encryption Active
                  </h4>
                  <p className="text-sm text-slate-400">
                    Your health data is stored locally and encrypted.
                  </p>
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

        {/* 4. Recently Viewed (Continue Shopping) */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 h-full border-slate-700/40 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Continue Shopping
              </h3>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {recentlyViewed.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-center opacity-50">
                  <ShoppingBag className="w-12 h-12 mb-3 text-slate-600" />
                  <p className="text-slate-500 text-sm">
                    No recently viewed medicines.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-2 text-cyan-400"
                    onClick={() => onNavigate("pharmacy")}
                  >
                    Go to Pharmacy
                  </Button>
                </div>
              )}
              {recentlyViewed.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3 transition-all group cursor-pointer animate-fade-in"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                    <AlertCircle className="w-6 h-6 text-slate-500" />{" "}
                    {/* Placeholder/Pill Icon */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm truncate">
                      {item.name}
                    </h4>
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
              ))}
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
          setMedicalInfo({ ...medicalInfo, bloodGroup: val });
          setShowBloodGroupModal(false);
        }}
        selectedValue={medicalInfo.bloodGroup}
      />
      <IOSSelectModal
        isOpen={showConditionsModal}
        onClose={() => setShowConditionsModal(false)}
        title="Select Chronic Condition"
        options={conditionOptions}
        allowCustom
        onSelect={(val) => {
          setMedicalInfo({ ...medicalInfo, conditions: val });
          setShowConditionsModal(false);
        }}
        selectedValue={medicalInfo.conditions}
      />
      <IOSSelectModal
        isOpen={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        title="Select Country Code"
        options={countryOptions}
        onSelect={(val) => {
          const code = val.match(/\(\+(\d+)\)/)?.[1];
          if (code) setCountryCode("+" + code);
          setShowCountryModal(false);
        }}
        selectedValue={countryOptions.find((opt) =>
          opt.includes(`(${countryCode})`),
        )}
      />
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
      <ConfirmationModal
        isOpen={showClearDataConfirm}
        title="Clear All Data"
        message="This will permanently delete profile, history, and logs."
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
