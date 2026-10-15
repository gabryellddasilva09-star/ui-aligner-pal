import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { createPatientUser } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Cadastrar usuários — VivaLeve" },
      { name: "description", content: "Área administrativa para cadastrar novas contas no VivaLeve." },
      { property: "og:title", content: "Cadastrar usuários — VivaLeve" },
      { property: "og:description", content: "Área administrativa do VivaLeve." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const admin = useQuery({ queryKey: ["is-admin"], queryFn: async () => { const { data } = await supabase.rpc("is_admin"); return !!data; } });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setMsg({ ok: false, text: "Informe o nome." });
    if (password.length < 8) return setMsg({ ok: false, text: "A senha precisa de pelo menos 8 caracteres." });
    setBusy(true); setMsg(null);
    try {
      await createPatientUser({ data: { name, email, password } });
      setMsg({ ok: true, text: `Conta de ${name} criada! Ela já pode entrar com o e-mail e a senha cadastrados.` });
      setName(""); setEmail(""); setPassword("");
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Não foi possível cadastrar." });
    } finally { setBusy(false); }
  }

  const field = "h-14 w-full rounded-2xl border border-border bg-background px-4 text-base outline-none focus:border-primary";
  return (
    <AppShell>
      <header className="space-y-2">
        <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary"><UserPlus className="size-6" /></span>
        <h1 className="text-3xl font-medium">Cadastrar usuários</h1>
        <p className="max-w-md text-[15px] text-muted-foreground">Crie a conta de uma nova paciente. Só a conta administradora vê esta área.</p>
      </header>
      {admin.isLoading ? <p className="mt-8 text-muted-foreground">Carregando...</p> : !admin.data ? (
        <p className="card-soft mt-8 p-5">Esta área é exclusiva da conta administradora.</p>
      ) : (
        <form onSubmit={submit} className="card-soft mt-8 max-w-lg space-y-4 p-5">
          <label className="block space-y-1"><span className="text-base font-medium">Nome</span><input className={field} value={name} onChange={e => setName(e.target.value)} maxLength={80} required /></label>
          <label className="block space-y-1"><span className="text-base font-medium">E-mail</span><input type="email" className={field} value={email} onChange={e => setEmail(e.target.value)} required /></label>
          <label className="block space-y-1"><span className="text-base font-medium">Senha</span><input type="password" className={field} value={password} onChange={e => setPassword(e.target.value)} minLength={8} required /></label>
          {msg && <p className={msg.ok ? "text-primary" : "text-destructive"}>{msg.text}</p>}
          <Button type="submit" size="lg" className="w-full rounded-full text-base" disabled={busy}>{busy ? "Cadastrando..." : "Cadastrar usuária"}</Button>
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" />Os registros de cada paciente continuam privados.</p>
        </form>
      )}
    </AppShell>
  );
}
