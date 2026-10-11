import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Check, Pill, Plus, Trash2, X, MessageSquareWarning } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { SectionHeader } from "@/components/vl/primitives";
import { Button } from "@/components/ui/button";
import { PushToggle } from "@/components/vl/push-toggle";
import { supabase } from "@/integrations/supabase/client";
import { todayKey } from "@/lib/records";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/remedios")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Meus remédios — VivaLeve" },
      { name: "description", content: "Lista dos seus remédios, horários, avisos para tomar e anotações de efeitos colaterais." },
      { property: "og:title", content: "Meus remédios — VivaLeve" },
      { property: "og:description", content: "Lista dos seus remédios, horários e efeitos colaterais." },
    ],
  }),
  component: Remedios,
});

const medSchema = z.object({ name: z.string().trim().min(1, "Escreva o nome do remédio.").max(120), dose: z.string().trim().max(120), times: z.array(z.string().regex(/^\d{2}:\d{2}$/)).min(1, "Coloque pelo menos um horário.").max(8) });

function Remedios() {
  const qc = useQueryClient();
  const today = todayKey();
  const meds = useQuery({ queryKey: ["medications"], queryFn: async () => { const { data, error } = await supabase.from("medications").select("*").eq("active", true).order("created_at"); if (error) throw error; return data; } });
  const logs = useQuery({ queryKey: ["medication_logs", today], queryFn: async () => { const { data, error } = await supabase.from("medication_logs").select("*").eq("taken_on", today); if (error) throw error; return data; } });
  const effects = useQuery({ queryKey: ["side_effects"], queryFn: async () => { const { data, error } = await supabase.from("side_effects").select("*").order("created_at", { ascending: false }).limit(30); if (error) throw error; return data; } });
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", dose: "", times: ["08:00"] });
  const [formError, setFormError] = useState("");
  const [effect, setEffect] = useState({ medId: "", note: "" });

  const userId = async () => { const { data } = await supabase.auth.getUser(); if (!data.user) throw new Error("Sem sessão"); return data.user.id; };
  const addMed = useMutation({
    mutationFn: async () => { const p = medSchema.parse(form); const { error } = await supabase.from("medications").insert({ user_id: await userId(), name: p.name, dose: p.dose || null, times: [...new Set(p.times)].sort() }); if (error) throw error; },
    onSuccess: () => { setAdding(false); setForm({ name: "", dose: "", times: ["08:00"] }); qc.invalidateQueries({ queryKey: ["medications"] }); },
  });
  const removeMed = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("medications").update({ active: false }).eq("id", id); if (error) throw error; }, onSuccess: () => qc.invalidateQueries({ queryKey: ["medications"] }) });
  const toggleTaken = useMutation({
    mutationFn: async ({ medId, slot }: { medId: string; slot: string }) => {
      const existing = logs.data?.find(l => l.medication_id === medId && l.slot === slot);
      const { error } = existing ? await supabase.from("medication_logs").delete().eq("id", existing.id) : await supabase.from("medication_logs").insert({ user_id: await userId(), medication_id: medId, slot, taken_on: today });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medication_logs", today] }),
  });
  const addEffect = useMutation({
    mutationFn: async () => { const note = effect.note.trim(); if (!note) throw new Error("vazio"); const { error } = await supabase.from("side_effects").insert({ user_id: await userId(), note: note.slice(0, 1000), medication_id: effect.medId || null }); if (error) throw error; },
    onSuccess: () => { setEffect({ medId: "", note: "" }); qc.invalidateQueries({ queryKey: ["side_effects"] }); },
  });
  function submit() { const r = medSchema.safeParse(form); if (!r.success) { setFormError(r.error.issues[0]?.message ?? "Confira os dados."); return; } setFormError(""); addMed.mutate(); }
  const medName = (id: string | null) => meds.data?.find(m => m.id === id)?.name;

  return <AppShell>
    <div className="mx-auto max-w-3xl space-y-8 pt-6 lg:pt-0">
      <SectionHeader title="Meus remédios" subtitle="O que você toma, em que horário, e como se sentiu." />
      <PushToggle />

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Hoje</h2>
        {meds.isLoading ? <p className="text-muted-foreground">Carregando…</p>
          : meds.isError ? <p role="alert" className="text-destructive">Não conseguimos carregar seus remédios.</p>
          : !meds.data?.length ? <p className="card-soft p-6 text-muted-foreground">Você ainda não cadastrou nenhum remédio.</p>
          : meds.data.map(m => <div key={m.id} className="card-soft p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Pill className="size-5" /></span>
              <div className="min-w-0 flex-1"><p className="text-lg font-medium">{m.name}</p>{m.dose && <p className="text-muted-foreground">{m.dose}</p>}</div>
              <Button variant="ghost" size="icon" className="size-11" aria-label={`Remover ${m.name}`} onClick={() => { if (confirm(`Remover ${m.name} da lista?`)) removeMed.mutate(m.id); }}><Trash2 /></Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {m.times.map(t => { const done = !!logs.data?.some(l => l.medication_id === m.id && l.slot === t); return <Button key={t} variant="outline" aria-pressed={done} onClick={() => toggleTaken.mutate({ medId: m.id, slot: t })}
                className={cn("h-14 min-w-28 rounded-xl text-base", done && "border-good bg-good/10 text-good")}>{done && <Check className="size-5" />}{t} {done ? "· tomei" : ""}</Button>; })}
            </div>
          </div>)}
        {adding ? <div className="card-soft space-y-4 p-5">
          <label className="block">Nome do remédio<input value={form.name} maxLength={120} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="mt-1 h-12 w-full rounded-xl border bg-card px-3 text-base" /></label>
          <label className="block">Quantidade <span className="text-muted-foreground">(opcional, ex.: 1 comprimido)</span><input value={form.dose} maxLength={120} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} className="mt-1 h-12 w-full rounded-xl border bg-card px-3 text-base" /></label>
          <div><p>Horários</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {form.times.map((t, i) => <div key={i} className="flex items-center gap-1">
                <input type="time" aria-label={`Horário ${i + 1}`} value={t} onChange={e => setForm(f => ({ ...f, times: f.times.map((x, j) => j === i ? e.target.value : x) }))} className="h-12 rounded-xl border bg-card px-3 text-base" />
                {form.times.length > 1 && <Button variant="ghost" size="icon" className="size-11" aria-label="Tirar horário" onClick={() => setForm(f => ({ ...f, times: f.times.filter((_, j) => j !== i) }))}><X /></Button>}
              </div>)}
              {form.times.length < 8 && <Button variant="outline" className="h-12 rounded-xl" onClick={() => setForm(f => ({ ...f, times: [...f.times, "20:00"] }))}><Plus />Outro horário</Button>}
            </div>
          </div>
          {(formError || addMed.isError) && <p role="alert" className="text-sm text-destructive">{formError || "Não conseguimos salvar. Tente de novo."}</p>}
          <div className="flex gap-2"><Button className="h-12 flex-1 rounded-xl text-base" disabled={addMed.isPending} onClick={submit}>Salvar remédio</Button><Button variant="ghost" className="h-12" onClick={() => setAdding(false)}>Cancelar</Button></div>
        </div> : <Button variant="outline" className="h-14 w-full rounded-xl text-base" onClick={() => setAdding(true)}><Plus className="size-5" />Adicionar remédio</Button>}
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-xl font-medium"><MessageSquareWarning className="size-5 text-primary" />Efeitos colaterais</h2>
        <p className="text-muted-foreground">Sentiu algo diferente? Anote aqui para mostrar na consulta.</p>
        <div className="card-soft space-y-3 p-5">
          {!!meds.data?.length && <label className="block text-sm">Qual remédio? <span className="text-muted-foreground">(opcional)</span>
            <select value={effect.medId} onChange={e => setEffect(x => ({ ...x, medId: e.target.value }))} className="mt-1 h-12 w-full rounded-xl border bg-card px-3 text-base"><option value="">Não sei / vários</option>{meds.data.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label>}
          <textarea aria-label="O que você sentiu" rows={3} maxLength={1000} value={effect.note} onChange={e => setEffect(x => ({ ...x, note: e.target.value }))} placeholder="Ex.: fiquei com sono à tarde, enjoo leve…" className="w-full rounded-xl border bg-card p-3 text-base" />
          <Button className="h-12 w-full rounded-xl text-base" disabled={!effect.note.trim() || addEffect.isPending} onClick={() => addEffect.mutate()}>Guardar anotação</Button>
        </div>
        {effects.data?.map(e => <div key={e.id} className="rounded-2xl bg-secondary p-4">
          <p className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}{medName(e.medication_id) ? ` · ${medName(e.medication_id)}` : ""}</p>
          <p className="mt-1">{e.note}</p>
        </div>)}
        <p className="text-sm text-muted-foreground">Nunca pare ou mude um remédio por conta própria. Se o efeito for forte, procure quem cuida de você.</p>
      </section>
    </div>
  </AppShell>;
}
