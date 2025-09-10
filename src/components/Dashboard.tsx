import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, MessageCircle, BookOpen, Users, Heart, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-wellness.jpg";

interface DashboardProps {
  onSectionChange: (section: string) => void;
}

const Dashboard = ({ onSectionChange }: DashboardProps) => {
  const quickActions = [
    {
      title: "Talk to AI Support",
      description: "Get immediate help from our empathetic AI counselor",
      icon: Brain,
      action: () => onSectionChange('chatbot'),
      color: "therapeutic-blue"
    },
    {
      title: "Browse Resources",
      description: "Access helpful articles and guided exercises",
      icon: BookOpen,
      action: () => onSectionChange('resources'),
      color: "therapeutic-green"
    },
    {
      title: "Join Peer Support",
      description: "Connect with fellow students who understand",
      icon: Users,
      action: () => onSectionChange('forum'),
      color: "therapeutic-purple"
    }
  ];

  const wellnessStats = [
    { label: "Days Active", value: "12", icon: Clock },
    { label: "Resources Viewed", value: "8", icon: BookOpen },
    { label: "Peer Connections", value: "3", icon: Users },
  ];

  return (
    <div className="min-h-screen pt-20 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/40 to-transparent"></div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
                Your Mental Wellness
                <span className="text-primary block">Companion</span>
              </h1>
              <p className="text-xl text-muted-foreground text-balance leading-relaxed">
                Supporting college students through AI-powered guidance, peer connections, 
                and evidence-based resources for better mental health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => onSectionChange('chatbot')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg shadow-therapeutic animate-gentle-bounce"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Start AI Support Session
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => onSectionChange('resources')}
                  className="px-8 py-4 rounded-xl text-lg border-primary/20 hover:bg-primary/5"
                >
                  Explore Resources
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <img 
                src={heroImage} 
                alt="Peaceful wellness illustration representing mental health support"
                className="w-full h-auto rounded-3xl shadow-2xl shadow-primary/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How Can We Support You Today?</h2>
          <p className="text-lg text-muted-foreground">Choose the support that feels right for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={index} 
                className="mindwell-card p-6 cursor-pointer hover:shadow-therapeutic hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-primary animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={action.action}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                    <p className="text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Wellness Stats */}
        <Card className="mindwell-card p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">Your Wellness Journey</h3>
          <div className="grid grid-cols-3 gap-8">
            {wellnessStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Features Overview */}
      <section className="bg-gradient-calm py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose MindWell?</h2>
            <p className="text-lg text-muted-foreground">Built specifically for college students, by mental health experts</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-2xl bg-success/10">
                  <Shield className="w-8 h-8 text-success" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Private & Secure</h3>
              <p className="text-muted-foreground">Your conversations and data are completely confidential and encrypted</p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-2xl bg-primary/10">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">24/7 Available</h3>
              <p className="text-muted-foreground">Get support whenever you need it, day or night</p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-2xl bg-accent/10">
                  <MessageCircle className="w-8 h-8 text-accent-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Evidence-Based</h3>
              <p className="text-muted-foreground">All our resources are backed by psychological research and best practices</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;