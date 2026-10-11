import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { dailyRecordSchema, type DailyRecord } from "@/components/vl/daily-check-in";

export type StoredRecord = DailyRecord & { date: string };

export function todayKey(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function fromRow(row: Tables<"daily_records">): StoredRecord | null {
  const parsed = dailyRecordSchema.safeParse({
    mood: row.mood, sleep: row.sleep, pain: row.pain, fatigue: row.fatigue, disposition: row.disposition,
    bodyPain: row.body_pain && typeof row.body_pain === "object" && Object.keys(row.body_pain).length ? row.body_pain : undefined,
    bedTime: row.bed_time ? String(row.bed_time).slice(0, 5) : undefined,
    wakeTime: row.wake_time ? String(row.wake_time).slice(0, 5) : undefined,
    awakenings: row.awakenings ?? undefined,
    brainFog: row.brain_fog ?? undefined,
    brainFogNote: row.brain_fog_note ?? undefined,
    cycle: row.cycle ?? undefined,
    triggers: row.triggers?.length ? row.triggers : undefined,
  });
  return parsed.success ? { ...parsed.data, date: String(row.record_date) } : null;
}

export const recordsKey = ["daily_records"] as const;

export function useRecords() {
  return useQuery({
    queryKey: recordsKey,
    queryFn: async () => {
      const { data, error } = await supabase.from("daily_records").select("*").order("record_date", { ascending: false }).limit(120);
      if (error) throw error;
      return (data ?? []).map(r => fromRow(r)).filter((r): r is StoredRecord => r !== null);
    },
  });
}

export function useSaveRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (r: DailyRecord) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sem sessão");
      const { error } = await supabase.from("daily_records").upsert({
        user_id: u.user.id, record_date: todayKey(),
        mood: r.mood, sleep: r.sleep, pain: r.pain, fatigue: r.fatigue, disposition: r.disposition,
        body_pain: r.bodyPain ?? {}, bed_time: r.bedTime ?? null, wake_time: r.wakeTime ?? null,
        awakenings: r.awakenings ?? null, brain_fog: r.brainFog ?? null, brain_fog_note: r.brainFogNote ?? null,
        cycle: r.cycle ?? null, triggers: r.triggers ?? [],
      }, { onConflict: "user_id,record_date" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: recordsKey }),
  });
}

/** Hours slept from bed/wake times (crosses midnight). */
export function sleepHours(r: DailyRecord): number | null {
  if (!r.bedTime || !r.wakeTime) return null;
  const [bh = 0, bm = 0] = r.bedTime.split(":").map(Number);
  const [wh = 0, wm = 0] = r.wakeTime.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins <= 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

export const scoreMaps = {
  mood: { Feliz: 9, Tranquila: 8, Neutra: 5, Triste: 3, Ansiosa: 3 } as Record<string, number>,
  disposition: { Boa: 8, "Mais ou menos": 5, Baixa: 2 } as Record<string, number>,
  fatigue: { Nenhum: 0, Leve: 3, Moderado: 6, Intenso: 9 } as Record<string, number>,
  sleepQuality: { "Dormi bem": 8, "Dormi mais ou menos": 5, "Dormi mal": 2 } as Record<string, number>,
};

/** Descriptive (non-clinical) comparison: average pain on days with a given trigger vs. without. */
export function describePatterns(records: StoredRecord[]) {
  if (records.length < 5) return null;
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const found: { label: string; with: number; without: number }[] = [];
  const tests: [string, (r: StoredRecord) => boolean][] = [
    ["dormiu mal", r => r.sleep === "Dormi mal"],
    ...["Chuva ou frio", "Estresse", "Esforço físico", "Comida diferente", "Preocupação"].map(t => [t.toLowerCase(), (r: StoredRecord) => !!r.triggers?.includes(t as never)] as [string, (r: StoredRecord) => boolean]),
  ];
  for (const [label, fn] of tests) {
    const a = records.filter(fn).map(r => r.pain), b = records.filter(r => !fn(r)).map(r => r.pain);
    if (a.length >= 2 && b.length >= 2) found.push({ label, with: avg(a), without: avg(b) });
  }
  found.sort((x, y) => (y.with - y.without) - (x.with - x.without));
  const top = found[0];
  if (!top || top.with - top.without < 1) return null;
  return top;
}

export const fmt = (n: number) => n.toFixed(1).replace(".", ",");
