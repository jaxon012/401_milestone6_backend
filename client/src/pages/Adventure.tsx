import { Layout } from "@/components/Layout";
import { useGameSession, useGenerateSceneImage } from "@/hooks/use-adventure";
import { useVoiceRecorder, useVoiceStream } from "@/replit_integrations/audio";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function Adventure() {
  const { sessionId, createSession, isCreating } = useGameSession();
  const { mutate: generateImage, isPending: isGeneratingImage } = useGenerateSceneImage();
  const [sceneImage, setSceneImage] = useState<string | null>(null);
  
  // Game state
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "You find yourself at the edge of a mysterious forest. The trees whisper in a language you don't understand. A path splits in two: one leads towards a glowing cave (Cave), and the other towards a mountain peak (Mountain). What do you do?" }
  ]);
  const [textInput, setTextInput] = useState("");
  
  // Audio hooks
  const recorder = useVoiceRecorder();
  const stream = useVoiceStream({
    onUserTranscript: (text) => {
      addMessage('user', text);
    },
    onTranscript: (text, full) => {
      // Update the last assistant message with streaming text
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last.role === 'assistant') {
          return [...prev.slice(0, -1), { ...last, content: full }];
        }
        return [...prev, { role: 'assistant', content: full }];
      });
    },
    onComplete: (fullText) => {
      // Generate new image based on the response
      generateImage(fullText, {
        onSuccess: (data) => setSceneImage(data.url)
      });
    }
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-start session on mount
  useEffect(() => {
    if (!sessionId && !isCreating) {
      createSession.mutate();
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const handleVoiceInput = async () => {
    if (!sessionId) return;
    
    if (recorder.state === "recording") {
      const blob = await recorder.stopRecording();
      // Optimistic UI update handled by stream callbacks
      await stream.streamVoiceResponse(`/api/conversations/${sessionId}/messages`, blob);
    } else {
      await recorder.startRecording();
    }
  };

  const handleTextInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !sessionId) return;

    const content = textInput;
    setTextInput("");
    addMessage('user', content);

    // Send text message (backend handles TTS response if needed, but for now we'll assume text-only response for text input)
    // For this prototype, we'll mimic the voice flow but via a text endpoint if available.
    // Since we only set up voice routes in the example, we'll simulate a fetch to the chat endpoint
    
    try {
      const res = await fetch(`/api/conversations/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      // Handle streaming text response manually since useVoiceStream is for audio
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      
      // Add empty assistant message to fill
      addMessage('assistant', "");
      
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantMessage += data.content;
                setMessages(prev => {
                   const newMsgs = [...prev];
                   newMsgs[newMsgs.length - 1].content = assistantMessage;
                   return newMsgs;
                });
              }
            } catch (e) {}
          }
        }
      }
      
      // Generate image after text complete
      generateImage(assistantMessage, {
        onSuccess: (data) => setSceneImage(data.url)
      });
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Adventure Mode" showBack>
      <div className="h-[calc(100vh-180px)] flex flex-col gap-4">
        
        {/* Dynamic Scene Image */}
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border border-border bg-black/10 shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={sceneImage || "placeholder"}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              src={sceneImage || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80"} // Forest placeholder
              alt="Current scene"
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          
          {isGeneratingImage && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/10">
            Scene: The Mysterious Forest
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-4 px-1" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-white border border-border/50 text-foreground rounded-tl-none'}
                `}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {/* Invisible padding for bottom scroll */}
          <div className="h-4" /> 
        </div>

        {/* Controls Area */}
        <div className="bg-card border border-border rounded-3xl p-2 shadow-lg flex items-center gap-2">
          {/* Text Input */}
          <form onSubmit={handleTextInput} className="flex-1 flex items-center bg-secondary/30 rounded-2xl px-3 border border-transparent focus-within:border-primary/30 transition-colors">
            <input 
              type="text" 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="What do you do?"
              className="flex-1 bg-transparent py-3 outline-none text-sm placeholder:text-muted-foreground"
            />
            {textInput && (
              <button type="submit" className="text-primary hover:text-primary/80 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Voice Input Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleVoiceInput}
            className={`
              w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all
              ${recorder.state === "recording" 
                ? 'bg-red-500 text-white shadow-red-500/30' 
                : 'bg-primary text-white shadow-primary/30 hover:bg-primary/90'}
            `}
          >
            {recorder.state === "recording" ? (
              <Square className="w-5 h-5 fill-current" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>
    </Layout>
  );
}
