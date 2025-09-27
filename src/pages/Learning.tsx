import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Search, Filter, Play, Clock, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';

interface VideoResource {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumbnail: string;
  url: string;
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
}

export default function Learning() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedSubject, setSelectedSubject] = useState('all');
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

  // Mock video data - in real app, this would come from YouTube API
  const videoResources: VideoResource[] = [
    // JEE Videos
    {
      id: '1',
      title: 'Physics - Newton\'s Laws of Motion Explained',
      channel: 'Physics Wallah',
      duration: '45:23',
      views: '2.1M',
      thumbnail: '/api/placeholder/320/180',
      url: 'https://youtube.com/watch?v=example1',
      subject: 'Physics',
      level: 'intermediate',
      language: 'en'
    },
    {
      id: '2',
      title: 'Chemistry - Organic Reactions Complete Guide',
      channel: 'Unacademy JEE',
      duration: '1:15:30',
      views: '1.8M',
      thumbnail: '/api/placeholder/320/180',
      url: 'https://youtube.com/watch?v=example2',
      subject: 'Chemistry',
      level: 'advanced',
      language: 'en'
    },
    {
      id: '3',
      title: 'Mathematics - Calculus Integration Techniques',
      channel: 'Khan Academy',
      duration: '32:15',
      views: '950K',
      thumbnail: '/api/placeholder/320/180',
      url: 'https://youtube.com/watch?v=example3',
      subject: 'Mathematics',
      level: 'intermediate',
      language: 'en'
    },
    // NEET Videos
    {
      id: '4',
      title: 'Biology - Cell Structure and Functions',
      channel: 'BYJU\'S NEET',
      duration: '42:18',
      views: '3.2M',
      thumbnail: '/api/placeholder/320/180',
      url: 'https://youtube.com/watch?v=example4',
      subject: 'Biology',
      level: 'beginner',
      language: 'en'
    },
    {
      id: '5',
      title: 'Chemistry - Chemical Bonding Concepts',
      channel: 'Vedantu NEET',
      duration: '38:45',
      views: '1.5M',
      thumbnail: '/api/placeholder/320/180',
      url: 'https://youtube.com/watch?v=example5',
      subject: 'Chemistry',
      level: 'intermediate',
      language: 'en'
    },
    {
      id: '6',
      title: 'Physics - Waves and Oscillations',
      channel: 'Aakash NEET',
      duration: '52:30',
      views: '890K',
      thumbnail: '/api/placeholder/320/180',
      url: 'https://youtube.com/watch?v=example6',
      subject: 'Physics',
      level: 'advanced',
      language: 'en'
    },
    // Hindi Videos
    {
      id: '7',
      title: 'भौतिकी - गति के नियम (Physics - Laws of Motion)',
      channel: 'Physics Wallah Hindi',
      duration: '48:12',
      views: '4.2M',
      thumbnail: '/api/placeholder/320/180',
      url: 'https://youtube.com/watch?v=example7',
      subject: 'Physics',
      level: 'intermediate',
      language: 'hi'
    },
    {
      id: '8',
      title: 'रसायन विज्ञान - कार्बनिक रसायन (Organic Chemistry)',
      channel: 'Unacademy Hindi',
      duration: '55:20',
      views: '2.8M',
      thumbnail: '/api/placeholder/320/180',
      url: 'https://youtube.com/watch?v=example8',
      subject: 'Chemistry',
      level: 'advanced',
      language: 'hi'
    }
  ];

  const filteredVideos = videoResources.filter(video => {
    const matchesLanguage = selectedLanguage === 'all' || video.language === selectedLanguage;
    const matchesSubject = selectedSubject === 'all' || video.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesLanguage && matchesSubject && matchesSearch;
  });

  const getSubjectsForStream = () => {
    if (userStream === 'JEE') {
      return ['Physics', 'Chemistry', 'Mathematics'];
    } else if (userStream === 'NEET') {
      return ['Biology', 'Chemistry', 'Physics'];
    }
    return ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  };

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
                <Youtube className="h-8 w-8 text-red-500" />
                Learning Videos
              </h1>
              <p className="text-muted-foreground mt-1">
                Curated educational content for {userStream} preparation
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search videos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getSubjectsForStream().map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Play className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.level}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm line-clamp-2 h-10">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-xs">
                      <User className="h-3 w-3" />
                      {video.channel}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{video.views} views</span>
                      <Badge variant="outline" className="text-xs">
                        {video.subject}
                      </Badge>
                    </div>
                    <Button 
                      className="w-full mt-3" 
                      size="sm"
                      onClick={() => window.open(video.url, '_blank')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Youtube className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No videos found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}

          {/* Study Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Study Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Effective Video Learning:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Take notes while watching</li>
                    <li>• Pause and practice problems</li>
                    <li>• Watch at appropriate speed</li>
                    <li>• Review difficult concepts</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Language Learning:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Start with your native language</li>
                    <li>• Gradually try English content</li>
                    <li>• Use subtitles when available</li>
                    <li>• Practice technical vocabulary</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}