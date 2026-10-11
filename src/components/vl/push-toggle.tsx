import { useEffect, useState } from "react";
import { BellRing, BellOff, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { enablePush, disablePush, getPushState, type PushState } from "@/lib/push-client";

export function PushToggle() {
  const [state, setState] = useState<PushState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { getPushState().then(setState).catch(() => setState("unsupported")); }, []);
  if (!state) return null;
  async function run(fn: () => Promise<PushState>) {
    setBusy(true); setError("");
    try { setState(await fn()); } catch { setError("Não foi possível ativar os avisos agora. Tente de novo."); } finally { setBusy(false); }
  }
  const text: Record<PushState, string> = {
    on: "Os avisos estão ligados neste celular.",
    off: "Ligue os avisos para o celular lembrar você na hora certa, mesmo com o app fechado.",
    denied: "Os avisos foram bloqueados. Para liberar, abra os ajustes do navegador e permita notificações do VivaLeve.",
    "needs-install": "No iPhone, primeiro coloque o VivaLeve na tela de início: toque em Compartilhar e depois em “Adicionar à Tela de Início”. Abra o app por lá e ligue os avisos.",
    unsupported: "Este navegador não consegue mostrar avisos. Tente pelo Chrome ou instale o app na tela de início.",
  };
  return <div className="rounded-3xl border bg-primary-soft p-5">
    <div className="flex gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-primary">{state === "needs-install" ? <Smartphone className="size-5" /> : state === "on" ? <BellRing className="size-5" /> : <BellOff className="size-5" />}</span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">Avisos no celular</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text[state]}</p>
        {state === "off" && <Button className="mt-3 h-12 rounded-xl px-5 text-base" disabled={busy} onClick={() => run(enablePush)}>{busy ? "Ligando…" : "Ligar avisos"}</Button>}
        {state === "on" && <Button variant="outline" className="mt-3 h-12 rounded-xl px-5" disabled={busy} onClick={() => run(disablePush)}>Desligar avisos</Button>}
        {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  </div>;
}
