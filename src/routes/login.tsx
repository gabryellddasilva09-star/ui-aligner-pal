import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/vl/AppShell";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-mist.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — VivaLeve" },
      { name: "description", content: "Acesse seu acompanhamento VivaLeve com seu e-mail e senha." },
      { property: "og:title", content: "Entrar — VivaLeve" },
      { property: "og:description", content: "Acesse seu acompanhamento VivaLeve." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setError("E-mail ou senha incorretos. Confira e tente de novo.");
      return;
    }
    navigate({ to: "/" });
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-10">
      <img src={hero} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="relative w-full max-w-md rounded-3xl border bg-card/95 p-7 shadow-float backdrop-blur sm:p-9">
        <Logo className="mx-auto size-12" />
        <h1 className="mt-4 text-center text-3xl font-medium">Bem-vinda ao VivaLeve</h1>
        <p className="mt-2 text-center text-base text-muted-foreground">Entre para ver seu acompanhamento.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-base font-medium">E-mail</span>
            <div className="mt-2 flex h-14 items-center gap-3 rounded-2xl border bg-background px-4 focus-within:ring-2 focus-within:ring-ring">
              <Mail className="size-5 text-muted-foreground" aria-hidden />
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-full w-full bg-transparent text-base outline-none" placeholder="seu@email.com" />
            </div>
          </label>
          <label className="block">
            <span className="text-base font-medium">Senha</span>
            <div className="mt-2 flex h-14 items-center gap-3 rounded-2xl border bg-background px-4 focus-within:ring-2 focus-within:ring-ring">
              <Lock className="size-5 text-muted-foreground" aria-hidden />
              <input type={show ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-full w-full bg-transparent text-base outline-none" placeholder="Sua senha" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Esconder senha" : "Mostrar senha"} className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-secondary">
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </label>
          {error && <p role="alert" className="rounded-2xl bg-pain/10 px-4 py-3 text-sm text-pain">{error}</p>}
          <Button type="submit" disabled={loading} className="h-14 w-full rounded-2xl text-base">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          O acesso é liberado pela sua profissional. Não tem conta? Fale com ela.
        </p>
      </div>
    </div>
  );
}
