export type BackingStyle = 'linen' | 'burlap' | 'corrugated' | 'slate' | 'silk';

export type PaperColor = 'ivory-cotton' | 'recycled-kraft' | 'watercolor-white' | 'charcoal-slate' | 'tea-parchment';

export type EdgeStyle = 'heavy' | 'mild' | 'none';

export type WashiTapeStyle = 'beige-kraft' | 'charcoal-slate' | 'sage-green' | 'transparent-paper' | 'none';

export type ShadowType = 'window' | 'blinds' | 'foliage' | 'noontime' | 'soft-ambient';

export type FlowerAccents = 'babys-breath' | 'lavender-sprig' | 'olive-leaves' | 'none';

export type FontStyle = 'serif' | 'typewriter' | 'grungy-typewriter' | 'signature' | 'sans';

export interface Pos2D {
  x: number;
  y: number;
}

export interface WorkstationState {
  quoteText: string;
  authorText: string;
  fontStyle: FontStyle;
  fontSize: number; // in px
  letterSpacing: number; // in em/px tracking
  lineHeight: number; // multiples
  textAlignment: 'left' | 'center' | 'right' | 'justify';
  textColor: string; // hex
  inkOpacity: number; // 0.1 to 1

  // Background/Backing
  backing: BackingStyle;
  atmosphereWarmth: number; // warmth overlay opacity (warm orange tint)
  ambientLight: number; // brightness multiplier 50-150%

  // Paper/Card
  paperColor: PaperColor;
  edgeStyle: EdgeStyle;
  paperTilt: number; // in degrees
  paperScale: number; // zoom level
  paperShadowBlur: number; // blur radius px
  paperShadowOpacity: number; // opacity

  // Shadow/Sunlight
  shadowType: ShadowType;
  shadowOpacity: number; // 0 to 0.75
  shadowAngle: number; // rotation offset
  shadowScale: number; // size scaling

  // Accents & Accessories
  washiTape: WashiTapeStyle;
  washiTapePosition: 'top-center' | 'top-left-angle' | 'double-corners' | 'none';
  flowerStyle: FlowerAccents;
  flowerPos: Pos2D;
  flowerRotation: number;
  flowerScale: number;
  hasCalligraphyPen: boolean;
  penPos: Pos2D;
  penRotation: number;
  penScale: number;

  // Custom Studio Watermark
  watermarkText: string;
  showWatermark: boolean;
  watermarkSpacing: number; // tracking
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  imageRef: string; // references image_0, image_5 etc.
  state: Partial<WorkstationState>;
}

export interface PresetCollection {
  id: string;
  name: string;
  presets: Preset[];
}
