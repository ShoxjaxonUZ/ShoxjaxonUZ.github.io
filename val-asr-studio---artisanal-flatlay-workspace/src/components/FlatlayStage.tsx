import React, { useRef } from 'react';
import { WorkstationState, Pos2D } from '../types';
import { PenTool, Sparkles } from 'lucide-react';

interface StageProps {
  state: WorkstationState;
  onChange: (patch: Partial<WorkstationState>) => void;
  stageId: string;
}

export default function FlatlayStage({ state, onChange, stageId }: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  // Set up Pointer Drag for accents (Calligraphy Pen and Dried Flowers)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, target: 'pen' | 'flower') => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Request pointer capture to ensure smooth tracking even if finger/mouse leaves bounding boxes
    e.currentTarget.setPointerCapture(e.pointerId);
    
    const handlePointerMove = (moveEv: PointerEvent) => {
      const x = ((moveEv.clientX - rect.left) / rect.width) * 100;
      const y = ((moveEv.clientY - rect.top) / rect.height) * 100;
      
      // Keep within bounds
      const clampedX = Math.round(Math.max(-10, Math.min(110, x)));
      const clampedY = Math.round(Math.max(-10, Math.min(110, y)));
      
      if (target === 'pen') {
        onChange({ penPos: { x: clampedX, y: clampedY } });
      } else {
        onChange({ flowerPos: { x: clampedX, y: clampedY } });
      }
    };
    
    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Build appropriate classes based on state
  const getBackingClass = () => {
    switch (state.backing) {
      case 'burlap': return 'burlap-bg';
      case 'corrugated': return 'corrugated-bg';
      case 'slate': return 'slate-bg';
      case 'silk': return 'silk-bg';
      case 'linen':
      default: return 'linen-bg';
    }
  };

  const getPaperColorHex = () => {
    switch (state.paperColor) {
      case 'recycled-kraft': return '#e6d8c3'; // warm oatmeal sand
      case 'watercolor-white': return '#fcfbfa'; // crisp textured white
      case 'charcoal-slate': return '#303236'; // deep slate matte
      case 'tea-parchment': return '#f3e5ca'; // antiqued parchment
      case 'ivory-cotton':
      default: return '#f7f3eb'; // standard raw ivory cotton
    }
  };

  const getPaperTextColor = () => {
    if (state.paperColor === 'charcoal-slate') {
      return '#eae6de'; // ivory white text on dark
    }
    return state.textColor;
  };

  const getFontStyleClass = () => {
    switch (state.fontStyle) {
      case 'typewriter': return 'font-typewriter';
      case 'grungy-typewriter': return 'font-grungy-typewriter';
      case 'signature': return 'font-signature';
      case 'sans': return 'font-display font-light uppercase tracking-[0.15em]';
      case 'serif':
      default: return 'font-serif';
    }
  };

  // Convert letterSpacing which is in fraction of em
  const getLetterSpacingClass = () => {
    if (state.fontStyle === 'sans') return ''; // already wider
    if (state.letterSpacing > 0.08) return 'tracking-widest';
    if (state.letterSpacing > 0.04) return 'tracking-wider';
    if (state.letterSpacing < -0.02) return 'tracking-tight';
    return 'tracking-normal';
  };

  return (
    <div className="relative w-full aspect-[4/5] md:aspect-[3/4] xl:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl select-none" ref={stageRef}>
      {/* SVG DEFS for Deckled displacement filters */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="deckled-turbulence">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="deckled-turbulence-mild">
            <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Main Backing Surface Container */}
      <div 
        id={stageId}
        className={`relative w-full h-full ${getBackingClass()} flex items-center justify-center transition-all duration-500 overflow-hidden noise-overlay`}
        style={{
          filter: `brightness(${state.ambientLight}%)`,
        }}
      >
        {/* Atmosphere color tint overlay */}
        <div 
          className="absolute inset-0 bg-amber-600/10 mix-blend-color-burn transition-all duration-300 pointer-events-none"
          style={{ opacity: state.atmosphereWarmth }}
        />

        {/* =======================================
            PAPER CARD COMPOUND LAYERS
            ======================================= */}
        <div 
          className="relative w-[78%] h-[72%] flex items-center justify-center transition-all duration-500"
          style={{
            transform: `rotate(${state.paperTilt}deg) scale(${state.paperScale})`,
          }}
        >
          {/* Deckled Edge Shadow underlay (matches paper roughness) */}
          <div 
            className={`absolute inset-3 pointer-events-none transition-all duration-300 ${
              state.edgeStyle === 'heavy' ? 'deckled-filter' : state.edgeStyle === 'mild' ? 'deckled-filter-mild' : ''
            }`}
            style={{
              backgroundColor: '#000000',
              opacity: state.paperShadowOpacity,
              filter: `blur(${state.paperShadowBlur}px)`,
              transform: `translate(${state.paperShadowBlur / 2.5}px, ${state.paperShadowBlur * 1.2}px)`,
            }}
          />

          {/* Actual Card Body */}
          <div 
            className={`relative w-full h-full p-8 md:p-12 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
              state.edgeStyle === 'heavy' ? 'deckled-filter' : state.edgeStyle === 'mild' ? 'deckled-filter-mild' : ''
            }`}
            style={{
              backgroundColor: getPaperColorHex(),
            }}
          >
            {/* Cotton fiber texture simulation overlay */}
            <div className="absolute inset-0 opacity-[0.12] bg-repeat pointer-events-none mix-blend-multiply" 
                 style={{ 
                   backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="paper-noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23paper-noise)"/%3E%3C/svg%3E')` 
                 }} 
            />

            {/* Corner tea water-stains / vignette for aged colors */}
            {(state.paperColor === 'tea-parchment' || state.paperColor === 'recycled-kraft') && (
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-amber-900/10 opacity-70 pointer-events-none mix-blend-multiply" />
            )}

            {/* Washi Tape (if absolute top-center) */}
            {state.washiTape !== 'none' && state.washiTapePosition === 'top-center' && (
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[45%] h-7 w-28 opacity-85 transition-all duration-300 deckled-filter-mild shadow-sm z-30"
                style={{
                  backgroundColor: getWashiColor(state.washiTape),
                  transform: `translateX(-50%) translateY(-35%) rotate(${-1.5}deg)`,
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  backgroundImage: state.washiTape === 'transparent-paper' ? 'none' : 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 10px, transparent 10px, transparent 20px)'
                }}
              />
            )}

            {/* Washi Tape Double Corners (top-left & bottom-right angle style) */}
            {state.washiTape !== 'none' && state.washiTapePosition === 'double-corners' && (
              <>
                <div 
                  className="absolute top-[3%] left-[3%] h-6 w-20 opacity-80 transition-all duration-300 deckled-filter-mild shadow-sm z-30"
                  style={{
                    backgroundColor: getWashiColor(state.washiTape),
                    transform: `rotate(-38deg) translate(-25%, -15%)`,
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                  }}
                />
                <div 
                  className="absolute bottom-[3%] right-[3%] h-6 w-20 opacity-80 transition-all duration-300 deckled-filter-mild shadow-sm z-30"
                  style={{
                    backgroundColor: getWashiColor(state.washiTape),
                    transform: `rotate(-38deg) translate(25%, 15%)`,
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                  }}
                />
              </>
            )}

            {/* Quote Typography Grid */}
            <div className="flex-1 flex flex-col justify-center items-center py-4 relative z-10 w-full h-full">
              <blockquote 
                className={`w-full ${getFontStyleClass()} ${getLetterSpacingClass()} transition-all duration-300`}
                style={{
                  fontSize: `${state.fontSize}px`,
                  lineHeight: state.lineHeight,
                  textAlign: state.textAlignment,
                  color: getPaperTextColor(),
                  opacity: state.inkOpacity,
                  letterSpacing: state.fontStyle === 'sans' ? undefined : `${state.letterSpacing}em`
                }}
              >
                {state.quoteText || "Raqamni kiriting yoki unvondan tanlang."}
              </blockquote>
            </div>

            {/* Bottom Signature / Watermark Section */}
            {state.showWatermark && (
              <div 
                className="w-full flex justify-center items-center border-t border-dashed relative z-10 pt-4 mt-2"
                style={{
                  borderColor: state.paperColor === 'charcoal-slate' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
                }}
              >
                <span 
                  className="font-display font-light text-[10px] uppercase transition-all duration-300 opacity-60 text-center tracking-[0.2em]"
                  style={{
                    color: getPaperTextColor(),
                    letterSpacing: `${state.watermarkSpacing}em`
                  }}
                >
                  — {state.watermarkText || "val_asr_studio"} —
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =======================================
            ACCENTS LAYER (Calligraphy Pen, Flowers, etc.)
            ======================================= */}

        {/* Washi Tape (Single Tilted Top-Left from edge, style matching Image 5/6) */}
        {state.washiTape !== 'none' && state.washiTapePosition === 'top-left-angle' && (
          <div 
            className="absolute opacity-85 transition-all duration-300 deckled-filter-mild shadow-sm z-20"
            style={{
              backgroundColor: getWashiColor(state.washiTape),
              width: '110px',
              height: '24px',
              left: '11%',
              top: '11%',
              transform: 'rotate(-40deg)',
              borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}
          />
        )}

        {/* Wooden Calligraphy Pen Accent (Image 7 style) */}
        {state.hasCalligraphyPen && (
          <div 
            onPointerDown={(e) => handlePointerDown(e, 'pen')}
            className="absolute z-40 cursor-grab active:cursor-grabbing group select-none transition-shadow"
            style={{
              left: `${state.penPos.x}%`,
              top: `${state.penPos.y}%`,
              transform: `translate(-50%, -50%) rotate(${state.penRotation}deg) scale(${state.penScale})`,
            }}
            title="Surg'ichdan ushlab suring (Click-to-drag)"
          >
            {/* Visual Highlight indicator on hover */}
            <div className="absolute -inset-4 border border-dashed border-amber-800/10 rounded-full scale-0 group-hover:scale-100 transition-all duration-300 flex items-center justify-center">
              <span className="text-[9px] font-mono text-amber-900 bg-amber-50 px-1 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-80 translate-y-8">
                Qalamni suring
              </span>
            </div>

            {/* Classical Wooden Pen Nib Drawing in SVG */}
            <svg width="220" height="14" viewBox="0 0 220 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[2px_14px_6px_rgba(0,0,0,0.22)]">
              {/* Wooden Pen Stem */}
              <path d="M40 3h165c2.5 0 3 1.5 3 4s-0.5 4-3 4H40c-2.5 0-4-0.8-5-2V5c1-1.2 2.5-2 5-2z" fill="#784725" />
              <path d="M40 3.5h165c1.2 0 1.5 0.5 1.5 2V5c0-1-0.3-1.5-1.5-1.5H40c-1.5 0-2 0.3-2.5 1.5v-0.5c.5-1 1-1 2.5-1z" fill="#a06032" /> {/* highlight */}
              <circle cx="202" cy="7" r="1.5" fill="#3a1c06" />

              {/* Wooden tapered tip */}
              <path d="M40 3l-18 4 18 4V3z" fill="#d9b48f" />
              <path d="M22 7l18-4v1z" fill="#ead4be" />

              {/* Metal Ferrule */}
              <rect x="204" y="3" width="10" height="8" fill="#bc8f30" />
              <rect x="207" y="3" width="1" height="8" fill="#9c7015" />
              <rect x="211" y="3" width="1" height="8" fill="#9c7015" />

              {/* Steel Calligraphy Pen Nib */}
              <path d="M22 7l-15-2.5c-2-.3-3 .5-3 2.5s1 2.8 3 2.5L22 7z" fill="#bcbcbc" />
              <path d="M22 7H4" stroke="#717171" strokeWidth="0.5" /> {/* Nib Split slit */}
              <circle cx="9" cy="7" r="0.7" fill="#3e3e3e" /> {/* breather hole */}
              <path d="M22 7l-15-2.5c-.5-.08-.8-.05-1.2.5L22 7z" fill="#eaeaea" /> {/* nib highlight */}
              <path d="M3.5 6.5l.5.5-.5.5c-.5-.2-.5-.8 0-1z" fill="#1e1e1e" /> {/* ink at the tip */}
            </svg>
          </div>
        )}

        {/* Dried Flower Accents (such as Baby's Breath, Lavender, Olive Stems) */}
        {state.flowerStyle !== 'none' && (
          <div 
            onPointerDown={(e) => handlePointerDown(e, 'flower')}
            className="absolute z-40 cursor-grab active:cursor-grabbing group select-none"
            style={{
              left: `${state.flowerPos.x}%`,
              top: `${state.flowerPos.y}%`,
              transform: `translate(-50%, -50%) rotate(${state.flowerRotation}deg) scale(${state.flowerScale})`,
            }}
            title="Guldastani ushlab suring (Click-to-drag)"
          >
            {/* Visual Highlight indicator on hover */}
            <div className="absolute -inset-6 border border-dashed border-emerald-900/10 rounded-full scale-0 group-hover:scale-100 transition-all duration-300 flex items-center justify-center">
              <span className="text-[9px] font-mono text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-80 translate-y-12">
                O'simlikni suring
              </span>
            </div>

            {/* Baby's Breath Vector (Image 8 style) */}
            {state.flowerStyle === 'babys-breath' && (
              <svg width="150" height="150" viewBox="0 0 150 150" fill="none" className="drop-shadow-[4px_16px_8px_rgba(0,0,0,0.18)]">
                {/* Main brown/beige delicate twigs */}
                <path d="M10 140 C 25 110, 48 85, 60 70" stroke="#7d6a57" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M45 88 C 50 72, 70 60, 75 42" stroke="#8d7a67" strokeWidth="0.8" strokeLinecap="round" />
                <path d="M52 79 C 62 70, 85 64, 90 50" stroke="#8d7a67" strokeWidth="0.8" strokeLinecap="round" />
                <path d="M30 110 C 45 92, 55 88, 62 81" stroke="#8d7a67" strokeWidth="0.9" strokeLinecap="round" />
                
                {/* Fine twig sub-divisions */}
                <path d="M75 42 C 73 30, 80 20, 82 12" stroke="#9e8a77" strokeWidth="0.5" />
                <path d="M75 42 C 85 35, 92 30, 102 24" stroke="#9e8a77" strokeWidth="0.5" />
                <path d="M90 50 C 95 40, 108 38, 120 32" stroke="#9e8a77" strokeWidth="0.5" />
                <path d="M90 50 C 100 55, 115 52, 125 48" stroke="#9e8a77" strokeWidth="0.5" />
                <path d="M60 70 C 65 60, 58 48, 55 35" stroke="#9e8a77" strokeWidth="0.6" />

                {/* Delicate warm white dotted blossoms */}
                {/* Sprig 1 center-top */}
                <circle cx="82" cy="12" r="3.5" fill="#fcf6ec" stroke="#dfdcd6" strokeWidth="0.4" />
                <circle cx="84" cy="11" r="1.5" fill="#ffffff" />
                <circle cx="78" cy="15" r="2.5" fill="#f5eedf" />

                {/* Sprig 2 top-right */}
                <circle cx="102" cy="24" r="3" fill="#fcf6ec" stroke="#dfdcd6" strokeWidth="0.4" />
                <circle cx="106" cy="21" r="2.5" fill="#f9f2e5" />
                <circle cx="98" cy="26" r="2" fill="#faf4eb" />

                {/* Sprig 3 far-right */}
                <circle cx="120" cy="32" r="3.2" fill="#fcf6ec" stroke="#dfdcd6" strokeWidth="0.4" />
                <circle cx="124" cy="29" r="1.8" fill="#ffffff" />
                <circle cx="122" cy="36" r="2.5" fill="#f3ebd9" />
                <circle cx="115" cy="31" r="2" fill="#f5ebd6" />

                {/* Sprig 4 center-right */}
                <circle cx="125" cy="48" r="3.5" fill="#fcf6ec" stroke="#dfdcd6" strokeWidth="0.4" />
                <circle cx="128" cy="51" r="2" fill="#faf4eb" />
                <circle cx="122" cy="45" r="2.8" fill="#efe4cc" />

                {/* Sprig 5 mid-left */}
                <circle cx="55" cy="35" r="3" fill="#fcf6ec" stroke="#dfdcd6" strokeWidth="0.4" />
                <circle cx="51" cy="32" r="2.2" fill="#f5ecd5" />
                <circle cx="58" cy="38" r="2" fill="#fdfaf3" />

                {/* Sprig Clusters randomly spread */}
                <circle cx="68" cy="55" r="2.5" fill="#faf5ec" />
                <circle cx="81" cy="32" r="2.5" fill="#fcf7ee" />
                <circle cx="94" cy="44" r="3" fill="#faf2e5" />
              </svg>
            )}

            {/* Lavender Sprig Vector */}
            {state.flowerStyle === 'lavender-sprig' && (
              <svg width="120" height="150" viewBox="0 0 120 150" fill="none" className="drop-shadow-[4px_16px_8px_rgba(0,0,0,0.16)]">
                {/* Stem */}
                <path d="M20 140 C 35 110, 50 70, 55 25" stroke="#5d6653" strokeWidth="1.3" strokeLinecap="round" />
                
                {/* Lavender buds wrapping the stem (soft lavender purple tone) */}
                {/* Bottom cluster */}
                <path d="M43 95c1-3, 5-4, 7-2s1, 5-1, 7-6, 1-7-1c-1-2 0-3 1-4z" fill="#756bb1" opacity="0.8" />
                <path d="M49 97c2-2, 6-1, 6, 2s-3, 4-5, 3-3-3-1-5z" fill="#9e9ac8" opacity="0.9" />
                
                {/* Mid clusters */}
                <path d="M44 75c3-2, 6-1, 7, 2s-1, 5-4, 5-4-3-3-7z" fill="#756bb1" opacity="0.85" />
                <path d="M52 72c1-3, 5-3, 6-1s-1, 5-3, 5-4-1-3-4z" fill="#807dba" opacity="0.9" />
                <path d="M48 81c2-1, 4, 1, 3, 3s-3, 1-3-1 0-2 0-3z" fill="#bcbddc" opacity="0.95" />

                <path d="M47 55c2-3, 5-3, 7-1s0, 5-2, 6-6, 0-5-5z" fill="#6a51a3" opacity="0.85" />
                <path d="M54 52c1-3, 4-2, 5, 1s-2, 4-4, 3-2-2-1-4z" fill="#807dba" opacity="0.9" />
                
                {/* Top spikes */}
                <path d="M50 36c1-2, 4-2, 5, 0s-1, 4-3, 4-3-2-2-4z" fill="#6a51a3" />
                <path d="M55 33c1-2, 3-2, 4, 0s-1, 3-3, 3-3-1-2-3z" fill="#807dba" />
                <path d="M52 24c0-2, 2-2, 3 0s0, 3-2, 3-2-1-1-3z" fill="#54278f" />
                
                {/* Little green leaves */}
                <path d="M35 110c3-1, 9, 2, 11, 4s-4, 6-7, 4-6-6-4-8z" fill="#6b7c5c" />
                <path d="M42 90c-3-2-8-1-9, 2s3, 5, 6, 4, 4-3, 3-6z" fill="#7c8e6d" />
              </svg>
            )}

            {/* Olive Leaves Vector (Image 6 style) */}
            {state.flowerStyle === 'olive-leaves' && (
              <svg width="140" height="140" viewBox="0 0 140 140" fill="none" className="drop-shadow-[3px_12px_6px_rgba(0,0,0,0.14)]">
                {/* Main twig */}
                <path d="M15 15 C 30 35, 65 75, 120 120" stroke="#6b5b4b" strokeWidth="1.2" strokeLinecap="round" />
                
                {/* Opposing sage-green leaves */}
                {/* Leaf 1 left */}
                <path d="M35 38c3-12, 12-18, 18-18s-3, 14-8, 21-8, 3-10-3z" fill="#758273" opacity="0.9" />
                <path d="M36 38c1-5, 4-10, 8-13" stroke="#909e8e" strokeWidth="0.5" />
                
                {/* Leaf 2 right */}
                <path d="M48 50c12-3, 22-1, 26, 4s-10, 10-18, 9-7-9-8-13z" fill="#849182" opacity="0.85" />
                
                {/* Leaf 3 left */}
                <path d="M60 65c1-12, 8-22, 12-24s1, 15-4, 22-8, 4-9-1z" fill="#6a7768" opacity="0.9" />
                
                {/* Leaf 4 right */}
                <path d="M72 78c12-4, 20, 2, 22, 8s-12, 8-19, 5-4-10-5-13z" fill="#7e8c7c" opacity="0.9" />

                {/* Leaf 5 far end left */}
                <path d="M90 95c0-10, 6-18, 10-19s2, 12-2, 18-7, 2-8-1z" fill="#849182" opacity="0.85" />

                {/* Small unripe green olive hanging */}
                <circle cx="58" cy="60" r="3.5" fill="#4a523a" />
                <circle cx="59" cy="59" r="1" fill="#798263" /> {/* olive highlight */}
              </svg>
            )}
          </div>
        )}

        {/* =======================================
            ATMOSPHERIC WINDOW SUNLIGHT SHADOWS OVERLAY
            ======================================= */}
        {state.shadowOpacity > 0 && (
          <div 
            className="absolute inset-0 shadow-overlay mix-blend-multiply transition-all duration-500"
            style={{
              opacity: state.shadowOpacity,
              transform: `rotate(${state.shadowAngle}deg) scale(${state.shadowScale})`,
            }}
          >
            {/* Window Frame Pane Grid Shadow (Image 0 & 3 style) */}
            {state.shadowType === 'window' && (
              <div className="absolute inset-0 flex flex-col justify-between p-[5%]">
                <div className="w-full h-[40%] bg-zinc-950/20 flex justify-between">
                  <div className="w-[45%] h-full bg-zinc-950/20" />
                  <div className="w-[45%] h-full bg-zinc-950/20" />
                </div>
                <div className="w-full h-[40%] bg-zinc-950/20 flex justify-between">
                  <div className="w-[45%] h-full bg-zinc-950/20" />
                  <div className="w-[45%] h-full bg-zinc-950/20" />
                </div>
              </div>
            )}

            {/* Venecian Blinds Shadows (Horizontal Bars) */}
            {state.shadowType === 'blinds' && (
              <div className="absolute -inset-x-20 -inset-y-40 flex flex-col justify-between">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div key={idx} className="w-full h-8 bg-black/35" />
                ))}
              </div>
            )}

            {/* Organic Foliage Leaves / Tropical Palm Branches Shadow */}
            {state.shadowType === 'foliage' && (
              <div className="absolute inset-0 bg-transparent flex items-start justify-end p-4">
                <svg width="100%" height="100%" viewBox="0 0 400 400" fill="black" opacity="0.35" className="blur-[12px] transform scale-125 translate-x-12 -translate-y-12">
                  {/* Stem and leafy shadows */}
                  <path d="M400 0 C 350 40, 250 120, 100 250" stroke="black" strokeWidth="15" strokeLinecap="round" />
                  {/* Leaves */}
                  <path d="M100 250 C 90 220, 50 180, 20 200 C 0 220, 40 260, 100 250" />
                  <path d="M150 200 C 130 150, 90 120, 70 140 C 60 160, 90 200, 150 200" />
                  <path d="M210 160 C 190 100, 140 80, 120 100 C 100 120, 140 160, 210 160" />
                  <path d="M280 110 C 260 50, 210 30, 190 50 C 170 70, 210 110, 280 110" />
                  <path d="M340 70 C 330 10, 290 0, 270 10 C 250 30, 280 70, 340 70" />
                  
                  {/* Offshoot branch */}
                  <path d="M210 160 C 230 180, 200 240, 140 300" stroke="black" strokeWidth="8" />
                  <path d="M140 300 C 120 280, 80 260, 60 280 C 40 300, 90 320, 140 300" />
                  <path d="M170 250 C 150 210, 110 200, 90 220 C 70 240, 120 270, 170 250" />
                </svg>
              </div>
            )}

            {/* Direct High Noon Shadow (simple side vignetting/gradient) */}
            {state.shadowType === 'noontime' && (
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)',
                  filter: 'blur(4px)'
                }}
              />
            )}

            {/* Soft Ambient Light (very blurred large radial shadow) */}
            {state.shadowType === 'soft-ambient' && (
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 10% 20%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 120%)',
                  filter: 'blur(2px)'
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Decorative Interactive Floating Hints */}
      <div className="absolute bottom-3 left-3 bg-white/70 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-display text-neutral-800 tracking-wide border border-neutral-200 pointer-events-none flex items-center gap-1 z-50">
        <Sparkles className="w-2.5 h-2.5 text-amber-900 animate-pulse" />
        Surg'ichdan ushlang va bevosita suring
      </div>
    </div>
  );
}

// Helper to resolve Washi tape colors based on selected types
function getWashiColor(style: string): string {
  switch (style) {
    case 'charcoal-slate':
      return 'rgba(40, 42, 45, 0.45)';
    case 'sage-green':
      return 'rgba(120, 138, 123, 0.52)';
    case 'transparent-paper':
      return 'rgba(235, 225, 215, 0.3)';
    case 'beige-kraft':
    default:
      return 'rgba(191, 170, 143, 0.65)'; // warm sandy kraft tape, semi-transparent
  }
}
