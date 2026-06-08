import React, { useState, useRef, useEffect } from 'react';
import { WorkstationState } from './types';
import { DEFAULT_WORKSTATION_STATE } from './data/presets';
import FlatlayStage from './components/FlatlayStage';
import ControlPanel from './components/ControlPanel';
import { toPng } from 'html-to-image';
import { 
  Sparkles, Feather, Volume2, VolumeX, Info, HelpCircle, 
  Github, Camera, Check, AlertCircle, HeartCrack, ChevronRight
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<WorkstationState>(DEFAULT_WORKSTATION_STATE);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Sound/Vibe Section: Procedural Binaural Rainfall Synth (Web Audio API)
  const [isRainActive, setIsRainActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3800);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleStateChange = (patch: Partial<WorkstationState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  // Binaural Rainfall Synthesizer in pure Web Audio API (No files, zero latency)
  const toggleRainAudio = () => {
    try {
      if (isRainActive) {
        // Stop current nodes
        if (sourceNodeRef.current) {
          sourceNodeRef.current.stop();
          sourceNodeRef.current.disconnect();
          sourceNodeRef.current = null;
        }
        setIsRainActive(false);
        triggerToast("Sokin yomg'ir ovozi to'xtatildi", "info");
      } else {
        // Initialize AudioContext lazily on user tap (browser restriction bypass)
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Generate deep brown noise buffer to simulate warm heavy garden rain
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Brownian integration filter
          output[i] = (lastOut + (0.022 * white)) / 1.022;
          lastOut = output[i];
          output[i] *= 3.8; // Boost structural amplitude
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        // Apply high-quality lowpass filter for deep muffled rainstorms
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(420, ctx.currentTime);

        // Apply shelf-filter for pleasant low-end rumble
        const bassShelf = ctx.createBiquadFilter();
        bassShelf.type = 'lowshelf';
        bassShelf.frequency.setValueAtTime(100, ctx.currentTime);
        bassShelf.gain.setValueAtTime(4, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.09, ctx.currentTime); // Cozy subtle level

        // Chain connections
        source.connect(lowpass);
        lowpass.connect(bassShelf);
        bassShelf.connect(gain);
        gain.connect(ctx.destination);

        source.start();
        sourceNodeRef.current = source;
        gainNodeRef.current = gain;
        setIsRainActive(true);
        triggerToast("Sokin yomg'ir shovqini yoqildi 🌿🌧️", "success");
      }
    } catch (err) {
      console.error("Audio synthesiser issue:", err);
      triggerToast("Audio tizim yuklanishda xato berdi", "error");
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const element = document.getElementById('flatlay-canvas-container');
    if (!element) {
      triggerToast("Keletriladigan ekran topilmadi", "error");
      setIsDownloading(false);
      return;
    }

    try {
      // Extra delay for UI elements to settle
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2.5, // Crisp high-definition
        style: {
          transform: 'scale(1)',
          borderRadius: '0',
        },
      });

      const link = document.createElement('a');
      link.download = `val-asr-studio-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      triggerToast("Rasm muvaffaqiyatli yuklab olindi! ✨📜", "success");
    } catch (error) {
      console.error("Snapshot error:", error);
      triggerToast("Rasmni saqlab bo'lmadi. Qayta urinib ko'ring.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen natural-viewport text-[#4a453f] font-sans flex flex-col justify-between selection:bg-[#8a8175]/25 selection:text-[#4a453f]">
      
      {/* =======================================
          DESKTOP UPPER BAR & CONTROLS
          ======================================= */}
      <header className="border-b border-[#dfd6c6] bg-[#fbf9f4]/85 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#8a8175]/10 border border-[#8a8175]/25 rounded-xl flex items-center justify-center text-[#5c4033] font-serif font-bold text-lg shadow-inner">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-display tracking-[0.1em] font-medium text-[#4a453f] uppercase">
                Val Asr Studio
              </h1>
              <span className="bg-[#dfd6c6]/50 text-[#5c4033] text-[9px] px-2 py-0.5 rounded-full font-mono border border-[#dfd6c6]">
                v1.1 Workshop
              </span>
            </div>
            <p className="text-[10px] text-[#796e62] font-sans font-light">Artisanal Flatlay Photograph & Typography Composer</p>
          </div>
        </div>

        {/* Ambient controls and info */}
        <div className="flex items-center gap-3">
          {/* Zen Rain Toggle */}
          <button
            onClick={toggleRainAudio}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-display transition-all duration-300 ${
              isRainActive 
                ? 'bg-emerald-900/10 text-emerald-800 border-emerald-800/30 shadow-sm animate-pulse' 
                : 'bg-[#fcfaf5]/80 border-[#dfd6c6] text-[#796e62] hover:text-[#4a453f] hover:bg-[#dfd6c6]/30'
            }`}
            title="Soothing Spring Rain Ambient Generator"
          >
            {isRainActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Yomg'ir Ovozi: Yoqilgan</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#8a8175]" />
                <span>Yomg'ir Ovozi: O'chirilgan</span>
              </>
            )}
          </button>

          {/* Guidelines info */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2 bg-[#fcfaf5]/80 hover:bg-[#dfd6c6]/30 text-[#796e62] hover:text-[#4a453f] border border-[#dfd6c6] rounded-xl transition shadow-sm"
            title="Loyiha haqida ma'lumot"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* =======================================
          CORE WORKSPACE LAYOUT
          ======================================= */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* Left Side: Live Photographic Flatlay Stage Preview (Takes 7 Cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center">
          <div className="w-full max-w-[550px] lg:max-w-none relative">
            
            {/* Visual stage frame surrounding */}
            <div className="p-3.5 bg-[#f5ede2] border border-[#dfd6c6] rounded-[2rem] shadow-xl shadow-[#4a453f]/10">
              <FlatlayStage 
                state={state} 
                onChange={handleStateChange}
                stageId="flatlay-canvas-container"
              />
            </div>

            {/* Quick interactive floating tutorial */}
            <div className="mt-3 text-center">
              <p className="text-[11px] text-[#796e62] font-sans italic">
                Sahnadagi <span className="text-[#8a8175] font-semibold">Kalligrafik qalam</span> va <span className="text-[#8a8175] font-semibold">O'tlarni</span> o‘zingiz xohlagan joyga tortib qo‘yishingiz mumkin.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Workstation Controllers (Takes 5 Cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col items-stretch h-full min-h-[500px] lg:min-h-0">
          <ControlPanel 
            state={state} 
            onChange={handleStateChange} 
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
        </div>

      </main>

      {/* =======================================
          FOOTER COPYRIGHT
          ======================================= */}
      <footer className="border-t border-[#dfd6c6] bg-[#fbf9f4]/40 py-4 px-6 text-center text-[10.5px] text-[#8a8175] font-display uppercase tracking-wider flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          Loyihalashtirildi: <span className="text-[#5c4033] font-mono">val_asr_studio</span> — {new Date().getFullYear()}
        </div>
        <div className="flex items-center gap-4">
          <span>Zen minimalizm fotografiyasi</span>
          <span>•</span>
          <span>Barcha huquqlar himoyalangan</span>
        </div>
      </footer>

      {/* =======================================
          TOAST NOTIFICATION MODAL
          ======================================= */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#fbf9f5] border border-[#dfd6c6] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm w-[90%] transition-all animate-bounce text-[#4a453f]">
          {toastType === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : toastType === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span className="text-xs font-sans leading-relaxed text-[#4a453f]">{toastMessage}</span>
        </div>
      )}

      {/* =======================================
          INFO / GUIDELINES MODAL
          ======================================= */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-[#c9bcac]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#fbf9f4] border border-[#dfd6c6] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-[#4a453f]">
            <div className="flex justify-between items-start border-b border-[#dfd6c6] pb-3">
              <div>
                <span className="text-[10px] font-display uppercase tracking-widest text-[#8a8175] font-semibold">Sokin San'at Makoni</span>
                <h3 className="font-serif text-xl font-medium text-[#5c4033]">Val Asr Studio Atelyesi</h3>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-[#8a8175] hover:text-[#4a453f] transform hover:rotate-90 transition duration-300 text-lg font-mono p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-4 leading-relaxed text-[#796e62] font-sans">
              <p>
                <strong>Val Asr Studio</strong> — bu raqamli minimalizm va milliy sharqona estetika birlashgan maxsus flat-lay tahrirlovchisidir. U orqali siz o‘zingizning sevimli sheriy va falsafiy satrlaringizga haqiqiy qo‘lda tayyorlangan qog‘oz va matolar kayfiyatini bera olasiz.
              </p>
              
              <div className="p-3 bg-[#e8e2d5]/60 rounded-xl space-y-2 border border-[#dfd6c6]">
                <span className="font-display font-semibold text-[#5c4033] text-[11px] block">Asosiy imkoniyatlar:</span>
                <ul className="list-disc pl-4 space-y-1.5 text-[#5e554a]">
                  <li><strong>Qo'lda quyilgan qog'ozlar:</strong> CSS SVG displacement shaderlaridan foydalanib qog'oz chetining haqiqiy tolali, notekis (deckled edge) bo'lishini ta'minlash.</li>
                  <li><strong>Tashqi soya o'yinlari:</strong> Derazadan tushadigan to'siq g'ildiraklari, soya qalamlari yoki tropik daraxt nurlari.</li>
                  <li><strong>Haqiqiy tahrir:</strong> Sahnadagi har bir jismni sichqoncha yordamida erkin surish va burchagini sozlash.</li>
                  <li><strong>Sokin Muhit:</strong> Web Audio API yordamida ishlash paytida sizni charchatmaydigan, tinchlantiruvchi spring rain - sokin yomg'ir ovozini tinglash imkoniyati.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="font-display uppercase tracking-wider text-[10px] text-[#8a8175] block">Dastlabki Hikmat Tarjimasi:</span>
                <blockquote className="border-l-2 border-[#8a8175] pl-3 italic text-[11.5px] text-[#4a453f] leading-relaxed font-serif bg-[#e8e2d5]/30 p-2 rounded">
                  "Qayg‘uga botganingda tushkunlikka tushma. Eng qimmat xazinalar eng qorong‘i g‘orlarda yashiringan bo‘ladi. Hayotingdagi har bir sinov seni kuchliroq va dono qilish uchun kelgan. val_asr_studio"
                </blockquote>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#dfd6c6]">
              <button
                onClick={() => setShowInfoModal(false)}
                className="bg-[#8a8175] hover:bg-[#796e62] text-white font-display text-xs px-4 py-2.5 rounded-xl transition shadow"
              >
                Tushunarli (Yopish)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
