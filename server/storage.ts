import { db } from "./db";
import { words, readingPassages, users, type User, type InsertUser, type Word, type ReadingPassage } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWords(): Promise<Word[]>;
  getReadingPassages(): Promise<ReadingPassage[]>;
  getReadingPassage(id: number): Promise<ReadingPassage | undefined>;
  
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getWords(): Promise<Word[]> {
    return await db.select().from(words);
  }

  async getReadingPassages(): Promise<ReadingPassage[]> {
    return await db.select().from(readingPassages);
  }

  async getReadingPassage(id: number): Promise<ReadingPassage | undefined> {
    const [passage] = await db.select().from(readingPassages).where(eq(readingPassages.id, id));
    return passage;
  }

  async seedData(): Promise<void> {
    const existingWords = await this.getWords();
    if (existingWords.length === 0) {
      await db.insert(words).values([
        { word: "application", translation: "aplicación", definition: "A formal request to an authority for something.", pronunciation: "/ˌapləˈkāSH(ə)n/", exampleSentence: "I submitted my application for the job." },
        { word: "work", translation: "trabajo", definition: "Activity involving mental or physical effort done in order to achieve a purpose or result.", pronunciation: "/wərk/", exampleSentence: "She is at work right now." },
        { word: "employee", translation: "empleado", definition: "A person employed for wages or salary, especially at non-executive level.", pronunciation: "/əmˈploiē/", exampleSentence: "The company has 50 employees." },
        { word: "hours", translation: "horas", definition: "A period of time equal to sixty minutes.", pronunciation: "/ˈou(ə)rz/", exampleSentence: "I work long hours." },
        { word: "shift", translation: "turno", definition: "One of two or more recurring periods in which different groups of workers do the same jobs in relay.", pronunciation: "/SHift/", exampleSentence: "He works the night shift." },
        { word: "matey", translation: "amigo", definition: "A familiar and sometimes hostile form of address, especially to a stranger.", pronunciation: "/ˈmādē/", exampleSentence: "Hello there, matey!" }
      ]);
    }

    const existingPassages = await this.getReadingPassages();
    if (existingPassages.length === 0) {
      await db.insert(readingPassages).values([
        {
          title: "Treasure Island Excerpt",
          content: `"Well, then," said he, "this is the berth for me. Here you, matey," he cried to the man who trundled the barrow; "bring up alongside and help up my chest. I'll stay here a bit," he continued.`,
          level: "Intermediate",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Treasure_Island_cover.jpg/220px-Treasure_Island_cover.jpg" // Placeholder or use generated image later
        }
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
