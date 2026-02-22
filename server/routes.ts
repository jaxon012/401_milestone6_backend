import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { registerImageRoutes } from "./replit_integrations/image";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register Integration Routes
  registerAudioRoutes(app);
  registerImageRoutes(app);

  app.get(api.words.list.path, async (req, res) => {
    // For now, hardcode userId to 1 (demo user)
    const userId = 1;
    const words = await storage.getWords(userId);
    res.json(words);
  });

  app.patch(api.wordProgress.update.path, async (req, res) => {
    try {
      const userWordId = Number(req.params.userWordId);
      
      if (!userWordId || isNaN(userWordId)) {
        return res.status(400).json({ message: "Invalid userWordId" });
      }

      const updated = await storage.updateWordProgress(userWordId);
      
      if (!updated) {
        return res.status(404).json({ message: "Word progress not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating word progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.readingPassages.list.path, async (req, res) => {
    const passages = await storage.getReadingPassages();
    res.json(passages);
  });

  app.get(api.readingPassages.get.path, async (req, res) => {
    const passage = await storage.getReadingPassage(Number(req.params.id));
    if (!passage) {
      return res.status(404).json({ message: "Passage not found" });
    }
    res.json(passage);
  });

  // Seed data on startup
  await storage.seedData();

  return httpServer;
}
