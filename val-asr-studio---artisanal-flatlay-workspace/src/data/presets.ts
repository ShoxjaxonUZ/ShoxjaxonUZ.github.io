import { WorkstationState, Preset } from '../types';

export const DEFAULT_WORKSTATION_STATE: WorkstationState = {
  quoteText: "Qayg‘uga botganingda tushkunlikka tushma. Eng qimmat xazinalar eng qorong‘i g‘orlarda yashiringan bo‘ladi. Hayotingdagi har bir sinov seni kuchliroq va dono qilish uchun kelgan.",
  authorText: "val_asr_studio",
  fontStyle: 'serif',
  fontSize: 22,
  letterSpacing: 0.02, // em
  lineHeight: 1.6,
  textAlignment: 'center',
  textColor: '#2E2D2B', // elegant charcoal
  inkOpacity: 0.85,

  // Background/Backing
  backing: 'linen',
  atmosphereWarmth: 0.15, // warm window feeling
  ambientLight: 100, // 100%

  // Paper/Card
  paperColor: 'ivory-cotton',
  edgeStyle: 'heavy',
  paperTilt: -1.5, // slight tilt
  paperScale: 1.0,
  paperShadowBlur: 24,
  paperShadowOpacity: 0.14,

  // Shadow/Sunlight
  shadowType: 'window',
  shadowOpacity: 0.28,
  shadowAngle: -15,
  shadowScale: 1.0,

  // Accents & Accessories
  washiTape: 'beige-kraft',
  washiTapePosition: 'top-center',
  flowerStyle: 'babys-breath',
  flowerPos: { x: 74, y: 78 },
  flowerRotation: 25,
  flowerScale: 0.9,
  hasCalligraphyPen: false,
  penPos: { x: 15, y: 50 },
  penRotation: -12,
  penScale: 1.0,

  // Watermark
  watermarkText: "val_asr_studio",
  showWatermark: true,
  watermarkSpacing: 0.3, // tracking wide
};

export const WORKSTATION_PRESETS: Preset[] = [
  {
    id: 'preset-dried-botanicals',
    name: 'Dried Botanicals',
    description: 'White deckled paper on natural cream linen, soft window panes, baby’s breath sprigs at the bottom and serif script.',
    imageRef: 'image_8',
    state: {
      backing: 'linen',
      paperColor: 'watercolor-white',
      edgeStyle: 'heavy',
      paperTilt: 0,
      washiTape: 'none',
      shadowType: 'window',
      shadowOpacity: 0.3,
      shadowAngle: -20,
      flowerStyle: 'babys-breath',
      flowerPos: { x: 70, y: 76 },
      flowerRotation: 20,
      flowerScale: 0.95,
      hasCalligraphyPen: false,
      fontStyle: 'serif',
      fontSize: 21,
      lineHeight: 1.65,
      textAlignment: 'center',
      textColor: '#2D2C2A',
      inkOpacity: 0.8,
      atmosphereWarmth: 0.12,
    }
  },
  {
    id: 'preset-calligrapher-desk',
    name: 'Pen & Grout Parchment',
    description: 'Recycled oatmeal paper, dark slate backing, a classic handcraft calligraphy ink pen resting alongside without tape.',
    imageRef: 'image_7',
    state: {
      backing: 'slate',
      paperColor: 'recycled-kraft',
      edgeStyle: 'mild',
      paperTilt: 1.5,
      washiTape: 'none',
      shadowType: 'soft-ambient',
      shadowOpacity: 0.2,
      flowerStyle: 'none',
      hasCalligraphyPen: true,
      penPos: { x: 12, y: 45 },
      penRotation: -20,
      penScale: 1.05,
      fontStyle: 'grungy-typewriter',
      fontSize: 20,
      lineHeight: 1.5,
      textAlignment: 'left',
      textColor: '#252422',
      inkOpacity: 0.9,
      atmosphereWarmth: 0.2,
    }
  },
  {
    id: 'preset-ribbed-clay',
    name: 'Clay Corrugated Minimalist',
    description: 'Rustic terracota pleated backdrop with ivory stock paper fixed by a semi-transparent adhesive tape.',
    imageRef: 'image_5',
    state: {
      backing: 'corrugated',
      paperColor: 'ivory-cotton',
      edgeStyle: 'none',
      paperTilt: 0,
      washiTape: 'transparent-paper',
      washiTapePosition: 'top-center',
      shadowType: 'noontime',
      shadowOpacity: 0.35,
      flowerStyle: 'none',
      hasCalligraphyPen: false,
      fontStyle: 'typewriter',
      fontSize: 23,
      lineHeight: 1.55,
      textAlignment: 'center',
      textColor: '#32312F',
      inkOpacity: 0.85,
      atmosphereWarmth: 0.1,
    }
  },
  {
    id: 'preset-satin-shadows',
    name: 'Silk Drapery Shadows',
    description: 'Luminous champagne silk waves with raw, dramatic sunlight column frames slicing diagonally.',
    imageRef: 'image_0',
    state: {
      backing: 'silk',
      paperColor: 'tea-parchment',
      edgeStyle: 'heavy',
      paperTilt: -3,
      washiTape: 'none',
      shadowType: 'foliage',
      shadowOpacity: 0.45,
      shadowAngle: -35,
      flowerStyle: 'none',
      hasCalligraphyPen: false,
      fontStyle: 'signature',
      fontSize: 28,
      lineHeight: 1.4,
      textAlignment: 'center',
      textColor: '#26241F',
      inkOpacity: 0.7,
      atmosphereWarmth: 0.25,
    }
  },
  {
    id: 'preset-torn-kraft',
    name: 'Torn Sage Note',
    description: 'Slightly rough watercolor paper pinned with organic sage green washi tape on burlap background.',
    imageRef: 'image_6',
    state: {
      backing: 'burlap',
      paperColor: 'watercolor-white',
      edgeStyle: 'mild',
      paperTilt: 2,
      washiTape: 'sage-green',
      washiTapePosition: 'top-left-angle',
      shadowType: 'blinds',
      shadowOpacity: 0.32,
      shadowAngle: 15,
      flowerStyle: 'olive-leaves',
      flowerPos: { x: 74, y: 15 },
      flowerRotation: -60,
      flowerScale: 0.8,
      hasCalligraphyPen: false,
      fontStyle: 'sans',
      fontSize: 20,
      letterSpacing: 0.08,
      lineHeight: 1.7,
      textAlignment: 'center',
      textColor: '#3C403E',
      inkOpacity: 0.8,
      atmosphereWarmth: 0.15,
    }
  }
];
