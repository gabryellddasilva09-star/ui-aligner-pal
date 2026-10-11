import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CalendarHeart, MapPin, Plus, Trash2, HelpCircle } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { SectionHeader } from "@/components/vl/primitives";
import { Button } from "@/components/ui/button";
import { PushToggle } from "@/components/vl/push-toggle";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/consultas")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Consultas e exames — VivaLeve" },
      { name: "description", content: "Agenda de consultas e exames com aviso no celular e espaço para anotar suas dúvidas." },
      { property: "og:title", content: "Consultas e exames — VivaLeve" },
      { property: "og:description", content: "Agenda de consultas e exames com aviso e suas dúvidas." },
    ],
  }),
  component: Consultas,
});

const kinds = ["Consulta", "Exame", "Retorno", "Terapia"] as const;
const schema = z.object({ kind: z.enum(kinds), title: z.string().trim().min(1, "Escreva com quem é ou qual exame.").max(160), date: z.string().min(1, "Escolha o dia."), time: z.string().regex(/^\d{2}:\d{2}$/, "Escolha o horário."), place: z.string().trim().max(200), questions: z.string().trim().max(3000) });
const empty = { kind: "Consulta" as (typeof kinds)[number], title: "", date: "", time: "09:00", place: "", questions: "" };

function Consultas() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["appointments"], queryFn: async () => { const { data, error } = await supabase.from("appointments").select("*").order("starts_at"); if (error) throw error; return data; } });
  const [form, setForm] = useState<typeof empty | null>(null);
  const [err, setErr] = useState("");
  const [editingQ, setEditingQ] = useState<Record<string, string>>({});
  const save = useMutation({
    mutationFn: async (f: typeof empty) => {
      const p = schema.parse(f);
      const { data: u } = await supabase.auth.getUser(); if (!u.user) throw new Error("Sem sessão");
      const { error } = await supabase.from("appointments").insert({ user_id: u.user.id, kind: p.kind, title: p.title, starts_at: new Date(`${p.date}T${p.time}:00`).toISOString(), place: p.place || null, questions: p.questions || null });
      if (error) throw error;
    },
    onSuccess: () => { setForm(null); qc.invalidateQueries({ queryKey: ["appointments"] }); },
  });
  const updateQ = useMutation({ mutationFn: async ({ id, q }: { id: string; q: string }) => { const { error } = await supabase.from("appointments").update({ questions: q.slice(0, 3000) || null }).eq("id", id); if (error) throw error; }, onSuccess: (_, v) => { setEditingQ(s => { const n = { ...s }; delete n[v.id]; return n; }); qc.invalidateQueries({ queryKey: ["appointments"] }); } });
  const remove = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("appointments").delete().eq("id", id); if (error) throw error; }, onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }) });
  const now = Date.now();
  const upcoming = list.data?.filter(a => new Date(a.starts_at).getTime() >= now - 3600e3) ?? [];
  const past = (list.data?.filter(a => new Date(a.starts_at).getTime() < now - 3600e3) ?? []).reverse();
  function submit() { if (!form) return; const r = schema.safeParse(form); if (!r.success) { setErr(r.error.issues[0]?.message ?? "Confira os dados."); return; } setErr(""); save.mutate(form); }

  const card = (a: NonNullable<typeof list.data>[number], muted = false) => <div key={a.id} className={cn("card-soft p-5", muted && "opacity-75")}>
    <div className="flex items-start gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><CalendarHeart className="size-5" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase text-primary">{a.kind}</p>
        <p className="text-lg font-medium">{a.title}</p>
        <p className="capitalize text-muted-foreground">{new Date(a.starts_at).toLocaleString("pt-BR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</p>
        {a.place && <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" />{a.place}</p>}
      </div>
      <Button variant="ghost" size="icon" className="size-11" aria-label="Apagar" onClick={() => { if (confirm("Apagar este compromisso?")) remove.mutate(a.id); }}><Trash2 /></Button>
    </div>
    <div className="mt-4 rounded-2xl bg-secondary p-4">
      <p className="flex items-center gap-2 text-sm font-medium"><HelpCircle className="size-4 text-primary" />Minhas dúvidas para perguntar</p>
      {a.id in editingQ ? <>
        <textarea rows={4} maxLength={3000} value={editingQ[a.id]} onChange={e => setEditingQ(s => ({ ...s, [a.id]: e.target.value }))} className="mt-2 w-full rounded-xl border bg-card p-3 text-base" aria-label="Minhas dúvidas" />
        <Button className="mt-2 h-12 rounded-xl" onClick={() => updateQ.mutate({ id: a.id, q: editingQ[a.id]?.trim() ?? "" })}>Guardar dúvidas</Button>
      </> : <>
        <p className="mt-2 whitespace-pre-line text-base">{a.questions || <span className="text-muted-foreground">Nenhuma dúvida anotada ainda.</span>}</p>
        <Button variant="outline" className="mt-2 h-11 rounded-xl" onClick={() => setEditingQ(s => ({ ...s, [a.id]: a.questions ?? "" }))}>{a.questions ? "Editar dúvidas" : "Anotar dúvidas"}</Button>
      </>}
    </div>
  </div>;

  return <AppShell>
    <div className="mx-auto max-w-3xl space-y-8 pt-6 lg:pt-0">
      <SectionHeader title="Consultas e exames" subtitle="Avisamos um dia antes e uma hora antes." />
      <PushToggle />
      {form ? <div className="card-soft space-y-4 p-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{kinds.map(k => <Button key={k} variant="outline" aria-pressed={form.kind === k} onClick={() => setForm({ ...form, kind: k })} className={cn("h-12 rounded-xl", form.kind === k && "border-primary bg-primary-soft text-primary")}>{k}</Button>)}</div>
        <label className="block">Com quem ou qual exame<input value={form.title} maxLength={160} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex.: Reumatologista, exame de sangue" className="mt-1 h-12 w-full rounded-xl border bg-card px-3 text-base" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">Dia<input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="mt-1 h-12 w-full rounded-xl border bg-card px-3 text-base" /></label>
          <label className="block">Hora<input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="mt-1 h-12 w-full rounded-xl border bg-card px-3 text-base" /></label>
        </div>
        <label className="block">Local <span className="text-muted-foreground">(opcional)</span><input value={form.place} maxLength={200} onChange={e => setForm({ ...form, place: e.target.value })} className="mt-1 h-12 w-full rounded-xl border bg-card px-3 text-base" /></label>
        <label className="block">Dúvidas para perguntar <span className="text-muted-foreground">(opcional)</span><textarea rows={3} maxLength={3000} value={form.questions} onChange={e => setForm({ ...form, questions: e.target.value })} className="mt-1 w-full rounded-xl border bg-card p-3 text-base" /></label>
        {(err || save.isError) && <p role="alert" className="text-sm text-destructive">{err || "Não conseguimos salvar. Tente de novo."}</p>}
        <div className="flex gap-2"><Button className="h-12 flex-1 rounded-xl text-base" disabled={save.isPending} onClick={submit}>Salvar</Button><Button variant="ghost" className="h-12" onClick={() => setForm(null)}>Cancelar</Button></div>
      </div> : <Button className="h-14 w-full rounded-xl text-base" onClick={() => setForm(empty)}><Plus className="size-5" />Nova consulta ou exame</Button>}
      <section className="space-y-3">
        <h2 className="text-xl font-medium">Próximos</h2>
        {list.isLoading ? <p className="text-muted-foreground">Carregando…</p> : list.isError ? <p role="alert" className="text-destructive">Não conseguimos carregar sua agenda.</p>
          : upcoming.length ? upcoming.map(a => card(a)) : <p className="card-soft p-6 text-muted-foreground">Nenhum compromisso marcado.</p>}
      </section>
      {past.length > 0 && <section className="space-y-3"><h2 className="text-xl font-medium">Anteriores</h2>{past.map(a => card(a, true))}</section>}
    </div>
  </AppShell>;
}
