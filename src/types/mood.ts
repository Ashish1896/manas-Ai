export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  mood: string; // Emoji
  comment: string;
  timestamp: Date;
}

export type MoodType = "😊" | "😐" | "😔" | "😡" | "😴";

export const MOOD_EMOJIS: MoodType[] = ["😊", "😐", "😔", "😡", "😴"];

export const MOOD_LABELS: Record<MoodType, string> = {
  "😊": "Happy",
  "😐": "Just Fine",
  "😔": "Sad",
  "😡": "Angry",
  "😴": "Lazy",
};

export const MOOD_COLORS: Record<MoodType, string> = {
  "😊": "bg-green-100 border-green-400 text-green-800",
  "😐": "bg-gray-100 border-gray-400 text-gray-800",
  "😔": "bg-blue-100 border-blue-400 text-blue-800",
  "😡": "bg-red-100 border-red-400 text-red-800",
  "😴": "bg-purple-100 border-purple-400 text-purple-800",
};
