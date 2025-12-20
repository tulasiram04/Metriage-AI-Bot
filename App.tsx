import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { Triage } from './views/Triage';
import { Reports } from './views/Reports';
import { About } from './views/About';
import { Pharmacy, Medicine } from './views/Pharmacy';
import { Orders } from './views/Orders';
import { Profile } from './views/Profile';
import { ViewState, HistoryItem } from './types';
import { CartDrawer } from './components/CartDrawer';
import { SignInModal } from './components/SignInModal';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('medtriage_history');
    return saved ? JSON.parse(saved) : [];
  });
  // Cart State
  const [cartItems, setCartItems] = useState<(Medicine & { quantity: number })[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Check for authentication only when needed, no global redirect

  // Default to true (Dark Mode) for the video theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    localStorage.setItem('medtriage_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    // Force dark mode class on html element
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
    // Check if user is truly signed in (has user data), not just "authenticated" (which could be Guest)
    const userStr = localStorage.getItem('medtriage_user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      setShowSignInModal(true);
      return;
    }

    alert("Checkout Successful! (Demo)");
    setCartItems([]);
    setIsCartOpen(false);
    setCurrentView('pharmacy');
  };



  return (
    <div className={`min-h-screen transition-colors duration-500 bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white`}>

      {/* Video Theme Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
        {/* Main Gradient Mesh */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-950 via-[#051e22] to-slate-950 opacity-80" />

        {/* Animated Orbs imitating the video blur */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-cyan-500/10 blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-600/10 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] animate-blob animation-delay-4000" />

        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          currentView={currentView}
          onNavigate={setCurrentView}
        />

        {/* Floating Cart Button (visible on all pages if items in cart) */}
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
          {currentView === 'home' && <Home onStart={() => setCurrentView('triage')} />}
          {currentView === 'triage' && (
            <Triage
              onComplete={handleTriageComplete}
              onAuthRequired={() => setShowSignInModal(true)}
            />
          )}
          {currentView === 'reports' && <Reports history={history} onClear={clearHistory} />}
          {currentView === 'about' && <About />}
          {currentView === 'pharmacy' && <Pharmacy onAddToCart={addToCart} cartItemCount={cartItems.length} />}
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

        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSignIn={() => window.location.href = 'login.html'}
        />
      </div>
    </div>
  );
}

export default App;