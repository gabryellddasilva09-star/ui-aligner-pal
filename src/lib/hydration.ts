import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { todayKey } from "@/lib/records";
import { adjustWater, waterGoal, waterGoalSchema } from "@/lib/hydration-values";

export function useHydration(date = todayKey()) {
  const qc = useQueryClient();
  const account = useQuery({
    queryKey: ["hydration-account"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!data.user) throw new Error("Entre na sua conta para registrar água.");
      return { id: data.user.id, goal: waterGoal(data.user.user_metadata.water_goal_ml) };
    },
  });
  const id = account.data?.id;
  const key = ["hydration", id, date];
  const consumption = useQuery({
    queryKey: key,
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("Sem sessão");
      const { data, error } = await supabase.from("daily_progress").select("water_cups").eq("user_id", id).eq("progress_date", date).maybeSingle();
      if (error) throw error;
      return (data?.water_cups ?? 0) * 250;
    },
  });
  const change = useMutation({
    mutationFn: async (direction: 1 | -1) => {
      if (!id) throw new Error("Sem sessão");
      const amount = adjustWater(consumption.data ?? 0, direction);
      // Update only water: the other daily snapshot fields must remain untouched.
      const { error } = await supabase.from("daily_progress").upsert({
        user_id: id, progress_date: date, water_cups: amount / 250, updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,progress_date" });
      if (error) throw error;
      return amount;
    },
    onSuccess: (amount) => {
      qc.setQueryData(key, amount);
      void qc.invalidateQueries({ queryKey: ["daily-progress"] });
    },
  });
  const saveGoal = useMutation({
    mutationFn: async (value: number) => {
      const goal = waterGoalSchema.parse(value);
      const { error } = await supabase.auth.updateUser({ data: { water_goal_ml: goal } });
      if (error) throw error;
      return goal;
    },
    onSuccess: (goal) => {
      if (id) qc.setQueryData(["hydration-account"], { id, goal });
    },
  });
  return {
    amount: consumption.data ?? 0, goal: account.data?.goal ?? waterGoal(undefined),
    ready: account.isSuccess && consumption.isSuccess,
    error: account.isError || consumption.isError || change.isError,
    change, saveGoal,
  };
}