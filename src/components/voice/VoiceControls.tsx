import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceControlsProps {
  onTranscription: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

export function VoiceControls({ onTranscription, isListening, setIsListening }: VoiceControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  // Text-to-Speech function
  const speakText = useCallback(async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' }
      });

      if (error) throw error;

      // Play the audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audio.play();
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      toast({
        title: "Voice Error",
        description: "Failed to convert text to speech",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Speech-to-Text function
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      const context = new AudioContext({ sampleRate: 16000 });
      setAudioContext(context);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus'
        });

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          try {
            const { data, error } = await supabase.functions.invoke('speech-to-text', {
              body: { audio: base64Audio }
            });

            if (error) throw error;

            if (data.text && data.text.trim()) {
              onTranscription(data.text);
            }
          } catch (error) {
            console.error('Error with speech-to-text:', error);
            toast({
              title: "Voice Error",
              description: "Failed to convert speech to text",
              variant: "destructive",
            });
          }
        };
        reader.readAsDataURL(audioBlob);

        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsListening(true);

      toast({
        title: "Recording Started",
        description: "Speak now...",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Failed to access microphone",
        variant: "destructive",
      });
    }
  }, [onTranscription, setIsListening, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
      
      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
      }
    }
  }, [audioContext, isRecording, setIsListening]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="sm"
        onClick={toggleRecording}
        className="flex items-center gap-2"
      >
        {isRecording ? (
          <>
            <MicOff className="h-4 w-4" />
            Stop
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            Speak
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => speakText("Text-to-speech is working!")}
        className="flex items-center gap-2"
        title="Test Text-to-Speech"
      >
        <Volume2 className="h-4 w-4" />
        Speak Test
      </Button>
    </div>
  );
}