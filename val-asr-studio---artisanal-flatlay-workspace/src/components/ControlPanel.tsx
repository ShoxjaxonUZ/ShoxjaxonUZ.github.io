import React, { useState } from 'react';
import { WorkstationState, FontStyle, BackingStyle, PaperColor, EdgeStyle, ShadowType, WashiTapeStyle, FlowerAccents } from '../types';
import { WORKSTATION_PRESETS } from '../data/presets';
import { QUOTE_COLLECTION, Quote } from '../data/quotes';
import { 
  Torus, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Pen, ScrollText, Image as ImageIcon, Sun, Sparkles, Feather,
  Compass, Download, Copy, RefreshCw, Layers, Check, ArrowRight
} from 'lucide-react';

interface ControlsProps {
  state: WorkstationState;
  onChange: (patch: Partial<WorkstationState>) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export default function ControlPanel({ state, onChange, onDownload, isDownloading }: ControlsProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'text' | 'surface' | 'lighting' | 'props'>('presets');
  const [quoteCategory, setQuoteCategory] = useState<'All' | 'Tasavvuf' | 'Hikmat' | 'Sokinlik' | 'She’riyat' | 'Modern'>('All');
  const [copiedText, setCopiedText] = useState(false);

  // Filter quotes block
  const filteredQuotes = quoteCategory === 'All' 
    ? QUOTE_COLLECTION 
    : QUOTE_COLLECTION.filter(q => q.category === quoteCategory);

  const handleSelectQuote = (quote: Quote) => {
    onChange({
      quoteText: quote.text,
      authorText: quote.author,
      watermarkText: quote.author === 'val_asr_studio' ? 'val_asr_studio' : `${quote.author} • val_asr_studio`
    });
  };

  const handleRandomQuote = () => {
    const rIdx = Math.floor(Math.random() * QUOTE_COLLECTION.length);
    handleSelectQuote(QUOTE_COLLECTION[rIdx]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(state.quoteText + ` — ${state.authorText}`);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="bg-[#fbf9f4] border border-[#dfd6c6] rounded-3xl p-6 flex flex-col justify-between h-full shadow-xl shadow-[#4a453f]/5 overflow-y-auto text-[#4a453f]">
      {/* Workstation Header */}
      <div>
        <div className="flex justify-between items-start border-b border-[#dfd6c6] pb-5 mb-5">
          <div>
            <div className="text-[10px] font-display font-semibold uppercase tracking-[0.25em] text-[#8a8175] flex items-center gap-1.5 mb-11.. mb-1">
              <Sparkles className="w-3 h-3 text-[#8a8175] animate-pulse" />
              Raqamli Flatlay Atelyesi
            </div>
            <h1 className="font-serif text-2xl text-[#5c4033] font-medium tracking-tight">
              Val Asr Studio
            </h1>
          </div>
          
          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-[#8a8175]/10 text-[#5c4033] border border-[#dfd6c6] font-display font-medium py-2 px-3.5 rounded-xl hover:bg-[#8a8175]/25 active:scale-95 disabled:opacity-50 transition text-xs shadow-sm"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Yuklanmoqda...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Snapshot PNG
              </>
            )}
          </button>
        </div>

        {/* Tab Headers */}
        <div className="grid grid-cols-5 gap-1.5 bg-[#e8e2d5]/40 p-1.5 rounded-xl mb-6 border border-[#dfd6c6]">
          {[
            { id: 'presets', icon: Compass, label: 'Shablon' },
            { id: 'text', icon: Feather, label: 'Matn' },
            { id: 'surface', icon: Layers, label: 'Qog‘oz' },
            { id: 'lighting', icon: Sun, label: 'Yorug‘lik' },
            { id: 'props', icon: ScrollText, label: 'Uskunalar' },
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 ${
                  isSel 
                    ? 'bg-[#8a8175] text-[#fcfaf5] shadow-inner border border-[#8a8175]' 
                    : 'text-[#796e62] hover:text-[#4a453f] hover:bg-[#dfd6c6]/25'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-display uppercase tracking-wider">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =======================================
            TAB CONTENTS
            ======================================= */}
        
        {/* TAB 1: PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[#5c4033] text-xs font-display uppercase tracking-wider mb-2.5 flex items-center gap-2 font-semibold">
                <Compass className="w-4 h-4 text-[#8a8175]" />
                Foto-Shablon Tanlash (Image Presets)
              </h2>
              <p className="text-[11px] text-[#796e62] mb-4 leading-relaxed font-sans">
                Yuklangan reference rasmlariga (Image 0-8) moslashtirilgan bir-bosqichli estetik shablonlardan birini tanlang.
              </p>
              
              <div className="grid grid-cols-1 gap-2.5">
                {WORKSTATION_PRESETS.map((preset) => {
                  const isSel = WORKSTATION_PRESETS.every(() => {
                    return state.backing === preset.state.backing && state.paperColor === preset.state.paperColor;
                  }) || (preset.id === 'preset-dried-botanicals' && state.flowerStyle === 'babys-breath' && state.backing === 'linen');

                  return (
                    <button
                      key={preset.id}
                      onClick={() => onChange(preset.state)}
                      className={`flex items-start text-left gap-4 p-3.5 rounded-xl border transition-all duration-300 hover:bg-[#dfd6c6]/20 ${
                        isSel && state.backing === preset.state.backing
                          ? 'bg-[#dfd6c6]/55 border-[#8a8175] text-[#5c4033] shadow-md shadow-[#4a453f]/5'
                          : 'bg-[#fcfaf5]/80 border-[#dfd6c6] text-[#4a453f]'
                      }`}
                    >
                      {/* Image badge placeholder representing image reference */}
                      <div className="h-10 w-10 shrink-0 bg-[#e8e2d5] rounded-lg flex items-center justify-center border border-[#dfd6c6] uppercase font-mono text-[9px] text-[#5c4033] font-bold shadow-sm">
                        {preset.imageRef.replace('_', ' ')}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-display font-semibold text-[#5c4033] flex items-center gap-1.5">
                          {preset.name}
                          {isSel && state.backing === preset.state.backing && (
                            <span className="h-1.5 w-1.5 bg-[#8a8175] rounded-full" />
                          )}
                        </div>
                        <div className="text-[10px] text-[#796e62] leading-normal line-clamp-2">
                          {preset.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Helper to generate matching mood */}
            <div className="bg-[#e8e2d5]/30 border border-[#dfd6c6] p-3.5 rounded-xl">
              <span className="text-[11px] font-display font-semibold text-[#5c4033] flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8a8175]" />
                Estetik Dizayn Maslahati
              </span>
              <p className="text-[10px] text-[#796e62] leading-relaxed font-sans">
                Kunduzgi quyosh nurlari va qog‘oz burchagi <span className="text-[#5c4033] font-medium">(-3° dan +3° gacha)</span> birgalikda eng tabiiy fotografik kayfiyatni hosil qiladi. Props bo‘limidagi uskunalar koordinatasini live preview ustida surib tahrirlashingiz mumkin.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: TEXT COMPOSER */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            {/* Input fields */}
            <div className="space-y-2">
              <label className="text-[11px] font-display uppercase tracking-wider text-[#796e62] flex justify-between items-center">
                <span className="font-semibold text-[#5c4033]">Hikmatli so‘zni kiritish</span>
                <span className="text-[9px] text-[#8a8175] lowercase">{state.quoteText.length} belgi</span>
              </label>
              <textarea
                value={state.quoteText}
                onChange={e => onChange({ quoteText: e.target.value })}
                className="w-full h-24 bg-[#fcfaf5] text-[#4a453f] p-3 rounded-xl border border-[#dfd6c6] focus:border-[#8a8175] focus:ring-1 focus:ring-[#8a8175] text-xs font-sans leading-relaxed resize-none shadow-inner"
                placeholder="Rasmda chop etiladigan hikmatli gapni yozing..."
              />
            </div>

            {/* Typography adjustments */}
            <div className="space-y-4 pt-2 border-t border-[#dfd6c6]">
              <div className="grid grid-cols-2 gap-4">
                {/* Font selector */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-display uppercase tracking-wider text-[#796e62] block font-semibold">Shrift turi</span>
                  <select
                    value={state.fontStyle}
                    onChange={e => onChange({ fontStyle: e.target.value as FontStyle })}
                    className="w-full bg-[#fcfaf5] text-[#4a453f] border border-[#dfd6c6] rounded-lg p-1.5 text-xs focus:outline-none focus:border-[#8a8175]"
                  >
                    <option value="serif">Classic Serif</option>
                    <option value="typewriter">Typewriter Clean</option>
                    <option value="grungy-typewriter">Typewriter Organic</option>
                    <option value="signature">Calligraphy Signature</option>
                    <option value="sans">Minimalist Sans</option>
                  </select>
                </div>

                {/* Text Alignment */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-display uppercase tracking-wider text-[#796e62] block font-semibold">Tekislash</span>
                  <div className="grid grid-cols-4 gap-1 p-0.5 bg-[#fcfaf5] rounded-lg border border-[#dfd6c6]">
                    {([
                      { id: 'left', icon: AlignLeft },
                      { id: 'center', icon: AlignCenter },
                      { id: 'right', icon: AlignRight },
                      { id: 'justify', icon: AlignJustify }
                    ] as const).map(align => {
                      const Icon = align.icon;
                      const isSel = state.textAlignment === align.id;
                      return (
                        <button
                          key={align.id}
                          onClick={() => onChange({ textAlignment: align.id })}
                          className={`py-1 flex items-center justify-center rounded transition ${
                            isSel ? 'bg-[#8a8175] text-white shadow-sm' : 'text-[#8a8175] hover:text-[#4a453f]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Slider variables */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                    <span>Hajm (Size)</span>
                    <span className="text-[#5c4033] font-medium">{state.fontSize}px</span>
                  </div>
                  <input
                    type="range" min="14" max="36" step="1"
                    value={state.fontSize}
                    onChange={e => onChange({ fontSize: parseInt(e.target.value) })}
                    className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                    <span>Satr oralig‘i</span>
                    <span className="text-[#5c4033] font-medium">{state.lineHeight}x</span>
                  </div>
                  <input
                    type="range" min="1.1" max="2.2" step="0.05"
                    value={state.lineHeight}
                    onChange={e => onChange({ lineHeight: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                    <span>Belgilar orasi</span>
                    <span className="text-[#5c4033] font-medium">{state.letterSpacing}em</span>
                  </div>
                  <input
                    type="range" min="-0.04" max="0.12" step="0.01"
                    value={state.letterSpacing}
                    onChange={e => onChange({ letterSpacing: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                    <span>Siyoh to‘qligi</span>
                    <span className="text-[#5c4033] font-medium">{Math.round(state.inkOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.4" max="1" step="0.05"
                    value={state.inkOpacity}
                    onChange={e => onChange({ inkOpacity: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                  />
                </div>
              </div>

              {/* Signature Branding Options */}
              <div className="bg-[#fcfaf5] p-3 rounded-xl border border-[#dfd6c6] space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-display uppercase tracking-wider text-[#5c4033] font-semibold">
                    Studio Watermark / Imzo
                  </span>
                  <input
                    type="checkbox"
                    checked={state.showWatermark}
                    onChange={e => onChange({ showWatermark: e.target.checked })}
                    className="form-checkbox text-[#8a8175] bg-white border-[#dfd6c6] rounded focus:ring-0 cursor-pointer"
                  />
                </div>
                {state.showWatermark && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={state.watermarkText}
                      onChange={e => onChange({ watermarkText: e.target.value })}
                      className="bg-[#fbf9f4] text-[#4a453f] border border-[#dfd6c6] rounded-lg p-1.5 text-[11px] focus:outline-none col-span-2 shadow-inner"
                      placeholder="Imzo matni (masalan val_asr_studio)"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Spiritual Quotes Selector section */}
            <div className="border-t border-[#dfd6c6] pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-display uppercase tracking-wider text-[#5c4033] font-semibold flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-[#8a8175]" />
                  Milliy Hikmatlar to‘plami
                </span>
                <button
                  onClick={handleRandomQuote}
                  className="text-[#796e62] hover:text-[#5c4033] text-[10px] flex items-center gap-1 font-display transition"
                >
                  <RefreshCw className="w-3 h-3 text-[#8a8175]" />
                  Tasodifiy gap
                </button>
              </div>

              {/* Category headers */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
                {['All', 'Tasavvuf', 'Hikmat', 'Sokinlik', 'She’riyat'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setQuoteCategory(cat as any)}
                    className={`px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap transition border ${
                      quoteCategory === cat 
                        ? 'bg-[#8a8175] text-[#fcfaf5] border-[#8a8175] shadow-sm' 
                        : 'bg-[#fcfaf5] text-[#796e62] border-[#dfd6c6] hover:bg-[#dfd6c6]/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Quotes scrolling list */}
              <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 text-[10.5px]">
                {filteredQuotes.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuote(q)}
                    className="w-full text-left p-2 rounded-lg bg-[#fcfaf5] hover:bg-[#dfd6c6]/20 border border-[#dfd6c6] flex flex-col gap-1 text-[#796e62] hover:text-[#4a453f] transition shadow-sm"
                  >
                    <span className="line-clamp-1 italic">"{q.text}"</span>
                    <span className="text-[9px] text-[#8a8175] font-display font-medium">— {q.author}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SURFACE & CARD */}
        {activeTab === 'surface' && (
          <div className="space-y-5">
            {/* 1. Backdrop */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-display uppercase tracking-wider text-[#5c4033] font-semibold flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-[#8a8175]" />
                Matoli Fon (Background Surface)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'linen', label: 'Eshilgan Zig‘ir (Linen)', desc: 'Rustic oatmeal linen' },
                  { id: 'silk', label: 'Pillali Ipak (Silk)', desc: 'Smooth champagne drapery' },
                  { id: 'corrugated', label: 'Gofra Karton (Clay)', desc: 'Warm terracota ridges' },
                  { id: 'burlap', label: 'Daraxt burlap (Burlap)', desc: 'Coarse dark sackcloth' },
                  { id: 'slate', label: 'Vulkan tosh (Slate)', desc: 'Coarse sand-grout gray' },
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => onChange({ backing: b.id as BackingStyle })}
                    className={`p-2.5 text-left rounded-xl border flex flex-col gap-1 transition ${
                      state.backing === b.id
                        ? 'bg-[#dfd6c6]/50 border-[#8a8175] text-[#5c4033] shadow-md shadow-[#4a453f]/5'
                        : 'bg-[#fcfaf5] border-[#dfd6c6] text-[#796e62] hover:text-[#4a453f]'
                    }`}
                  >
                    <span className="text-xs font-display font-semibold block">{b.label}</span>
                    <span className="text-[9px] opacity-60 font-sans">{b.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Paper Color Selection */}
            <div className="space-y-2.5 pt-3 border-t border-[#dfd6c6]">
              <span className="text-[11px] font-display uppercase tracking-wider text-[#5c4033] font-semibold flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#8a8175]" />
                Qog‘oz rangi (Paper Stock)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ivory-cotton', label: 'Suf Ivory', hex: '#f7f3eb' },
                  { id: 'watercolor-white', label: 'Watercolor', hex: '#fcfbfa' },
                  { id: 'recycled-kraft', label: 'Kraft Sand', hex: '#e6d8c3' },
                  { id: 'tea-parchment', label: 'Tea Aged', hex: '#f3e5ca' },
                  { id: 'charcoal-slate', label: 'Obisidian', hex: '#303236' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => onChange({ paperColor: p.id as PaperColor })}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1.5 text-center transition ${
                      state.paperColor === p.id
                        ? 'bg-[#dfd6c6]/50 border-[#8a8175] text-[#5c4033] shadow-md'
                        : 'bg-[#fcfaf5] border-[#dfd6c6] text-[#796e62] hover:text-[#4a453f]'
                    }`}
                  >
                    <div className="h-5 w-8 rounded border border-[#dfd6c6] shadow-sm" style={{ backgroundColor: p.hex }} />
                    <span className="text-[9px] font-display font-medium uppercase tracking-wide leading-tight">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Paper Edges (Mechanical displacement matching Image 8 vs 6) */}
            <div className="space-y-2.5 pt-3 border-t border-[#dfd6c6]">
              <span className="text-[11px] font-display uppercase tracking-wider text-[#5c4033] font-semibold">
                Qog‘oz qirrasi (Roughness Type)
              </span>
              <div className="grid grid-cols-3 gap-2 bg-[#fcfaf5] p-1.5 rounded-xl border border-[#dfd6c6] shadow-inner animate-fade-in">
                {[
                  { id: 'heavy', label: 'Deckled' },
                  { id: 'mild', label: 'Torn Edge' },
                  { id: 'none', label: 'Clean Cut' },
                ].map(e => (
                  <button
                    key={e.id}
                    onClick={() => onChange({ edgeStyle: e.id as EdgeStyle })}
                    className={`py-1.5 rounded-lg text-center text-xs font-display font-medium transition ${
                      state.edgeStyle === e.id
                        ? 'bg-[#8a8175] text-[#fcfaf5] shadow-inner'
                        : 'text-[#8a8175] hover:text-[#4a453f]'
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Fine Spatial Position Control */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-[#dfd6c6]">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                  <span>Qog‘oz qiyaligi</span>
                  <span className="text-[#5c4033] font-medium">{state.paperTilt}°</span>
                </div>
                <input
                  type="range" min="-12" max="12" step="0.5"
                  value={state.paperTilt}
                  onChange={e => onChange({ paperTilt: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                  <span>Qog‘oz o'lchami</span>
                  <span className="text-[#5c4033] font-medium">{Math.round(state.paperScale * 100)}%</span>
                </div>
                <input
                  type="range" min="0.7" max="1.1" step="0.02"
                  value={state.paperScale}
                  onChange={e => onChange({ paperScale: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                  <span>Soya kuchi</span>
                  <span className="text-[#5c4033] font-medium">{Math.round(state.paperShadowOpacity * 100)}%</span>
                </div>
                <input
                  type="range" min="0.05" max="0.3" stroke-width="0.01" step="0.01"
                  value={state.paperShadowOpacity}
                  onChange={e => onChange({ paperShadowOpacity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                  <span>Soya yoyilishi</span>
                  <span className="text-[#5c4033] font-medium">{state.paperShadowBlur}px</span>
                </div>
                <input
                  type="range" min="8" max="40" step="2"
                  value={state.paperShadowBlur}
                  onChange={e => onChange({ paperShadowBlur: parseInt(e.target.value) })}
                  className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIGHTING & ATMOSPHERE */}
        {activeTab === 'lighting' && (
          <div className="space-y-5">
            {/* 1. Window Light pattern selector */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-display uppercase tracking-wider text-[#5c4033] font-semibold flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-[#8a8175]" />
                Tashqi Yorug‘lik Soya Shablonlari
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'window', label: 'Pane Grid (Image 0/3)', desc: 'Diagonal side window box' },
                  { id: 'foliage', label: 'Organic Leaves', desc: 'Swaying branch stems' },
                  { id: 'blinds', label: 'Venetian Slats', desc: 'Parallel shutter shadow lines' },
                  { id: 'noontime', label: 'High Direct Sun', desc: 'Sharp contrast side glow' },
                  { id: 'soft-ambient', label: 'Diffused Soft Glow', desc: 'Mild vignetted ambient shadow' },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => onChange({ shadowType: s.id as ShadowType })}
                    className={`p-2.5 text-left rounded-xl border flex flex-col gap-1 transition ${
                      state.shadowType === s.id
                        ? 'bg-[#dfd6c6]/50 border-[#8a8175] text-[#5c4033] shadow-md shadow-[#4a453f]/5'
                        : 'bg-[#fcfaf5] border-[#dfd6c6] text-[#796e62] hover:text-[#4a453f]'
                    }`}
                  >
                    <span className="text-xs font-display font-semibold block">{s.label}</span>
                    <span className="text-[9px] opacity-60 font-sans leading-tight">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Environmental warmth & Intensity sliders */}
            <div className="space-y-4 pt-3 border-t border-[#dfd6c6]">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                  <span>Zulmat/Soya To‘qligi (Opacity)</span>
                  <span className="text-[#5c4033] font-medium">{Math.round(state.shadowOpacity * 100)}%</span>
                </div>
                <input
                  type="range" min="0" max="0.65" step="0.02"
                  value={state.shadowOpacity}
                  onChange={e => onChange({ shadowOpacity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                    <span>Soya burchagi</span>
                    <span className="text-[#5c4033] font-medium">{state.shadowAngle}°</span>
                  </div>
                  <input
                    type="range" min="-90" max="90" step="5"
                    value={state.shadowAngle}
                    onChange={e => onChange({ shadowAngle: parseInt(e.target.value) })}
                    className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                    <span>Soya o'lchami</span>
                    <span className="text-[#5c4033] font-medium">{state.shadowScale}x</span>
                  </div>
                  <input
                    type="range" min="0.6" max="1.8" step="0.05"
                    value={state.shadowScale}
                    onChange={e => onChange({ shadowScale: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#dfd6c6]">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                    <span>Sunset Warmth (Sariq)</span>
                    <span className="text-[#5c4033] font-medium">{Math.round(state.atmosphereWarmth * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="0.4" step="0.02"
                    value={state.atmosphereWarmth}
                    onChange={e => onChange({ atmosphereWarmth: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                    <span>Atrof yorug‘ligi</span>
                    <span className="text-[#5c4033] font-medium">{state.ambientLight}%</span>
                  </div>
                  <input
                    type="range" min="65" max="135" step="1"
                    value={state.ambientLight}
                    onChange={e => onChange({ ambientLight: parseInt(e.target.value) })}
                    className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACCESSORIES / PROPS */}
        {activeTab === 'props' && (
          <div className="space-y-5">
            {/* 1. Washi tape toggles */}
            <div className="bg-[#fcfaf5] p-4 rounded-xl border border-[#dfd6c6] space-y-3 shadow-sm">
              <span className="text-[11px] font-display uppercase tracking-wider text-[#5c4033] font-semibold block mb-1">
                Lenta Yopishtirish (Washi Tape)
              </span>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'beige-kraft', label: 'Beige Kraft' },
                  { id: 'sage-green', label: 'Sage Wash' },
                  { id: 'charcoal-slate', label: 'Obsidian Matte' },
                  { id: 'transparent-paper', label: 'Transparent' },
                  { id: 'none', label: 'Yo‘q (None)' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => onChange({ washiTape: t.id as WashiTapeStyle })}
                    className={`py-2 text-[11px] font-display font-medium rounded-lg transition border text-center ${
                      state.washiTape === t.id
                        ? 'bg-[#8a8175] text-[#fcfaf5] border-[#8a8175] shadow-sm'
                        : 'bg-[#fcfaf5] border-[#dfd6c6] text-[#796e62] hover:bg-[#dfd6c6]/20'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {state.washiTape !== 'none' && (
                <div className="space-y-1.5 pt-2 border-t border-[#dfd6c6]">
                  <span className="text-[10px] text-[#796e62] font-display uppercase tracking-wide font-semibold">Yopishtirish Joylashuvi</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'top-center', label: 'Top Center' },
                      { id: 'top-left-angle', label: 'Top Left' },
                      { id: 'double-corners', label: 'Two Corners' },
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => onChange({ washiTapePosition: p.id as any })}
                        className={`py-1 text-[9px] font-display font-medium rounded transition ${
                          state.washiTapePosition === p.id 
                            ? 'bg-[#8a8175] text-[#fcfaf5] shadow-sm' 
                            : 'bg-[#fbf9f4] border border-[#dfd6c6] text-[#796e62]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Dried flowers & calligraphy pen togglers */}
            <div className="space-y-3 pt-3 border-t border-[#dfd6c6]">
              <span className="text-[11px] font-display uppercase tracking-wider text-[#5c4033] font-semibold block pb-1">
                Aksesuarlar (Dried Flowers & Writing Tools)
              </span>

              {/* Wooden Pen */}
              <div className="p-3 bg-[#fcfaf5] rounded-xl border border-[#dfd6c6] flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs font-display font-semibold text-[#5c4033] block">Kalligrafik Yog‘och Qalam (Image 7)</span>
                  <span className="text-[9px] text-[#796e62] font-sans font-light">Wooden drawing ink pen lying beside page</span>
                </div>
                <input
                  type="checkbox"
                  checked={state.hasCalligraphyPen}
                  onChange={e => onChange({ hasCalligraphyPen: e.target.checked })}
                  className="form-checkbox text-[#8a8175] bg-white border-[#dfd6c6] focus:ring-0 rounded"
                />
              </div>

              {state.hasCalligraphyPen && (
                <div className="p-3 bg-[#fcfaf5] rounded-xl border border-[#dfd6c6] grid grid-cols-2 gap-4 shadow-inner">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                      <span>Rotor / Qiyalik</span>
                      <span className="text-[#5c4033] font-medium">{state.penRotation}°</span>
                    </div>
                    <input
                      type="range" min="-180" max="180" step="5"
                      value={state.penRotation}
                      onChange={e => onChange({ penRotation: parseInt(e.target.value) })}
                      className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                      <span>Qalam hajmi</span>
                      <span className="text-[#5c4033] font-medium">{Math.round(state.penScale * 100)}%</span>
                    </div>
                    <input
                      type="range" min="0.75" max="1.25" step="0.05"
                      value={state.penScale}
                      onChange={e => onChange({ penScale: parseFloat(e.target.value) })}
                      className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                    />
                  </div>
                </div>
              )}

              {/* Botanical choice dropdown */}
              <div className="p-3.5 bg-[#fcfaf5] rounded-xl border border-[#dfd6c6] space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-display font-semibold text-[#5c4033] block">Qurigan Gullar / O‘tli dasta (Image 8)</span>
                    <span className="text-[9px] text-[#796e62] font-sans">Artfully arranged minimalist floral twigs</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#fbf9f4] rounded-lg border border-[#dfd6c6]">
                  {[
                    { id: 'babys-breath', label: 'Baby Breath' },
                    { id: 'lavender-sprig', label: 'Lavender' },
                    { id: 'olive-leaves', label: 'Olive Branch' },
                    { id: 'none', label: 'None' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => onChange({ flowerStyle: f.id as FlowerAccents })}
                      className={`py-1 rounded text-[10px] font-display font-medium transition text-center ${
                        state.flowerStyle === f.id
                          ? 'bg-[#8a8175] text-white shadow-sm'
                          : 'text-[#8a8175] hover:text-[#4a453f]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {state.flowerStyle !== 'none' && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#dfd6c6] shadow-inner p-2 rounded-lg bg-[#fbf9f4]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                        <span>Gul burchagi</span>
                        <span className="text-[#5c4033] font-medium">{state.flowerRotation}°</span>
                      </div>
                      <input
                        type="range" min="-180" max="180" step="5"
                        value={state.flowerRotation}
                        onChange={e => onChange({ flowerRotation: parseInt(e.target.value) })}
                        className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] uppercase font-display text-[#796e62]">
                        <span>Gul o'lchami</span>
                        <span className="text-[#5c4033] font-medium">{Math.round(state.flowerScale * 100)}%</span>
                      </div>
                      <input
                        type="range" min="0.6" max="1.3" step="0.05"
                        value={state.flowerScale}
                        onChange={e => onChange({ flowerScale: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-[#dfd6c6] rounded-lg appearance-none cursor-pointer accent-[#8a8175]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Copy & Export specifications */}
      <div className="border-t border-[#dfd6c6] pt-5 mt-5 space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center gap-2 bg-[#fcfaf5] text-[#5c4033] hover:text-[#4a453f] hover:bg-[#dfd6c6]/20 border border-[#dfd6c6] py-2.5 rounded-xl text-xs active:scale-95 transition shadow-sm font-medium"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                Matn ko‘chirildi!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#8a8175]" />
                Matnni nusxalash
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#8a8175] font-display font-medium">
          <span>Qurilma o‘lchami: Responsive canvas</span>
          <span className="text-[#5c4033] font-mono">val_asr_studio</span>
        </div>
      </div>
    </div>
  );
}
