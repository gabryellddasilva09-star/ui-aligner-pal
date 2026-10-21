import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const progressSnapshotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pct: z.number().int().min(0).max(100),
  exercises: z.array(z.string().max(60)).max(60),
  exercisesTotal: z.number().int().min(0).max(60),
  meals: z.array(z.string().max(60)).max(30),
  mealsTotal: z.number().int().min(0).max(30),
  sleepDone: z.boolean(),
  water: z.number().int().min(0).max(40),
});
export type ProgressSnapshot = z.infer<typeof progressSnapshotSchema>;

/** Only days with some progress are worth keeping in the history. */
export const shouldSaveSnapshot = (s: Pick<ProgressSnapshot, "pct" | "water">) => s.pct > 0 || s.water > 0;

const key = ["daily-progress"];

export function useProgressHistory() {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("daily_progress").select("*").order("progress_date", { ascending: false }).limit(120);
      if (error) throw error;
      return (data ?? []).map(r => ({
        date: r.progress_date, pct: r.pct, exercises: r.exercises, exercisesTotal: r.exercises_total,
        meals: r.meals, mealsTotal: r.meals_total, sleepDone: r.sleep_done, water: r.water_cups,
      }) satisfies ProgressSnapshot);
    },
  });
}

export function useSaveProgressSnapshot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProgressSnapshot) => {
      const s = progressSnapshotSchema.parse(input);
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const { error } = await supabase.from("daily_progress").upsert({
        user_id: data.user.id, progress_date: s.date, pct: s.pct, exercises: s.exercises, exercises_total: s.exercisesTotal,
        meals: s.meals, meals_total: s.mealsTotal, sleep_done: s.sleepDone, water_cups: s.water, updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,progress_date" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}
