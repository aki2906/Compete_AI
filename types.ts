export enum JobStatus {
  IDLE = 'IDLE',
  CRAWLING = 'CRAWLING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Feature {
  name: string;
  canonical_feature: string; // e.g., "SSO", "Analytics"
  confidence: number;
  evidence_snippet: string;
  availability: Record<string, boolean | string>; // url -> available/details
}

export interface PricingTier {
  tier_name: string;
  price: string;
  billing_cycle: string;
  features_included: string[];
}

export interface PricingModel {
  url: string;
  has_free_trial: boolean;
  currency: string;
  tiers: PricingTier[];
}

export interface SeoSignals {
  url: string;
  page_speed_score: number; // Simulated 0-100
  meta_description_health: 'Good' | 'Fair' | 'Poor';
  schema_types: string[];
  blog_freshness: 'High' | 'Medium' | 'Low';
  mobile_friendly: boolean;
}

export interface CompanyProfile {
  url: string;
  name: string;
  description: string;
  colors: string[]; // Extracted brand colors
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface TechStack {
  url: string;
  frontend: string[];
  backend: string[];
  analytics: string[];
}

export interface AnalysisReport {
  id: string;
  timestamp: string;
  primaryUrl: string;
  competitors: string[];
  profiles: CompanyProfile[];
  features: Feature[];
  pricing: PricingModel[];
  seo: SeoSignals[];
  swot: Record<string, SWOT>;
  tech_stacks: TechStack[];
  market_positioning: {
    [url: string]: {
      x: number; // e.g., Innovation (0-100)
      y: number; // e.g., Market Presence (0-100)
    }
  };
  summary: string;
  recommendations: string[];
}

export interface CrawlConfig {
  depth: number;
  maxPages: number;
  includeScreenshots: boolean;
}