import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

console.log("use-word-progress hook loaded, api.wordProgress.update.path:", api.wordProgress.update.path);

interface UpdateWordProgressRequest {
  userWordId: number;
}

export function useUpdateWordProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userWordId }: UpdateWordProgressRequest) => {
      const url = buildUrl(api.wordProgress.update.path, { userWordId });
      console.log("Making PATCH request to:", url);
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      console.log("Response status:", res.status);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to update word progress");
      }

      return await res.json();
    },
    onSuccess: (data) => {
      console.log("Mutation success, invalidating query");
      // Invalidate the words query to refetch updated data
      queryClient.invalidateQueries({ queryKey: [api.words.list.path] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
}
