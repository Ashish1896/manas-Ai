import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import ChatBot from "./components/ChatBot";
import ResourceHub from "./components/ResourceHub";
import PeerForum from "./components/PeerForum";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="min-h-screen bg-background">
                  <Navigation 
                    activeSection={activeSection} 
                    onSectionChange={setActiveSection} 
                  />
                  {renderSection()}
                </div>
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
