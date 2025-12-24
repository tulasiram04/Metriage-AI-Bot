import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { Triage } from './views/Triage';
import { Reports } from './views/Reports';
import { About } from './views/About';
import { Pharmacy, Medicine, MEDICINES } from './views/Pharmacy';
import { MedicineDetail } from './views/MedicineDetail';
import { Profile } from './views/Profile';
import { Onboarding } from './views/Onboarding';
import { ViewState, HistoryItem } from './types';
import { CartDrawer } from './components/CartDrawer';
import { initializeUserSession, isProfileComplete, UserData } from './services/userSession';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  // Do not block initial render while session initializes.
  // `sessionInitializing` allows rendering the app immediately and showing a non-blocking indicator.
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInitializing, setSessionInitializing] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [odessa, setOdessa] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('medtriage_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Cart State
  const [cartItems, setCartItems] = useState<(Medicine & { quantity: number })[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);

  // Initialize session on app load
  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    setSessionInitializing(true);
    try {
      const { odessa: userId, user, isNew } = await initializeUserSession();
      setOdessa(userId);
      setUserData(user);

      // Check if profile is complete
      if (isNew || !isProfileComplete(user)) {
        setShowOnboarding(true);
      } else {
        setShowOnboarding(false);
      }
    } catch (e) {
      console.error('Session init error', e);
    } finally {
      setIsLoading(false);
      setSessionInitializing(false);
    }
  };

  const handleOnboardingComplete = (user: UserData) => {
    setUserData(user);
    setShowOnboarding(false);
    setCurrentView('home');
  };

  useEffect(() => {
    localStorage.setItem('medtriage_history', JSON.stringify(history));
  }, [history]);

  // Simple pathname <-> view mapping
  const viewToPath: Record<ViewState, string> = {
    home: '/',
    triage: '/triage',
    reports: '/reports',
    about: '/about',
    pharmacy: '/pharmacy',
    orders: '/orders',
    profile: '/profile',
    login: '/login',
    medicineDetail: '/medicine',
  };

  const pathToView = (path: string): ViewState => {
    const p = path.split('?')[0];
    const entry = (Object.keys(viewToPath) as ViewState[]).find(v => viewToPath[v] === p);
    return entry || 'home';
  };

  useEffect(() => {
    setCurrentView(pathToView(window.location.pathname));
    const onPop = () => setCurrentView(pathToView(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const desired = viewToPath[currentView] || '/';
    if (window.location.pathname !== desired) {
      window.history.pushState({}, '', desired);
    }
  }, [currentView]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleTriageComplete = (item: HistoryItem) => {
    setHistory(prev => [...prev, item]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Cart Handlers
  const addToCart = (medicine: Medicine) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = () => {
    alert('Checkout Successful! (Demo)');
    setCartItems([]);
    setIsCartOpen(false);
    setCurrentView('pharmacy');
  };

  const handleMedicineSelect = (medicineId: string) => {
    setSelectedMedicineId(medicineId);
    setCurrentView('medicineDetail');
  };

  const selectedMedicine = selectedMedicineId ? MEDICINES.find(m => m.id === selectedMedicineId) : null;

  // The app always renders a valid UI; show a small top banner while session initializes.

  // Show onboarding for new users
  if (showOnboarding && odessa) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-950 via-[#051e22] to-slate-950 opacity-80" />
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-cyan-500/10 blur-[120px] animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-600/10 blur-[120px] animate-blob animation-delay-2000" />
        </div>
        <div className="relative z-10">
          <Onboarding odessa={odessa} onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white`}>
      {/* Non-blocking initialization banner */}
      {sessionInitializing && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800/80 text-slate-100 px-4 py-2 rounded shadow">
          Initializing MedTriage AI...
        </div>
      )}
      {/* Video Theme Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-950 via-[#051e22] to-slate-950 opacity-80" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-cyan-500/10 blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-600/10 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header currentView={currentView} onNavigate={setCurrentView} />

        {/* Floating Cart Button */}
        {cartItems.length > 0 && !isCartOpen && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 md:right-10 z-[40] bg-cyan-600 text-white p-4 rounded-full shadow-lg shadow-cyan-500/30 hover:scale-110 transition-transform flex items-center gap-2 animate-bounce-in"
          >
            <span className="font-bold">{cartItems.reduce((a, c) => a + c.quantity, 0)}</span>
            <span>items</span>
          </button>
        )}

        <main className="flex-grow container mx-auto px-4 py-8">
          {currentView === 'home' && <Home onStart={() => setCurrentView('triage')} onNavigate={setCurrentView} />}
          {currentView === 'triage' && (
            <Triage onComplete={handleTriageComplete} userData={userData} />
          )}
          {currentView === 'reports' && <Reports history={history} onClear={clearHistory} />}
          {currentView === 'about' && <About />}
          {currentView === 'pharmacy' && <Pharmacy onAddToCart={addToCart} cartItemCount={cartItems.length} onMedicineSelect={handleMedicineSelect} />}
          {currentView === 'medicineDetail' && selectedMedicine && (
            <MedicineDetail 
              medicine={selectedMedicine} 
              onBack={() => setCurrentView('pharmacy')} 
              onAddToCart={addToCart} 
            />
          )}
          {currentView === 'profile' && <Profile onNavigate={setCurrentView} />}
        </main>

        <Footer />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}

export default App;
