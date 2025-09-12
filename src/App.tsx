import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import ChatBot from "./components/ChatBot";
import ResourceHub from "./components/ResourceHub";
import PeerForum from "./components/PeerForum";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";

const queryClient = new QueryClient();

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { isSignedIn, isLoaded } = useUser();

  const renderSection = () => {
    switch (activeSection) {
      case 'chatbot':
        return <ChatBot />;
      case 'resources':
        return <ResourceHub />;
      case 'forum':
        return <PeerForum />;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-out" element={<SignOut />} />
            <Route 
              path="/" 
              element={
                isSignedIn ? (
                  <div className="min-h-screen bg-background">
                    <Navigation 
                      activeSection={activeSection} 
                      onSectionChange={setActiveSection}
                      onSignOut={() => {}}
                    />
                    {renderSection()}
                  </div>
                ) : (
                  <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center space-y-6 max-w-md mx-auto p-8">
                      <h1 className="text-3xl font-bold">Welcome to MindWell</h1>
                      <p className="text-muted-foreground">
                        Your mental wellness companion for college students
                      </p>
                      <div className="space-y-4">
                        <a 
                          href="/sign-in" 
                          className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors"
                        >
                          Sign In
                        </a>
                        <a 
                          href="/sign-up" 
                          className="block w-full border border-primary text-primary hover:bg-primary/5 py-3 px-6 rounded-lg font-medium transition-colors"
                        >
                          Create Account
                        </a>
                      </div>
                    </div>
                  </div>
                )
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
