import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useWords() {
  return useQuery({
    queryKey: [api.words.list.path],
    queryFn: async () => {
      const res = await fetch("/api/words", { credentials: "include" });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to fetch words");
      }
      const data = await res.json();
      const parsed = api.words.list.responses[200].safeParse(data);
      if (!parsed.success) {
        console.error("Words API parse error:", parsed.error);
        return Array.isArray(data) ? data : [];
      }
      return parsed.data;
    },
  });
}
