import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StreamSelectorProps {
  onStreamSelected: (stream: 'JEE' | 'NEET') => void;
  userId: string;
}

export function StreamSelector({ onStreamSelected, userId }: StreamSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStreamSelection = async (stream: 'JEE' | 'NEET') => {
    setIsLoading(true);
    try {
      // Update user profile with selected stream
      const { error } = await supabase
        .from('profiles')
        .update({ stream })
        .eq('user_id', userId);

      if (error) throw error;

      onStreamSelected(stream);
      toast({
        title: "Stream Selected",
        description: `Welcome to ${stream} preparation! Let's start your assessment.`,
      });
    } catch (error) {
      console.error('Error updating stream:', error);
      toast({
        title: "Error",
        description: "Failed to select stream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Choose Your Stream</h1>
          <p className="text-xl text-muted-foreground">
            Select your exam preparation path to get personalized content and assessments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* JEE Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">JEE Preparation</CardTitle>
                <CardDescription className="text-base">
                  Joint Entrance Examination for Engineering
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Subjects Covered:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Physics - Mechanics, Thermodynamics, Electromagnetism</li>
                    <li>• Chemistry - Organic, Inorganic, Physical</li>
                    <li>• Mathematics - Calculus, Algebra, Coordinate Geometry</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Comprehensive problem-solving techniques</li>
                    <li>• IIT JEE specific question patterns</li>
                    <li>• Advanced mathematics and physics concepts</li>
                  </ul>
                </div>
                <Button 
                  className="w-full mt-6" 
                  onClick={() => handleStreamSelection('JEE')}
                  disabled={isLoading}
                >
                  Choose JEE Preparation
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* NEET Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400">NEET Preparation</CardTitle>
                <CardDescription className="text-base">
                  National Eligibility cum Entrance Test for Medical
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Subjects Covered:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Biology - Cell Biology, Genetics, Human Physiology</li>
                    <li>• Chemistry - Organic, Inorganic, Biomolecules</li>
                    <li>• Physics - Mechanics, Optics, Modern Physics</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Medical entrance focused content</li>
                    <li>• Biology-heavy curriculum with depth</li>
                    <li>• Clinical applications and case studies</li>
                  </ul>
                </div>
                <Button 
                  className="w-full mt-6" 
                  onClick={() => handleStreamSelection('NEET')}
                  disabled={isLoading}
                >
                  Choose NEET Preparation
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            Don't worry! You can change your stream later in settings
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}