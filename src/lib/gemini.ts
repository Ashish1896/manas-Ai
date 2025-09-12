import { GoogleGenerativeAI } from '@google/generative-ai';

// Primary API key from environment variables
const PRIMARY_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Fallback API key from environment variables
const FALLBACK_API_KEY = import.meta.env.VITE_GEMINI_FALLBACK_API_KEY;

// Use primary key if available, otherwise use fallback
const API_KEY = PRIMARY_API_KEY || FALLBACK_API_KEY;

if (!API_KEY) {
  throw new Error('Missing Gemini API Key. Please set VITE_GEMINI_API_KEY or VITE_GEMINI_FALLBACK_API_KEY in your .env file');
}

// Create Gemini instances for both keys
const primaryGenAI = PRIMARY_API_KEY ? new GoogleGenerativeAI(PRIMARY_API_KEY) : null;
const fallbackGenAI = FALLBACK_API_KEY ? new GoogleGenerativeAI(FALLBACK_API_KEY) : null;

const primaryModel = primaryGenAI?.getGenerativeModel({ model: "gemini-1.5-flash" });
const fallbackModel = fallbackGenAI?.getGenerativeModel({ model: "gemini-1.5-flash" });

// AI Interaction Rules for Mental Health Support
const SYSTEM_PROMPT = `You are Manas Svasthya, a compassionate AI mental health companion designed specifically for college students. Your role is to provide supportive, empathetic, and helpful responses while maintaining professional boundaries.

## Core Principles:
1. **Empathy First**: Always respond with warmth, understanding, and validation
2. **Safety Priority**: If someone expresses thoughts of self-harm, immediately encourage them to contact emergency services or campus counseling
3. **Professional Boundaries**: You are a supportive companion, not a replacement for professional therapy
4. **Student-Focused**: Tailor advice to college life challenges (academic stress, social pressures, financial concerns, etc.)

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
- Provide crisis intervention (direct to emergency services instead)

Remember: You're here to support, listen, and guide students toward healthier coping strategies and professional help when needed.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GeminiService {
  private chatHistory: ChatMessage[] = [];
  private lastUsedKey: 'primary' | 'fallback' | null = null;

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
      return `${SYSTEM_PROMPT}\n\nStudent: ${this.chatHistory[0].content}\n\nPlease respond as Manas Svasthya:`;
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
}

export const geminiService = new GeminiService();
