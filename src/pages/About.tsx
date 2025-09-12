import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Brain, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen pt-20 pb-8 bg-gradient-to-br from-background to-secondary/5">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">About Manas Svasthya</h1>
          <p className="text-xl text-muted-foreground">
            Your comprehensive mental wellness companion for college life
          </p>
        </div>

        <div className="space-y-8">
          {/* Mission */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Manas Svasthya is dedicated to supporting college students through their mental health journey. 
              We understand the unique challenges of academic life, social pressures, and the transition 
              to independence. Our platform combines AI-powered support, peer connections, and 
              evidence-based resources to create a comprehensive wellness ecosystem.
            </p>
          </Card>

          {/* Features */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI-Powered Support</h3>
                    <p className="text-sm text-muted-foreground">
                      24/7 access to an empathetic AI companion trained in mental health best practices
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Peer Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with fellow students who understand your experiences and challenges
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Heart className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Professional Resources</h3>
                    <p className="text-sm text-muted-foreground">
                      Access to mental health professionals and evidence-based wellness resources
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Shield className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Privacy & Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is encrypted and conversations remain completely confidential
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-sm text-muted-foreground">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Resources Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
                <div className="text-sm text-muted-foreground">Peer Connections</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of students who have found support and community through Manas Svasthya
            </p>
            <Link to="/sign-up">
              <Button size="lg" className="px-8">
                Get Started Today
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
