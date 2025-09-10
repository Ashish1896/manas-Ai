import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Send, Sparkles, Heart } from "lucide-react";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi there! I'm your AI wellness companion. I'm here to listen and provide support whenever you need it. How are you feeling today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickPrompts = [
    "I'm feeling anxious about exams",
    "I'm having trouble sleeping",
    "I feel overwhelmed with coursework",
    "I'm feeling lonely on campus"
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: "I hear that you're going through a challenging time. It's completely normal to feel this way, especially as a student. Would you like to explore some coping strategies together, or would you prefer to talk more about what you're experiencing?",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 bg-gradient-calm">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Brain className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">AI Wellness Companion</h1>
          <p className="text-lg text-muted-foreground">
            Safe, confidential support powered by advanced AI trained in mental health best practices
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="mindwell-card p-6 mb-6 animate-fade-in">
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-secondary text-secondary-foreground mr-4'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="flex items-center mb-2">
                      <Sparkles className="w-4 h-4 mr-2 text-primary" />
                      <span className="text-xs font-medium text-primary">AI Companion</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Share what's on your mind..."
                className="mindwell-input flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                size="lg"
                className="px-4 rounded-xl"
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Prompts */}
        <Card className="mindwell-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-therapeutic-warm" />
            Common Concerns - Click to start
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleQuickPrompt(prompt)}
                className="text-left justify-start h-auto py-3 px-4 rounded-xl hover:bg-accent/50"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </Card>

        {/* Disclaimer */}
        <div className="text-center mt-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>
            This AI companion provides supportive guidance but is not a replacement for professional mental health care. 
            If you're in crisis, please contact your campus counseling center or emergency services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;