export type FeatureFlagCategory = "Core" | "AI" | "Gamification" | "Experimental";

export interface FeatureFlag {
  key: string;
  name: string;
  category: FeatureFlagCategory;
  description: string;
  isEnabled: boolean;
  updatedAt: string;
}
