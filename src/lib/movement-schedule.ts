import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const scheduleInputSchema = z.object({
  exerciseId: z.enum(["pescoco", "ombros", "bracos", "quadril", "pernas", "cadeira"]),
  weekdays: z.array(z.number().int().min(0).max(6)).max(7).transform(days => [...new Set(days)].sort()),
});

const identityKey = ["movement-schedule-user"] as const;

function useScheduleUser() {
  return useQuery({
    queryKey: identityKey,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!data.user) throw new Error("Entre na sua conta para editar seu plano.");
      return data.user.id;
    },
  });
}

export function useMovementSchedule() {
  const user = useScheduleUser();
  const query = useQuery({
    queryKey: ["movement-schedule", user.data],
    enabled: !!user.data,
    queryFn: async () => {
      if (!user.data) throw new Error("Sem sessão");
      const { data, error } = await supabase.from("movement_exercise_schedule")
        .select("exercise_id, weekdays").eq("user_id", user.data);
      if (error) throw error;
      return data ?? [];
    },
  });
  return { ...query, isPending: user.isPending || query.isPending, error: user.error ?? query.error };
}

export function useSaveMovementSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { exerciseId: string; weekdays: number[] }) => {
      const parsed = scheduleInputSchema.parse(input);
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!data.user) throw new Error("Entre na sua conta para salvar.");
      const { error } = await supabase.from("movement_exercise_schedule").upsert({
        user_id: data.user.id,
        exercise_id: parsed.exerciseId,
        weekdays: parsed.weekdays,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,exercise_id" });
      if (error) throw error;
      return data.user.id;
    },
    onSuccess: async (userId) => {
      await qc.invalidateQueries({ queryKey: ["movement-schedule", userId] });
    },
  });
}

export function useMovementCompletions(startDate: string, endDate: string) {
  const user = useScheduleUser();
  const query = useQuery({
    queryKey: ["movement-completions", user.data, startDate, endDate],
    enabled: !!user.data,
    queryFn: async () => {
      if (!user.data) throw new Error("Sem sessão");
      const { data, error } = await supabase.from("movement_exercise_completions")
        .select("exercise_id, activity_date").eq("user_id", user.data)
        .gte("activity_date", startDate).lte("activity_date", endDate);
      if (error) throw error;
      return data ?? [];
    },
  });
  return { ...query, isPending: user.isPending || query.isPending, error: user.error ?? query.error };
}

export function useCompleteMovementExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { exerciseId: string; date: string }) => {
      const parsed = z.object({
        exerciseId: scheduleInputSchema.shape.exerciseId,
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }).parse(input);
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!data.user) throw new Error("Entre na sua conta para salvar.");
      const { error } = await supabase.from("movement_exercise_completions").insert({
        user_id: data.user.id, exercise_id: parsed.exerciseId, activity_date: parsed.date,
      });
      if (error && error.code !== "23505") throw error;
      return data.user.id;
    },
    onSuccess: async userId => {
      await qc.invalidateQueries({ queryKey: ["movement-completions", userId] });
    },
  });
}