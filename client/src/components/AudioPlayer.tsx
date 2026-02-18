import { Volume2 } from "lucide-react";
import { useState } from "react";
import { textToSpeech } from "@/replit_integrations/audio"; 

interface AudioPlayerProps {
  text: string;
  className?: string;
}

export function AudioPlayer({ text, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    // Use Web Speech API as fallback/immediate feedback for UI prototype
    // In production, we would use the backend TTS for higher quality
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      disabled={isPlaying}
      className={`
        p-2 rounded-full hover:bg-primary/10 active:scale-95 transition-all
        text-primary/80 hover:text-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={`Play pronunciation for ${text}`}
    >
      <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
    </button>
  );
}
