import { z } from 'zod';
import { insertUserSchema, insertWordSchema, insertReadingPassageSchema, words, readingPassages } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  words: {
    list: {
      method: 'GET' as const,
      path: '/api/words' as const,
      responses: {
        200: z.array(z.custom<typeof words.$inferSelect>()),
      },
    },
  },
  readingPassages: {
    list: {
        method: 'GET' as const,
        path: '/api/reading-passages' as const,
        responses: {
            200: z.array(z.custom<typeof readingPassages.$inferSelect>()),
        },
    },
    get: {
        method: 'GET' as const,
        path: '/api/reading-passages/:id' as const,
        responses: {
            200: z.custom<typeof readingPassages.$inferSelect>(),
            404: errorSchemas.notFound,
        },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
