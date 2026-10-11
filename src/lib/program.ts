import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProgram() {
  return useQuery({
    queryKey: ["program"],
    queryFn: async () => {
      const [e, p] = await Promise.all([
        supabase.from("program_enrollments").select("*").maybeSingle(),
        supabase.from("program_progress").select("*").order("day"),
      ]);
      if (e.error) throw e.error;
      if (p.error) throw p.error;
      return { enrollment: e.data, progress: p.data ?? [] };
    },
  });
}

/** Dia liberado hoje (1..30), contando a partir da data de início. */
export function unlockedDay(startedOn: string) {
  const start = new Date(startedOn + "T00:00:00");
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.max(1, Math.min(30, Math.floor((now.getTime() - start.getTime()) / 86400000) + 1));
}
