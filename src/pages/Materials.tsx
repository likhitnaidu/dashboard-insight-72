import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Download, BookOpen, ExternalLink, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface MaterialResource {
  id: string;
  title: string;
  subject: string;
  type: 'PDF' | 'eBook' | 'Notes' | 'Practice';
  size: string;
  downloads: string;
  url: string;
  description: string;
}

export default function Materials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userStream, setUserStream] = useState<string>('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('stream')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.stream) {
          setUserStream(profile.stream);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Free educational resources
  const materials: MaterialResource[] = [
    {
      id: '1',
      title: 'NCERT Physics Class 11 & 12',
      subject: 'Physics',
      type: 'PDF',
      size: '45 MB',
      downloads: '125K',
      url: 'https://ncert.nic.in/textbook.php',
      description: 'Complete NCERT Physics textbooks for JEE/NEET preparation'
    },
    {
      id: '2',
      title: 'Chemistry Formulas & Reactions',
      subject: 'Chemistry', 
      type: 'Notes',
      size: '12 MB',
      downloads: '89K',
      url: '#',
      description: 'Comprehensive chemistry formulas and important reactions'
    },
    {
      id: '3',
      title: 'Mathematics Problem Bank',
      subject: 'Mathematics',
      type: 'Practice',
      size: '28 MB', 
      downloads: '156K',
      url: '#',
      description: 'Extensive collection of JEE mathematics problems'
    },
    {
      id: '4',
      title: 'Biology NEET Complete Guide',
      subject: 'Biology',
      type: 'eBook',
      size: '67 MB',
      downloads: '234K',
      url: '#',
      description: 'Complete biology study material for NEET preparation'
    },
    {
      id: '5',
      title: 'Previous Year Question Papers',
      subject: 'Mixed',
      type: 'PDF',
      size: '15 MB',
      downloads: '445K',
      url: '#',
      description: 'Last 10 years JEE & NEET question papers with solutions'
    }
  ];

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="h-full overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <FolderOpen className="h-8 w-8 text-primary" />
                Study Materials
              </h1>
              <p className="text-muted-foreground mt-1">
                Free educational resources for {userStream} preparation
              </p>
            </div>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <BookOpen className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{material.type}</Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {material.title}
                    </CardTitle>
                    <CardDescription>
                      {material.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Size: {material.size}</span>
                        <span>{material.downloads} downloads</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{material.subject}</Badge>
                      </div>
                      <Button className="w-full" onClick={() => window.open(material.url, '_blank')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Free
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}