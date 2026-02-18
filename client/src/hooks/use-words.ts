import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useWords() {
  return useQuery({
    queryKey: [api.words.list.path],
    queryFn: async () => {
      const res = await fetch(api.words.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch words");
      return api.words.list.responses[200].parse(await res.json());
    },
  });
}
