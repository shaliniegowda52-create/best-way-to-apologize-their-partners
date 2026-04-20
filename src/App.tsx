/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Camera, HeartOff, Sparkles } from 'lucide-react';

type Screen = 'welcome' | 'game' | 'apology';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [partnerPhoto, setPartnerPhoto] = useState<string>('https://picsum.photos/seed/couple/400/400');

  return (
    <div className="min-h-screen font-sans selection:bg-pink-700 selection:text-white bg-[#0f0205] text-[#f8f1f1]">
      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <WelcomeScreen 
            photo={partnerPhoto} 
            onPhotoChange={setPartnerPhoto} 
            onNext={() => setScreen('game')} 
          />
        )}
        {screen === 'game' && (
          <GameScreen 
            onWin={() => setScreen('apology')} 
          />
        )}
        {screen === 'apology' && (
          <ApologyScreen photo={partnerPhoto} />
        )}
      </AnimatePresence>
    </div>
  );
}

function WelcomeScreen({ 
  photo, 
  onPhotoChange, 
  onNext 
}: { 
  photo: string; 
  onPhotoChange: (val: string) => void; 
  onNext: () => void; 
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onPhotoChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlPrompt = () => {
    const url = prompt("Enter your partner's photo URL:");
    if (url) onPhotoChange(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center relative"
    >
      {/* Background Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `scale(${0.5 + Math.random() * 1.5})`
            }}
          >
             <div className="heart-shape opacity-30" />
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="glass-card p-8 sm:p-12 rounded-[2.5rem] relative z-10 max-w-lg w-full shadow-2xl"
      >
        <div className="relative mb-16 flex flex-col items-center">
          <div className="relative group scale-110 sm:scale-125">
            {/* SVG Filter/Clip Definitions */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <clipPath id="heart-path" clipPathUnits="objectBoundingBox">
                  <path d="M0.5,0.15 C0.35,0 0,0 0,0.35 C0,0.65 0.5,1 0.5,1 C0.5,1 1,0.65 1,0.35 C1,0 0.65,0 0.5,0.15" />
                </clipPath>
              </defs>
            </svg>
            
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 overflow-hidden shadow-2xl heart-glow group">
              <img 
                src={photo} 
                alt="Partner" 
                className="w-full h-full object-cover heart-mask transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Pink Overlay */}
              <div className="absolute inset-0 bg-pink-500/20 mix-blend-overlay pointer-events-none" />

              {/* Overlay for hovering/clicking (for Desktop) */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex gap-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer p-3 bg-pink-500/80 backdrop-blur-md rounded-full text-white hover:bg-pink-600 transition-colors shadow-lg"
                    title="Upload Photo"
                  >
                    <Camera size={24} />
                  </button>
                  <button 
                    onClick={handleUrlPrompt}
                    className="cursor-pointer p-3 bg-pink-500/80 backdrop-blur-md rounded-full text-white hover:bg-pink-600 transition-colors shadow-lg"
                    title="Paste Image URL"
                  >
                    <Sparkles size={24} />
                  </button>
                </div>
              </div>
            </div>

            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-2 -right-4 bg-[#ff4d6d] text-white p-3 rounded-full shadow-lg heart-glow z-30"
            >
              <Heart fill="currentColor" size={24} />
            </motion.div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange} 
          />

          {/* Visible Edit Options (Good for Mobile) */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-300 flex items-center gap-2 hover:bg-pink-500/20 transition-all"
            >
              <Camera size={14} />
              Upload
            </button>
            <button 
              onClick={handleUrlPrompt}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-300 flex items-center gap-2 hover:bg-pink-500/20 transition-all"
            >
              <Sparkles size={14} />
              Photo URL
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-title text-3xl sm:text-4xl text-[#ff4d6d] font-black uppercase italic">
            Wait For Me...
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            I have something to tell you, but first, you have to find my heart. 
            Are you ready?
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="w-full py-4 bg-[#ff4d6d] text-white rounded-full font-bold shadow-[0_0_20px_rgba(255,77,109,0.4)] hover:bg-[#ff1b47] transition-all flex items-center justify-center gap-3 group text-lg"
          >
            I'm Ready
            <Heart size={20} className="group-hover:fill-white" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GameScreen({ onWin }: { onWin: () => void }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveHeart = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      const newX = Math.random() * 80 + 10; // Keeping it within bounds
      const newY = Math.random() * 80 + 10;
      
      setPosition({ x: newX, y: newY });
    };

    const interval = setInterval(moveHeart, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-screen overflow-hidden bg-[#0f0205] flex flex-col items-center justify-center"
    >
      <div className="absolute top-16 text-center pointer-events-none z-10 px-6">
        <h2 className="text-title text-3xl sm:text-5xl text-[#ff4d6d] mb-4">
          Catch Me!
        </h2>
        <p className="text-pink-300 opacity-60 font-medium tracking-widest uppercase text-xs">
          The heart is moving... don't let it escape
        </p>
      </div>

      <motion.div
        animate={{ 
          left: `${position.x}%`, 
          top: `${position.y}%` 
        }}
        transition={{ type: 'spring', damping: 12, stiffness: 60 }}
        onClick={onWin}
        whileTap={{ scale: 0.7 }}
        className="absolute cursor-pointer p-8 -translate-x-1/2 -translate-y-1/2 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-pink-500 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" />
          <Heart 
            fill="#ff4d6d" 
            className="text-[#ff4d6d] w-14 h-14 heart-glow relative z-10" 
          />
        </div>
      </motion.div>
      
      {/* Decorative floating pulses */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '110%',
            }}
            animate={{ y: '-10%', rotate: 360 }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: 'linear',
              delay: Math.random() * 5 
            }}
            className="absolute text-pink-900/30"
          >
            <Heart size={24 + Math.random() * 32} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ApologyScreen({ photo }: { photo: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f0205] relative overflow-hidden"
    >
      {/* Cinematic Pulse Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-radial from-pink-900/20 to-transparent flex items-center justify-center"
        >
          <div className="w-[80vw] h-[80vw] border-[1px] border-pink-500/10 rounded-full" />
        </motion.div>
      </div>

      <motion.div 
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="glass-card p-10 sm:p-14 rounded-[3rem] relative z-10 max-w-lg w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-500 rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-[#ff4d6d] shadow-2xl relative z-10 heart-glow">
               <img 
                src={photo} 
                alt="Partner" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-center mb-8 gap-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
              >
                <Heart className="text-[#ff4d6d] fill-[#ff4d6d] heart-glow" size={24} />
              </motion.div>
            ))}
          </div>
          
          <h2 className="font-cursive text-6xl sm:text-7xl text-[#ff4d6d] mb-8 drop-shadow-[0_0_15px_rgba(255,77,109,0.5)]">
            Sorry baby,
          </h2>
          
          <p className="text-title text-2xl sm:text-3xl text-white mb-10 leading-relaxed italic">
            Love you so much ❤️
          </p>
          
          <div className="w-12 h-1 bg-pink-500/30 mx-auto mb-10 rounded-full" />
          
          <p className="text-gray-400 text-base italic leading-loose px-2">
            "Every beat of my heart is a reminder of how much you mean to me. 
            Forgive my mistakes, and let me spend forever making it up to you."
          </p>
        </motion.div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => window.location.reload()}
        className="mt-12 text-pink-500/50 hover:text-pink-500 flex items-center gap-2 font-medium transition-colors"
      >
        <HeartOff size={18} />
        Start Again
      </motion.button>
    </motion.div>
  );
}
