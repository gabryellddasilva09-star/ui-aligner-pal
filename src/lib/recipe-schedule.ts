import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { defaultRecipeSchedule } from "@/data/default-plans";

export const recipeScheduleSchema = z.object({
  recipeId: z.string().min(1).max(60),
  weekdays: z.array(z.number().int().min(0).max(6)).max(7).transform((d) => [...new Set(d)].sort()),
});

export function useRecipeSchedule() {
  return useQuery({
    queryKey: ["recipe-schedule"],
    queryFn: async () => {
      const { data, error } = await supabase.from("recipe_schedule").select("recipe_id, weekdays");
      if (error) throw error;
      if (data && data.length) return data;
      // First visit: no saved rows ever (removals keep rows with empty days), so apply the default week.
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return [];
      const rows = defaultRecipeSchedule().map(r => ({ user_id: auth.user!.id, recipe_id: r.id, weekdays: r.weekdays }));
      const { error: seedError } = await supabase.from("recipe_schedule").upsert(rows, { onConflict: "user_id,recipe_id", ignoreDuplicates: true });
      if (seedError) throw seedError;
      return rows.map(r => ({ recipe_id: r.recipe_id, weekdays: r.weekdays }));
    },
  });
}

export function useSaveRecipeSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { recipeId: string; weekdays: number[] }) => {
      const p = recipeScheduleSchema.parse(input);
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!data.user) throw new Error("Entre na sua conta para salvar.");
      const { error } = await supabase.from("recipe_schedule").upsert({
        user_id: data.user.id, recipe_id: p.recipeId, weekdays: p.weekdays, updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,recipe_id" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipe-schedule"] }),
  });
}
