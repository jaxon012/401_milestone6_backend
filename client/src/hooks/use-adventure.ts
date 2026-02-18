import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Hook to generate scene images
export function useGenerateSceneImage() {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size: "512x512" }), // Faster generation
      });
      if (!res.ok) throw new Error("Failed to generate image");
      return await res.json() as { url: string; b64_json: string };
    },
  });
}

// Hook for managing game session (conversations)
export function useGameSession() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  
  const createSession = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Adventure Game Session" }),
      });
      if (!res.ok) throw new Error("Failed to start game session");
      const data = await res.json();
      setSessionId(data.id);
      return data;
    },
  });

  return {
    sessionId,
    createSession,
    isCreating: createSession.isPending
  };
}
