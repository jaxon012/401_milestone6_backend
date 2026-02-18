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
    const words = await storage.getWords();
    res.json(words);
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
