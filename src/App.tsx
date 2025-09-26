import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import Navigation from "./components/Navigation";
import UserDashboard from "./components/UserDashboard";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import OfflineIndicator from "./components/OfflineIndicator";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Booking from "./pages/Booking";
import Chat from "./pages/Chat";
import Assessment from "./pages/Assessment";
import Resources from "./pages/Resources";
import Community from "./pages/Community";
import MedicineAI from "./components/MedicineAI";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";
// Import auth components from auth folder
import SignInPage from "./auth/sign-in/[[...sign-in]]/page";
import SignUpPage from "./auth/sign-up/[[...sign-up]]/page";
import SignOutPage from "./auth/sign-out/page";
import { registerServiceWorker, addOnlineStatusListener } from "./utils/pwa";
import { useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

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

  // PWA Setup
  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Handle online/offline status
    const cleanup = addOnlineStatusListener((isOnline) => {
      if (!isOnline) {
        console.log("App is now offline - some features may be limited");
      } else {
        console.log("App is back online");
      }
    });

    return cleanup;
  }, []);

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
            <OfflineIndicator />
            <PWAInstallPrompt />
            <SpeedInsights />
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  isSignedIn ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Landing />
                  )
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/sign-out" element={<SignOutPage />} />

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
                path="/journal"
                element={
                  <ProtectedRoute>
                    <Journal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment"
                element={
                  <ProtectedRoute>
                    <Assessment />
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

export default App; //help?
