import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/chat";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  streak: integer("streak").default(0),
  lastLoginDate: timestamp("last_login_date"),
});

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
  translation: text("translation").notNull(),
  definition: text("definition").notNull(),
  pronunciation: text("pronunciation"),
  exampleSentence: text("example_sentence"),
  category: text("category").default("general"),
});

export const readingPassages = pgTable("reading_passages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  level: text("level").default("beginner"),
  imageUrl: text("image_url"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, streak: true, lastLoginDate: true });
export const insertWordSchema = createInsertSchema(words).omit({ id: true });
export const insertReadingPassageSchema = createInsertSchema(readingPassages).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Word = typeof words.$inferSelect;
export type InsertWord = z.infer<typeof insertWordSchema>;
export type ReadingPassage = typeof readingPassages.$inferSelect;
export type InsertReadingPassage = z.infer<typeof insertReadingPassageSchema>;
