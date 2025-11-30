import { GoogleGenAI } from "@google/genai";
import { AnalysisReport } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string, });

export const generateAnalysis = async (
  primaryUrl: string,
  competitorUrls: string[],
  onProgress: (status: string) => void
): Promise<AnalysisReport> => {
  
  const allUrls = [primaryUrl, ...competitorUrls];
  
  onProgress(`Initializing research agents for ${allUrls.length} sites...`);

  // We will use gemini-2.5-flash with Google Search grounding to simulate the crawler
  const modelId = 'gemini-2.5-flash';

  const prompt = `
    You are an expert Competitor Analysis Engine. 
    
    Your task is to analyze the following websites deeply using Google Search to find their features, pricing, SEO details, and strategic positioning.
    
    Primary Company: ${primaryUrl}
    Competitors: ${competitorUrls.join(', ')}

    Perform the following steps:
    1. Search for the homepage, pricing page, and features page for each domain.
    2. Extract a list of distinct features. Normalize them (e.g., "Login with Google" -> "SSO").
    3. Determine feature availability for EACH company (True/False or a short string).
    4. Extract pricing tiers and free trial availability.
    5. Estimate SEO health based on public signals.
    6. Perform a SWOT analysis for EACH company based on public perception and feature gaps.
    7. Infer the likely Tech Stack (Frontend framework, Cloud provider, Analytics) based on typical patterns or job postings found in search.
    8. Create a market positioning score (0-100) for "Innovation" and "Market Presence".

    Return ONLY a valid JSON object matching this specific structure. Do not include markdown formatting like \`\`\`json.
    
    {
      "profiles": [
        { "url": "...", "name": "...", "description": "...", "colors": ["#hex"] }
      ],
      "features": [
        {
          "name": "...",
          "canonical_feature": "...", 
          "confidence": 0.9,
          "evidence_snippet": "...",
          "availability": {
            "${primaryUrl}": true,
            "${competitorUrls[0] || 'comp1'}": false
          }
        }
      ],
      "pricing": [
        {
          "url": "...",
          "has_free_trial": true,
          "currency": "USD",
          "tiers": [
             { "tier_name": "Starter", "price": "$10", "billing_cycle": "month", "features_included": ["..."] }
          ]
        }
      ],
      "seo": [
        {
          "url": "...",
          "page_speed_score": 85,
          "meta_description_health": "Good",
          "schema_types": ["Organization", "Product"],
          "blog_freshness": "High",
          "mobile_friendly": true
        }
      ],
      "swot": {
        "${primaryUrl}": {
          "strengths": ["..."],
          "weaknesses": ["..."],
          "opportunities": ["..."],
          "threats": ["..."]
        },
        "${competitorUrls[0] || 'comp1'}": {
          "strengths": ["..."],
          "weaknesses": ["..."],
          "opportunities": ["..."],
          "threats": ["..."]
        }
      },
      "tech_stacks": [
        { "url": "...", "frontend": ["React"], "backend": ["Python"], "analytics": ["GA4"] }
      ],
      "market_positioning": {
         "${primaryUrl}": { "x": 80, "y": 70 },
         "${competitorUrls[0] || 'comp1'}": { "x": 50, "y": 50 }
      },
      "summary": "A brief executive summary comparison...",
      "recommendations": ["Actionable advice 1", "Actionable advice 2"]
    }
  `;

  try {
    onProgress("Crawling and extracting deep insights (SWOT, Pricing, Tech)...");

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable search to get real data
        temperature: 0.2,
      }
    });

    onProgress("Synthesizing strategic report...");

    const textResponse = response.text;
    if (!textResponse) throw new Error("No response from AI");

    // Clean up potential markdown code blocks
    const jsonStr = textResponse.replace(/```json\n?|\n?```/g, '').trim();
    
    const parsedData = JSON.parse(jsonStr);

    // Hydrate with IDs and Timestamp
    const report: AnalysisReport = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      primaryUrl,
      competitors: competitorUrls,
      ...parsedData
    };

    return report;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to generate analysis. Please check your API key and try again.");
  }
};
