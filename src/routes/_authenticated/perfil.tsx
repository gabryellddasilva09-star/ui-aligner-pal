import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, KeyRound, Mail, CalendarDays, Dumbbell, UserRound, HeartPulse } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PushToggle } from "@/components/vl/push-toggle";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil — VivaLeve" },
      { name: "description", content: "Seus dados de acesso, foto, senha e horário do lembrete de treino." },
      { property: "og:title", content: "Meu perfil — VivaLeve" },
      { property: "og:description", content: "Ajuste sua conta e seus lembretes no VivaLeve." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Perfil,
});

function resize(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const s = 256, c = document.createElement("canvas"); c.width = s; c.height = s;
      const min = Math.min(img.width, img.height);
      c.getContext("2d")!.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, s, s);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("Imagem inválida"));
    img.src = URL.createObjectURL(file);
  });
}

function Perfil() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const profile = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("no user");
      const [{ data: p }, { data: r }, { data: c }] = await Promise.all([
        supabase.from("community_profiles").select("avatar_url").eq("user_id", user.id).maybeSingle(),
        supabase.from("training_reminders").select("remind_time, remind").eq("user_id", user.id).maybeSingle(),
        supabase.from("checkin_reminders").select("remind_time, remind, frequency").eq("user_id", user.id).maybeSingle(),
      ]);
      const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
      return {
        id: user.id, email: user.email ?? "", name: typeof meta["name"] === "string" ? meta["name"] : (user.email?.split("@")[0] ?? ""),
        createdAt: user.created_at, avatar: p?.avatar_url ?? null, remindTime: r?.remind_time ?? "09:00", remind: r?.remind ?? false,
        checkinTime: c?.remind_time ?? "20:00", checkinRemind: c?.remind ?? false, checkinFreq: c?.frequency ?? "daily",
      };
    },
  });
  const d = profile.data;

  const photo = useMutation({
    mutationFn: async (file: File) => {
      if (!file.type.startsWith("image/")) throw new Error("Escolha uma imagem.");
      const url = await resize(file);
      const { error } = await supabase.from("community_profiles").upsert({ user_id: d!.id, avatar_url: url, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-profile"] }); qc.invalidateQueries({ queryKey: ["my-avatar"] }); },
  });

  const [pwOld, setPwOld] = useState(""); const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const changePw = useMutation({
    mutationFn: async () => {
      if (!pwOld) throw new Error("Digite sua senha atual.");
      if (pw.length < 8) throw new Error("A senha precisa ter pelo menos 8 caracteres.");
      if (pw !== pw2) throw new Error("As duas senhas não são iguais.");
      if (pw === pwOld) throw new Error("A nova senha precisa ser diferente da atual.");
      const { error: checkError } = await supabase.auth.signInWithPassword({ email: d!.email, password: pwOld });
      if (checkError) throw new Error("A senha atual está incorreta.");
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw new Error("Não foi possível trocar a senha. Tente outra senha.");
    },
    onSuccess: () => { setPwOld(""); setPw(""); setPw2(""); setPwMsg({ ok: true, text: "Senha alterada com sucesso." }); },
    onError: (e: Error) => setPwMsg({ ok: false, text: e.message }),
  });

  const [time, setTime] = useState("09:00"); const [on, setOn] = useState(false); const [saved, setSaved] = useState(false);
  const [cTime, setCTime] = useState("20:00"); const [cOn, setCOn] = useState(false); const [cFreq, setCFreq] = useState("daily"); const [cSaved, setCSaved] = useState(false);
  useEffect(() => { if (d) { setTime(d.remindTime); setOn(d.remind); setCTime(d.checkinTime); setCOn(d.checkinRemind); setCFreq(d.checkinFreq); } }, [d]);
  const saveRemind = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("training_reminders").upsert({ user_id: d!.id, remind_time: time, remind: on, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => { setSaved(true); qc.invalidateQueries({ queryKey: ["my-profile"] }); setTimeout(() => setSaved(false), 2500); },
  });
  const saveCheckin = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("checkin_reminders").upsert({ user_id: d!.id, remind_time: cTime, remind: cOn, frequency: cFreq, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => { setCSaved(true); qc.invalidateQueries({ queryKey: ["my-profile"] }); setTimeout(() => setCSaved(false), 2500); },
  });

  return (
    <AppShell>
      <h1 className="text-3xl font-medium">Meu perfil</h1>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="card-soft rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <button onClick={() => fileRef.current?.click()} aria-label="Trocar foto de perfil" className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-soft text-primary">
              {d?.avatar ? <img src={d.avatar} alt="Sua foto" className="size-full object-cover" /> : <UserRound className="size-9" />}
              <span className="absolute bottom-0 right-0 grid size-7 place-items-center rounded-full bg-primary text-primary-foreground"><Camera className="size-3.5" /></span>
            </button>
            <div className="min-w-0">
              <p className="truncate text-xl font-medium">{d?.name}</p>
              <button onClick={() => fileRef.current?.click()} className="mt-1 text-sm font-medium text-primary">{photo.isPending ? "Salvando foto…" : d?.avatar ? "Trocar foto" : "Adicionar foto"}</button>
              {photo.isError && <p role="alert" className="text-sm text-destructive">Não foi possível salvar a foto.</p>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) photo.mutate(f); e.target.value = ""; }} />
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3"><Mail className="size-4 text-primary" /><dt className="sr-only">E-mail</dt><dd className="truncate">{d?.email}</dd></div>
            <div className="flex items-center gap-3"><CalendarDays className="size-4 text-primary" /><dt className="text-muted-foreground">Conta criada em</dt><dd>{d ? new Date(d.createdAt).toLocaleDateString("pt-BR") : ""}</dd></div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">Seus registros ficam guardados só para você.</p>
        </section>

        <section className="card-soft rounded-3xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-medium"><KeyRound className="size-5 text-primary" /> Alterar senha</h2>
          <form className="mt-4 space-y-3" onSubmit={e => { e.preventDefault(); setPwMsg(null); changePw.mutate(); }}>
            <Input type="password" autoComplete="current-password" placeholder="Senha atual" value={pwOld} onChange={e => setPwOld(e.target.value)} className="h-12 rounded-xl" />
            <Input type="password" autoComplete="new-password" placeholder="Nova senha" value={pw} onChange={e => setPw(e.target.value)} className="h-12 rounded-xl" />
            <Input type="password" autoComplete="new-password" placeholder="Repita a nova senha" value={pw2} onChange={e => setPw2(e.target.value)} className="h-12 rounded-xl" />
            <Button type="submit" disabled={changePw.isPending || !pwOld || !pw} className="h-12 w-full rounded-xl text-base">{changePw.isPending ? "Salvando…" : "Salvar nova senha"}</Button>
            {pwMsg && <p role="status" className={pwMsg.ok ? "text-sm text-good" : "text-sm text-destructive"}>{pwMsg.text}</p>}
          </form>
        </section>

        <section className="card-soft rounded-3xl p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-lg font-medium"><Dumbbell className="size-5 text-primary" /> Lembrete para treinar</h2>
          <p className="mt-1 text-sm text-muted-foreground">Escolha o horário em que o app vai lembrar você de se movimentar, todos os dias.</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-3 text-sm font-medium"><Switch checked={on} onCheckedChange={setOn} /> {on ? "Lembrete ligado" : "Lembrete desligado"}</label>
            <Input type="time" value={time} onChange={e => setTime(e.target.value)} disabled={!on} aria-label="Horário do lembrete" className="h-12 w-36 rounded-xl text-base" />
            <Button onClick={() => saveRemind.mutate()} disabled={saveRemind.isPending || !d} className="h-12 rounded-xl px-6">{saveRemind.isPending ? "Salvando…" : "Salvar horário"}</Button>
            {saved && <span role="status" className="text-sm text-good">Horário salvo!</span>}
          </div>
          <div className="mt-5"><PushToggle /></div>
        </section>

        <section className="card-soft rounded-3xl p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-lg font-medium"><HeartPulse className="size-5 text-primary" /> Lembrete do registro diário</h2>
          <p className="mt-1 text-sm text-muted-foreground">O app pergunta “Como você está se sentindo hoje?” no horário e na frequência que você escolher.</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-3 text-sm font-medium"><Switch checked={cOn} onCheckedChange={setCOn} /> {cOn ? "Lembrete ligado" : "Lembrete desligado"}</label>
            <Input type="time" value={cTime} onChange={e => setCTime(e.target.value)} disabled={!cOn} aria-label="Horário do lembrete do registro" className="h-12 w-36 rounded-xl text-base" />
            <select value={cFreq} onChange={e => setCFreq(e.target.value)} disabled={!cOn} aria-label="Frequência do lembrete"
              className="h-12 rounded-xl border border-border bg-background px-3 text-base">
              <option value="daily">Todos os dias</option>
              <option value="twice_week">2 vezes por semana</option>
              <option value="weekly">1 vez por semana</option>
              <option value="monthly">1 vez por mês</option>
            </select>
            <Button onClick={() => saveCheckin.mutate()} disabled={saveCheckin.isPending || !d} className="h-12 rounded-xl px-6">{saveCheckin.isPending ? "Salvando…" : "Salvar lembrete"}</Button>
            {cSaved && <span role="status" className="text-sm text-good">Lembrete salvo!</span>}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
