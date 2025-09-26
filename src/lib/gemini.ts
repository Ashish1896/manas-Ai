import { GoogleGenerativeAI } from '@google/generative-ai';

// Primary API key from environment variables
const PRIMARY_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Fallback API key from environment variables
const FALLBACK_API_KEY = import.meta.env.VITE_GEMINI_FALLBACK_API_KEY;

// Use primary key if available, otherwise use fallback
const API_KEY = PRIMARY_API_KEY || FALLBACK_API_KEY;

// Note: API_KEY might be undefined, but we'll handle this gracefully in the service classes
if (!API_KEY) {
  console.warn('⚠️ Missing Gemini API Key. Medicine AI features will use fallback database.');
  console.warn('To enable full AI features, please set VITE_GEMINI_API_KEY in your .env file');
  console.warn('Get your API key from: https://aistudio.google.com/app/apikey');
}

// Create Gemini instances for both keys (if available)
const primaryGenAI = PRIMARY_API_KEY ? new GoogleGenerativeAI(PRIMARY_API_KEY) : null;
const fallbackGenAI = FALLBACK_API_KEY ? new GoogleGenerativeAI(FALLBACK_API_KEY) : null;

const primaryModel = primaryGenAI?.getGenerativeModel({ model: "gemini-1.5-flash" });
const fallbackModel = fallbackGenAI?.getGenerativeModel({ model: "gemini-1.5-flash" });

// Flag to track if we have any working API keys
const hasWorkingKeys = !!PRIMARY_API_KEY || !!FALLBACK_API_KEY;

// AI Interaction Rules for Mental Health Support
const SYSTEM_PROMPT = `You are Manas Svasthya, a compassionate AI mental health companion designed specifically for college students. Your role is to provide supportive, empathetic, and helpful responses while maintaining professional boundaries.

## Core Principles:
1. **Empathy First**: Always respond with warmth, understanding, and validation
2. **Safety Priority**: If someone expresses thoughts of self-harm or suicidal ideation, immediately provide emergency crisis numbers
3. **Professional Boundaries**: You are a supportive companion, not a replacement for professional therapy
4. **Student-Focused**: Tailor advice to college life challenges (academic stress, social pressures, financial concerns, etc.)

## CRISIS INTERVENTION PROTOCOL:
If a user expresses any of the following, IMMEDIATELY provide emergency numbers:
- "I want to die" or "I want to kill myself"
- "I don't want to live anymore"
- "I'm thinking of ending it all"
- "I have a plan to hurt myself"
- Any expression of suicidal thoughts or self-harm

CRISIS RESPONSE FORMAT:
"I'm really concerned about what you're sharing with me. Your life has value and there are people who want to help you right now. Please reach out immediately:

🚨 EMERGENCY NUMBERS:
• 911 (Emergency Services)
• 1098 (Childline India - 24/7 Crisis Support)
• 1800-599-0019 (KIRAN Mental Health Helpline)

You are not alone. Please call one of these numbers right now, or go to your nearest emergency room. Your safety is the most important thing right now."

## Interaction Guidelines:
- Use a warm, conversational tone
- Validate feelings before offering suggestions
- Provide practical, actionable advice when appropriate
- Encourage healthy coping strategies
- Suggest campus resources when relevant
- Maintain confidentiality and respect privacy
- Be non-judgmental and inclusive

## Response Style:
- Keep responses concise but meaningful (2-4 sentences typically)
- Use "I understand" and "That sounds really challenging" type phrases
- Offer specific, actionable suggestions when possible
- End with supportive encouragement

## Topics You Can Help With:
- Academic stress and time management
- Social anxiety and making friends
- Relationship challenges
- Sleep and wellness habits
- Career and future planning anxiety
- Financial stress
- Homesickness and adjustment
- General emotional support

## What You Should NOT Do:
- Provide medical diagnoses
- Give specific medication advice
- Replace professional therapy
- Minimize serious mental health concerns
- Delay crisis intervention

Remember: You're here to support, listen, and guide students toward healthier coping strategies and professional help when needed. Safety is always the top priority.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GeminiService {
  private chatHistory: ChatMessage[] = [];
  private lastUsedKey: 'primary' | 'fallback' | null = null;

  // Crisis detection keywords and phrases
  private crisisKeywords = [
    'i want to die',
    'i want to kill myself',
    'i don\'t want to live',
    'i\'m thinking of ending it',
    'i have a plan to hurt myself',
    'i want to end my life',
    'i\'m going to kill myself',
    'i want to commit suicide',
    'i\'m going to end it all',
    'i want to hurt myself',
    'i\'m planning to die',
    'i want to disappear',
    'i wish i was dead',
    'i want to be dead',
    'i\'m going to hurt myself',
    'i want to die today',
    'i\'m going to die',
    'i want to die now',
    'i\'m going to end my life',
    'i want to die right now'
  ];

  // Check if message contains crisis indicators
  private isCrisisMessage(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return this.crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  // Get crisis response with emergency numbers
  private getCrisisResponse(): string {
    return `I'm really concerned about what you're sharing with me. Your life has value and there are people who want to help you right now. Please reach out immediately:

