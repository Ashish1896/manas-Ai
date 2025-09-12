import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing Gemini API Key');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// AI Interaction Rules for Mental Health Support
const SYSTEM_PROMPT = `You are MindWell, a compassionate AI mental health companion designed specifically for college students. Your role is to provide supportive, empathetic, and helpful responses while maintaining professional boundaries.

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

  async sendMessage(userMessage: string): Promise<string> {
    try {
      console.log('Sending message to Gemini:', userMessage);
      console.log('API Key exists:', !!API_KEY);
      
      // Add user message to history
      this.chatHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      // Prepare the conversation context
      const conversationContext = this.buildConversationContext();
      console.log('Conversation context length:', conversationContext.length);
      
      // Generate response using Gemini
      const result = await model.generateContent(conversationContext);
      const response = await result.response;
      const aiResponse = response.text();

      console.log('Gemini response received:', aiResponse);

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
  }

  private buildConversationContext(): string {
    // Use a simpler approach for the first message
    if (this.chatHistory.length === 1) {
      return `${SYSTEM_PROMPT}\n\nStudent: ${this.chatHistory[0].content}\n\nPlease respond as MindWell:`;
    }
    
    // For subsequent messages, include recent conversation history
    let context = SYSTEM_PROMPT + "\n\nRecent conversation:\n";
    
    // Only include the last 3 messages to keep context manageable
    const recentMessages = this.chatHistory.slice(-3);
    recentMessages.forEach((message) => {
      const role = message.role === 'user' ? 'Student' : 'MindWell';
      context += `${role}: ${message.content}\n`;
    });

    context += "\nPlease respond as MindWell:";
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
