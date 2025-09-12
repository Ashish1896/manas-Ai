import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import Navigation from "./components/Navigation";
import UserDashboard from "./components/UserDashboard";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Booking from "./pages/Booking";
import Chat from "./pages/Chat";
import Resources from "./pages/Resources";
import Community from "./pages/Community";
import MedicineAI from "./components/MedicineAI";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();

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

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {children}
    </div>
  );
};

const App = () => {
  const { isSignedIn, isLoaded } = useUser();

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
        <AssessmentProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  isSignedIn ? <Navigate to="/dashboard" replace /> : <Landing />
                } 
              />
              <Route path="/about" element={<About />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-out" element={<SignOut />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/booking" 
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resources" 
                element={
                  <ProtectedRoute>
                    <Resources />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/medicine" 
                element={
                  <ProtectedRoute>
                    <MedicineAI />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AssessmentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
//help?