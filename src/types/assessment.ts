export interface AssessmentResult {
  stress: number;
  anxiety: number;
  sleep: number;
  stressLevel: string;
  totalScore: number;
  activities: Array<{ name: string; duration: string }>;
  games: Array<{ name: string; duration: string }>;
  categoryScores: {
    academicPressure: number;
    familyRelationships: number;
    peerSocial: number;
    futureUncertainty: number;
    sleepWorries: number;
    modernCoping: number;
  };
  timestamp?: string;
}
