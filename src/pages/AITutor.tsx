import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  MoreHorizontal, 
  BookOpen, 
  Lightbulb,
  MessageSquare,
  Clock,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  context?: 'explain_more' | 'examples' | 'normal';
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      // For demo purposes, load from localStorage
      const stored = localStorage.getItem('ai-conversations');
      if (stored) {
        setConversations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const sendMessage = async (content: string, context: 'explain_more' | 'examples' | 'normal' = 'normal') => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
      context
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentMessage('');

    try {
      // Call the actual AI tutor API
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
        body: {
          message: content,
          context,
          conversationHistory: messages.slice(-4) // Last 4 messages for context
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I apologize, but I'm having trouble right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
        context
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save conversation
      if (activeConversationId) {
        updateLocalConversation(activeConversationId, content);
      } else {
        createLocalConversation(content);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to mock response if API fails
      const fallbackResponse = generateMockAIResponse(content, context);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponse,
        isUser: false,
        timestamp: new Date(),
        context
      };

      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "Using offline mode",
        description: "AI tutor is running in demo mode. Connect your OpenAI API key for full functionality.",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAIResponse = (content: string, context: string) => {
    const responses = {
      normal: [
        "Great question! Let me help you understand this concept better. " + content.includes('math') ? 
          "Mathematics is all about patterns and problem-solving. The key is to break down complex problems into smaller, manageable steps." :
          "This is an important topic to understand. Let me explain it in simple terms that will help you grasp the core concepts.",
        "I'm happy to help with that! " + (content.includes('science') ?
          "Science is fascinating because it helps us understand how the world works around us." :
          "Learning new concepts can be challenging, but with the right approach, you'll master this in no time."),
        "That's a really good question! " + (content.includes('program') || content.includes('code') ?
          "Programming is like learning a new language - it takes practice, but once you understand the fundamentals, it becomes much easier." :
          "Understanding this concept will give you a strong foundation for more advanced topics.")
      ],
      explain_more: [
        "Let me dive deeper into this topic for you. " + (content.includes('math') ?
          "In mathematics, it's crucial to understand not just the 'how' but also the 'why' behind each step. Let me break this down further with more detailed explanations and show you the underlying principles." :
          "To give you a more comprehensive understanding, let me explain the background, context, and various aspects of this concept in greater detail."),
        "I'll provide you with a more thorough explanation. " + (content.includes('science') ?
          "In science, every concept builds upon previous knowledge, so let me show you the connections and provide more depth to help you see the bigger picture." :
          "Understanding the nuances and details will help you apply this knowledge more effectively in different situations.")
      ],
      examples: [
        "Here are some practical examples to illustrate this concept:\n\n**Example 1:** " + (content.includes('math') ?
          "Let's say you're calculating the area of a triangle. If the base is 6 units and height is 4 units, you'd use the formula: Area = ½ × base × height = ½ × 6 × 4 = 12 square units." :
          "Imagine you're organizing your daily schedule. You can apply time management principles by breaking tasks into smaller chunks.") +
          "\n\n**Example 2:** " + (content.includes('program') ?
          "In programming, if you want to print 'Hello World', you might write: `console.log('Hello World');` in JavaScript." :
          "Another way to think about this is like following a recipe - each step builds on the previous one.") +
          "\n\n**Example 3:** Practice with similar problems to reinforce your understanding.",
        "Let me show you this with concrete examples:\n\n• **Real-world application:** " + (content.includes('science') ?
          "Think about how plants use photosynthesis - they take sunlight, water, and carbon dioxide to create glucose and oxygen." :
          "Consider how you use this concept in everyday life.") +
          "\n\n• **Step-by-step demonstration:** I'll walk you through the process clearly.\n\n• **Common variations:** Here are different ways you might encounter this concept."
      ]
    };
    
    const categoryResponses = responses[context as keyof typeof responses] || responses.normal;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const createLocalConversation = (firstMessage: string) => {
    const newConversation = {
      id: Date.now().toString(),
      title: firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : ''),
      lastMessage: firstMessage,
      timestamp: new Date()
    };
    
    const updated = [newConversation, ...conversations];
    setConversations(updated);
    setActiveConversationId(newConversation.id);
    localStorage.setItem('ai-conversations', JSON.stringify(updated));
  };

  const updateLocalConversation = (conversationId: string, lastMessage: string) => {
    const updated = conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastMessage, timestamp: new Date() }
        : conv
    );
    setConversations(updated);
    localStorage.setItem('ai-conversations', JSON.stringify(updated));
  };

  const createNewConversation = async (firstMessage: string) => {
    createLocalConversation(firstMessage);
  };

  const updateConversation = async (conversationId: string, lastMessage: string) => {
    updateLocalConversation(conversationId, lastMessage);
  };

  const loadConversation = async (conversationId: string) => {
    // For demo purposes, just start a new conversation
    setActiveConversationId(conversationId);
    // In a real app, you'd load the actual messages from the database
    setMessages([]);
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
    setCurrentMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(currentMessage);
  };

  const TypingDots = () => (
    <motion.div 
      className="flex space-x-1 items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: dot * 0.2
          }}
        />
      ))}
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="flex h-full bg-background">
        {/* Left Sidebar - Conversations */}
        <div className="w-80 glass-card border-r border-glass-border flex flex-col">
          <div className="p-4 border-b border-glass-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">AI Tutor</h2>
              <Button onClick={startNewChat} size="sm" className="bg-primary hover:bg-primary/90">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
            
            {/* Student Profile */}
            <Card className="glass-card border-glass-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?img=44" />
                    <AvatarFallback>GS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-foreground">Grace Stanley</h3>
                    <p className="text-sm text-muted-foreground">Computer Science</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Conversations</h3>
            <AnimatePresence>
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-sidebar-accent ${
                    activeConversationId === conversation.id ? 'bg-primary text-primary-foreground' : 'bg-card'
                  }`}
                  onClick={() => loadConversation(conversation.id)}
                >
                  <h4 className="font-medium text-sm truncate">{conversation.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-70 truncate">{conversation.lastMessage}</p>
                    <Clock className="w-3 h-3 opacity-50" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-glass-border bg-card/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">AI Tutor</h2>
                  <p className="text-sm text-muted-foreground">Your personal learning assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Bot className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to AI Tutor!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Ask me anything about your studies. I'm here to help you learn with personalized explanations and examples.
                  </p>
                </motion.div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-2xl ${message.isUser ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="w-8 h-8">
                        {message.isUser ? (
                          <>
                            <AvatarImage src="https://i.pravatar.cc/150?img=44" />
                            <AvatarFallback>GS</AvatarFallback>
                          </>
                        ) : (
                          <>
                            <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-primary-foreground" />
                            </div>
                          </>
                        )}
                      </Avatar>
                      
                      <div className={`rounded-2xl p-4 ${
                        message.isUser 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-card border border-glass-border'
                      }`}>
                        <div 
                          className="prose prose-sm max-w-none dark:prose-invert"
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              code(props) {
                                const {children, className, ...rest} = props;
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                  <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={tomorrow}
                                    language={match[1]}
                                    PreTag="div"
                                  />
                                ) : (
                                  <code {...rest} className={`${className} px-1 py-0.5 rounded bg-muted`}>
                                    {children}
                                  </code>
                                );
                              }
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>

                        {!message.isUser && (
                          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-glass-border">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => sendMessage(message.content, 'explain_more')}
                              className="text-xs"
                            >
                              <MoreHorizontal className="w-3 h-3 mr-1" />
                              Explain More
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => sendMessage(message.content, 'examples')}
                              className="text-xs"
                            >
                              <Lightbulb className="w-3 h-3 mr-1" />
                              Examples
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-xs text-muted-foreground mt-1 ${message.isUser ? 'text-right mr-11' : 'ml-11'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="max-w-2xl">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </Avatar>
                      <div className="rounded-2xl p-4 bg-card border border-glass-border">
                        <TypingDots />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Recommended Resources */}
          <div className="p-4 border-t border-glass-border bg-card/30">
            <div className="flex items-center space-x-4 mb-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-medium text-foreground">Recommended Resources</h4>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {['Mathematics Basics', 'Programming Fundamentals', 'Science Concepts'].map((resource) => (
                <Button key={resource} variant="outline" size="sm" className="whitespace-nowrap">
                  {resource}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-glass-border bg-card/50">
            <div className="flex space-x-3">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask me anything about your studies..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={!currentMessage.trim() || isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}