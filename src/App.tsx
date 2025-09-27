import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StreamSelector } from '@/components/stream/StreamSelector';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Assessment from "./pages/Assessment";
import Lessons from "./pages/Lessons";
import Schedule from "./pages/Schedule";
import Materials from "./pages/Materials";
import Learning from "./pages/Learning";
import Forum from "./pages/Forum";
import Settings from "./pages/Settings";
import AITutor from "./pages/AITutor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [showStreamSelector, setShowStreamSelector] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUserProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      setUserProfile(profile);
      
      // Show stream selector if no stream is set
      if (!profile?.stream) {
        setShowStreamSelector(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleStreamSelected = (stream: 'JEE' | 'NEET') => {
    setShowStreamSelector(false);
    setUserProfile(prev => ({ ...prev, stream }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Auth />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (showStreamSelector) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <StreamSelector 
            onStreamSelected={handleStreamSelected}
            userId={session.user.id}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