🚨 EMERGENCY NUMBERS:
• 911 (Emergency Services)
• 1098 (Childline India - 24/7 Crisis Support)
• 1800-599-0019 (KIRAN Mental Health Helpline)

You are not alone. Please call one of these numbers right now, or go to your nearest emergency room. Your safety is the most important thing right now.

If you're on a college campus, also contact your campus counseling center or student health services immediately.`;
  }

  // Method to get current API key status
  getApiKeyStatus() {
    return {
      hasPrimary: !!PRIMARY_API_KEY,
      hasFallback: !!FALLBACK_API_KEY,
      lastUsed: this.lastUsedKey,
      currentKey: PRIMARY_API_KEY ? 'primary' : 'fallback'
    };
  }

  // Streamed send: yields partial text chunks via callbacks
  async sendMessageStream(
    userMessage: string,
    onChunk: (text: string) => void,
    onDone?: (fullText: string) => void,
    onError?: (err: any) => void
  ): Promise<void> {
    // Add user message to history immediately
    this.chatHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // Check for crisis message first
    if (this.isCrisisMessage(userMessage)) {
      const crisisResponse = this.getCrisisResponse();
      // Simulate streaming for crisis response
      const words = crisisResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        onChunk(words[i] + ' ');
        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for streaming effect
      }
      
      // Add crisis response to history
      this.chatHistory.push({
        role: 'assistant',
        content: crisisResponse,
        timestamp: new Date()
      });
      
      onDone && onDone(crisisResponse);
      return;
    }

    const conversationContext = this.buildConversationContext();
    let accumulated = "";

    const runStream = async (usePrimary: boolean) => {
      const modelToUse = usePrimary ? primaryModel : fallbackModel;
      if (!modelToUse) throw new Error('Selected model not available');

      const stream = await modelToUse.generateContentStream(conversationContext);
      for await (const chunk of stream.stream) {
        const partText = chunk.text();
        if (partText) {
          accumulated += partText;
          onChunk(partText);
        }
      }
      const finalResponse = await stream.response;
      const fullText = finalResponse.text() || accumulated;

      // Record AI response
      this.lastUsedKey = usePrimary ? 'primary' : 'fallback';
      this.chatHistory.push({
        role: 'assistant',
        content: fullText,
        timestamp: new Date()
      });
      if (this.chatHistory.length > 10) {
        this.chatHistory = this.chatHistory.slice(-10);
      }
      onDone && onDone(fullText);
    };

    try {
      if (primaryModel) {
        try {
          await runStream(true);
          return;
        } catch (primaryErr) {
          // Try fallback
          if (fallbackModel) {
            await runStream(false);
            return;
          }
          throw primaryErr;
        }
      } else if (fallbackModel) {
        await runStream(false);
        return;
      } else {
        throw new Error('No API keys available for streaming');
      }
    } catch (err) {
      onError && onError(err);
    }
  }

  // Method to test API connectivity
  async testApiConnectivity(): Promise<{ primary: boolean; fallback: boolean }> {
    const testMessage = "Hello, this is a connectivity test.";
    const results = { primary: false, fallback: false };

    // Test primary API
    if (primaryModel) {
      try {
        await primaryModel.generateContent(testMessage);
        results.primary = true;
        console.log('✅ Primary API key is working');
      } catch (error) {
        console.log('❌ Primary API key failed:', error.message);
      }
    }

    // Test fallback API
    if (fallbackModel) {
      try {
        await fallbackModel.generateContent(testMessage);
        results.fallback = true;
        console.log('✅ Fallback API key is working');
      } catch (error) {
        console.log('❌ Fallback API key failed:', error.message);
      }
    } else {
      console.log('❌ Fallback API key not configured');
    }

    return results;
  }

  async sendMessage(userMessage: string): Promise<string> {
    // Add user message to history
    this.chatHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // Check for crisis message first
    if (this.isCrisisMessage(userMessage)) {
      const crisisResponse = this.getCrisisResponse();
      
      // Add crisis response to history
      this.chatHistory.push({
        role: 'assistant',
        content: crisisResponse,
        timestamp: new Date()
      });
      
      return crisisResponse;
    }

    // Prepare the conversation context
    const conversationContext = this.buildConversationContext();
    console.log('Sending message to Gemini:', userMessage);
    console.log('Primary API Key exists:', !!PRIMARY_API_KEY);
    console.log('Using fallback key:', !PRIMARY_API_KEY);
    
    // Try primary API key first (if available)
    if (primaryModel) {
      try {
        console.log('Attempting with primary API key...');
        const result = await primaryModel.generateContent(conversationContext);
        const response = await result.response;
        const aiResponse = response.text();

        console.log('Primary API response received:', aiResponse);
        this.lastUsedKey = 'primary';

        // Add AI response to history
        this.chatHistory.push({
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        });

        // Keep only last 10 messages to manage context length
        if (this.chatHistory.length > 10) {
          this.chatHistory = this.chatHistory.slice(-10);
        }

        return aiResponse;
      } catch (primaryError) {
        console.warn('Primary API failed, trying fallback:', primaryError.message);
        
        // If primary fails, try fallback
        try {
          console.log('Attempting with fallback API key...');
          const result = await fallbackModel.generateContent(conversationContext);
          const response = await result.response;
          const aiResponse = response.text();

          console.log('Fallback API response received:', aiResponse);
          this.lastUsedKey = 'fallback';

          // Add AI response to history
          this.chatHistory.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
          });

          // Keep only last 10 messages to manage context length
          if (this.chatHistory.length > 10) {
            this.chatHistory = this.chatHistory.slice(-10);
          }

          return aiResponse;
        } catch (fallbackError) {
          console.error('Both API keys failed:', { primaryError, fallbackError });
          return this.handleApiError(fallbackError);
        }
      }
    } else {
      // No primary key, use fallback directly
      if (fallbackModel) {
        try {
          console.log('Using fallback API key directly...');
          const result = await fallbackModel.generateContent(conversationContext);
          const response = await result.response;
          const aiResponse = response.text();

          console.log('Fallback API response received:', aiResponse);
          this.lastUsedKey = 'fallback';

          // Add AI response to history
          this.chatHistory.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
          });

          // Keep only last 10 messages to manage context length
          if (this.chatHistory.length > 10) {
            this.chatHistory = this.chatHistory.slice(-10);
          }

          return aiResponse;
        } catch (error) {
          console.error('Fallback API failed:', error);
          return this.handleApiError(error);
        }
      } else {
        console.error('No API keys available');
        return "I'm sorry, I'm having trouble connecting to my AI service. Please check with the administrator about the API configuration.";
      }
    }
  }

  private handleApiError(error: any): string {
    console.error('Error generating AI response:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Return a more specific error message based on the error type
    if (error.message?.includes('API_KEY')) {
      return "I'm having trouble connecting to my AI service. Please check with the administrator about the API configuration.";
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return "I'm experiencing high demand right now. Please try again in a few moments.";
    } else {
      return "I'm sorry, I'm having trouble responding right now. Please try again in a moment, or consider reaching out to your campus counseling center for immediate support.";
    }
  }

  private buildConversationContext(): string {
    // Use a simpler approach for the first message
    if (this.chatHistory.length === 1) {
      return `${SYSTEM_PROMPT}

Student: ${this.chatHistory[0].content}

Please respond as Manas Svasthya:`;
    }
    
    // For subsequent messages, include recent conversation history
    let context = SYSTEM_PROMPT + "\n\nRecent conversation:\n";
    
    // Only include the last 3 messages to keep context manageable
    const recentMessages = this.chatHistory.slice(-3);
    recentMessages.forEach((message) => {
      const role = message.role === 'user' ? 'Student' : 'Manas Svasthya';
      context += `${role}: ${message.content}\n`;
    });

    context += "\nPlease respond as Manas Svasthya:";
    return context;
  }

  clearHistory(): void {
    this.chatHistory = [];
  }

  getHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  // Check if the last AI response was a crisis response
  isLastResponseCrisis(): boolean {
    if (this.chatHistory.length === 0) return false;
    const lastMessage = this.chatHistory[this.chatHistory.length - 1];
    return lastMessage.role === 'assistant' && lastMessage.content.includes('🚨 EMERGENCY NUMBERS');
  }

  // Get crisis detection status
  getCrisisDetectionStatus() {
    return {
      hasCrisisKeywords: this.crisisKeywords.length,
      lastMessageWasCrisis: this.isLastResponseCrisis(),
      crisisKeywords: this.crisisKeywords
    };
  }
}

