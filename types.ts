
export enum Tab {
  Home = 'Home',
  IdeaGenerator = 'Idea Generator',
  InstantSummary = 'Instant Summary',
  CreatePost = 'Create Post',
  WebsiteContent = 'Website Content',
  AIImages = 'Image Studio',
  CreateVideo = 'Create Video',
  CreateAudio = 'Create Audio',
  BrandKit = 'Brand Kit',
  StyleTraining = 'Style Training',
  Archive = 'Archive',
  Settings = 'Settings',
  About = 'About',
  GraphicDesigner = 'Graphic Designer',
  InfographicDesigner = 'Infographic Designer',
  Templates = 'Templates'
}

export type AppLanguage = 'ar' | 'en';
export type Theme = 'light' | 'dark' | 'comfort';

export interface ProjectContextState {
  topic: string;
  tone: string;
  language: string;
  dialect: string;
  industry: string;
  styleProfile: string;
  previousGenerations: string[];
  appLanguage: AppLanguage;
  theme: Theme;
}

export interface PostGeneration {
  version: number;
  post: string;
  shortVersion?: string;
  cta: string;
  hashtags: string[];
  tone: string;
  imagePrompt?: string;
  hooks?: string[];
}

export interface ReelScene {
  time: string;
  camera: string;
  visual: string;
  audio: string;
  ost: string; // On Screen Text
  imageUrl?: string; // Generated scene image
  imagePrompt?: string; // Prompt used for generation
}

export interface ReelScript {
  style: 'Energetic' | 'Storytelling' | 'Professional' | 'Trend';
  title: string;
  hook: string; // The first 3 seconds
  musicSuggestion: string; // New field
  platform: string; // New field
  estimatedDuration: string; // New field
  scenes: ReelScene[];
  bRoll: string[];
  closingLine: string;
  cta: string;
  caption: string;
  hashtags: string[];
}

export interface ReelResponse {
  versions: ReelScript[];
}

export interface AdGeneration {
  platform: string;
  primaryText: string;
  headline: string;
  description?: string;
  cta: string;
  targeting: string;
}

export interface BrandKit {
  brandName: string;
  slogan: string;
  mission: string;
  colors: Array<{name: string, hex: string}>;
  fontPairing: string;
  toneOfVoice: string;
  socialBio: string;
}

export interface WebsiteGeneration {
  version: number;
  metaDescription: string;
  seoKeywords: string[];
  pageContent: string;
}

export interface IdeaAnalysis {
  strength: 'Weak' | 'Good' | 'Strong' | 'Excellent';
  explanation: string;
  alternativeIdeas: string[];
  attractiveTitles: string[];
  ctas: string[];
  improvements: string;
}

export interface CreativeIdea {
  title: string;
  description: string;
  platform: string;
  targetAudienceAnalysis: string;
  // New specific prompts
  textPrompt?: string;
  imagePrompt?: string;
  // Legacy support
  executionPrompt?: string; 
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ArchivedItem {
  id: string;
  type: 'Post' | 'Website' | 'Image' | 'Idea' | 'Reel' | 'Ad' | 'BrandKit' | 'EditedImage' | 'CreativeIdea' | 'Video' | 'Summary' | 'Audio' | 'GraphicDesign' | 'Infographic';
  content: any;
  timestamp: string;
}
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
