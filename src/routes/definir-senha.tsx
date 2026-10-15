import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/vl/AppShell";
import { Button } from "@/components/ui/button";
import { setInitialPassword } from "@/lib/admin.functions";

export const Route = createFileRoute("/definir-senha")({
  head: () => ({
    meta: [
      { title: "Criar sua senha — VivaLeve" },
      { name: "description", content: "Escolha sua senha para entrar no VivaLeve." },
      { property: "og:title", content: "Criar sua senha — VivaLeve" },
      { property: "og:description", content: "Escolha sua senha para entrar no VivaLeve." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SetPassword,
});

function SetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { if (s) setReady(true); });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setTimeout(() => setReady((r) => r ?? false), 2500);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (pw.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
    if (pw !== pw2) return setError("As senhas não são iguais.");
    setBusy(true);
    try {
      await setInitialPassword({ data: { password: pw } });
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally { setBusy(false); }
  }

  const field = "mt-2 flex h-14 items-center gap-3 rounded-2xl border bg-background px-4 focus-within:ring-2 focus-within:ring-ring";
  return (
    <div className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-md rounded-3xl border bg-card p-7 shadow-float sm:p-9">
        <Logo className="mx-auto size-12" />
        <h1 className="mt-4 text-center text-3xl font-medium">Crie sua senha</h1>
        {ready === null ? <p className="mt-6 text-center text-muted-foreground">Abrindo seu convite...</p> : !ready ? (
          <p className="mt-6 text-center text-muted-foreground">Este link expirou ou já foi usado. Peça um novo convite.</p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block"><span className="text-base font-medium">Nova senha</span>
              <div className={field}><Lock className="size-5 text-muted-foreground" /><input type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className="h-full w-full bg-transparent text-base outline-none" /></div>
            </label>
            <label className="block"><span className="text-base font-medium">Repita a senha</span>
              <div className={field}><Lock className="size-5 text-muted-foreground" /><input type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} className="h-full w-full bg-transparent text-base outline-none" /></div>
            </label>
            {error && <p role="alert" className="rounded-2xl bg-pain/10 px-4 py-3 text-sm text-pain">{error}</p>}
            <Button type="submit" disabled={busy} className="h-14 w-full rounded-2xl text-base">{busy ? "Salvando..." : "Salvar e entrar"}</Button>
          </form>
        )}
      </div>
    </div>
  );
}