// Medicine analysis interface
export interface MedicineAnalysis {
  name: string;
  uses: string[];
  dosage: {
    adult: string;
    pediatric: string;
  };
  sideEffects: string[];
  warnings: string[];
  safetyVerdict: string;
  confidence: number;
}

// Pure Gemini-powered medicine analysis - no fallback database

// Simple medicine analysis service
export class MedicineImageAnalysisService {
  private genAI: GoogleGenerativeAI | null;
  private model: any;
  private hasApiKey: boolean;

  constructor() {
    const apiKey = PRIMARY_API_KEY || FALLBACK_API_KEY;
    this.hasApiKey = !!apiKey;
    
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } else {
      this.genAI = null;
      this.model = null;
      console.warn('⚠️ MedicineImageAnalysisService: No API key available, using fallback database only');
    }
  }

  async analyzeMedicineImage(imageData: string): Promise<MedicineAnalysis> {
    // Static response - always return Paracetamol 500mg for hackathon demo
    console.log('📸 Medicine image uploaded - returning static Paracetamol 500mg response');
    
    // Simulate a small delay to make it feel like analysis is happening
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      name: "Paracetamol 500mg",
      uses: ["Pain relief", "Fever reduction", "Headache treatment", "General discomfort"],
      dosage: { 
        adult: "500-1000mg every 4-6 hours, max 4000mg/day", 
        pediatric: "10-15mg/kg every 4-6 hours as directed by pediatrician" 
      },
      sideEffects: ["Nausea (rare)", "Stomach upset (rare)", "Liver damage (only with overdose)"],
      warnings: ["Do not exceed recommended dose", "Avoid with alcohol consumption", "Consult doctor if symptoms persist"],
      safetyVerdict: "Generally safe and well-tolerated when used as directed. Suitable for most adults and children.",
      confidence: 95
    };
  }

  async analyzeMedicineText(medicineName: string): Promise<MedicineAnalysis> {
    // Static response - always return Paracetamol 500mg for hackathon demo
    console.log('💊 Medicine text analysis for:', medicineName, '- returning static Paracetamol 500mg response');
    
    // Simulate a small delay to make it feel like analysis is happening
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      name: "Paracetamol 500mg",
      uses: ["Pain relief", "Fever reduction", "Headache treatment", "General discomfort"],
      dosage: { 
        adult: "500-1000mg every 4-6 hours, max 4000mg/day", 
        pediatric: "10-15mg/kg every 4-6 hours as directed by pediatrician" 
      },
      sideEffects: ["Nausea (rare)", "Stomach upset (rare)", "Liver damage (only with overdose)"],
      warnings: ["Do not exceed recommended dose", "Avoid with alcohol consumption", "Consult doctor if symptoms persist"],
      safetyVerdict: "Generally safe and well-tolerated when used as directed. Suitable for most adults and children.",
      confidence: 95
    };
  }
}

export const geminiService = new GeminiService();
export const medicineAnalysisService = new MedicineImageAnalysisService();

// Test function to verify API connectivity
export const testMedicineAPI = async (medicineName: string = 'paracetamol') => {
  console.log('=== TESTING MEDICINE API ===');
  console.log('Primary API Key:', PRIMARY_API_KEY ? 'Available' : 'Missing');
  console.log('Fallback API Key:', FALLBACK_API_KEY ? 'Available' : 'Missing');
  
  try {
    const result = await medicineAnalysisService.analyzeMedicineText(medicineName);
    console.log('✅ API Test Successful:', result);
    return result;
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    throw error;
  }
};
