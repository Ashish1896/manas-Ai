import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Booking = () => {
  return (
    <div className="min-h-screen pt-20 pb-8 bg-gradient-to-br from-background to-secondary/5">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-4">Book a Consultant</h1>
          <p className="text-xl text-muted-foreground">
            Schedule a session with a mental health professional
          </p>
        </div>

        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-4 rounded-full bg-primary/10 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Booking System Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              We're working on integrating with professional mental health consultants. 
              In the meantime, you can use our AI companion for immediate support.
            </p>
            <div className="space-y-4">
              <Link to="/chat">
                <Button size="lg" className="w-full">
                  Chat with AI Support
                </Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline" size="lg" className="w-full">
                  Browse Resources
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Booking;
