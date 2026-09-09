export type ArithmeticTopicId =
  | "multiplication"
  | "addition"
  | "subtraction"
  | "division"
  | "percentages";

export type FamilyStatus = "Learning" | "Practicing" | "Mastered";

export interface MultiplicationFamily {
  number: number;
  label: string;
  progressPercent: number; // 0 to 100
  status: FamilyStatus;
  items: Array<{
    a: number;
    b: number;
    product: number;
    isMemorized: boolean;
  }>;
}

export interface MentalShortcut {
  id: string;
  title: string;
  titleId?: string;
  tagline: string;
  taglineId?: string;
  whenToUse: string;
  whenToUseId?: string;
  whyItWorks: string;
  whyItWorksId?: string;
  example: {
    problem: string;
    thinkingProcess: string;
    thinkingProcessId?: string;
    answer: string;
  };
  fasterAlternative: string;
  fasterAlternativeId?: string;
  commonMistake: string;
  commonMistakeId?: string;
}

export interface PercentageBenchmark {
  percentStr: string;
  decimalStr: string;
  fractionStr: string;
  shortcutRule: string;
  example: string;
}

export interface TopicMasteryProgress {
  topicId: ArithmeticTopicId;
  title: string;
  progressPercent: number;
  completedTechniques: number;
  totalTechniques: number;
}
