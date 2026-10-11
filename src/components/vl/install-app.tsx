import { useEffect, useState } from "react";
import { Download, Share, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { enablePush } from "@/lib/push-client";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallAppButton() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as BIPEvent); };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  async function turnOnAlerts() {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    try {
      const s = await enablePush();
      setMsg(s === "on" ? "Pronto! O VivaLeve está no seu celular e os avisos estão ligados." : "App instalado. Você pode ligar os avisos depois em Meus remédios.");
    } catch { setMsg("App instalado. Ligue os avisos depois em Meus remédios."); }
  }

  async function install() {
    setBusy(true); setMsg("");
    try {
      if (installed) { await turnOnAlerts(); return; }
      if (deferred) {
        await deferred.prompt();
        const choice = await deferred.userChoice;
        setDeferred(null);
        if (choice.outcome === "accepted") { setInstalled(true); await turnOnAlerts(); }
        return;
      }
      setMsg(ios
        ? "No iPhone: toque em Compartilhar (quadrado com seta) e depois em “Adicionar à Tela de Início”. Abra o VivaLeve pelo ícone e toque aqui de novo para ligar os avisos."
        : "Abra o menu do navegador (⋮) e toque em “Instalar app” ou “Adicionar à tela inicial”. Depois toque aqui de novo para ligar os avisos.");
    } finally { setBusy(false); }
  }

  return (
    <div className="card-soft p-4">
      <Button onClick={install} disabled={busy} className="h-14 w-full gap-3 rounded-2xl text-base">
        {installed ? <CheckCircle2 className="size-5" /> : ios && !deferred ? <Share className="size-5" /> : <Download className="size-5" />}
        {installed ? "Ligar avisos do app" : "Baixar o app no celular"}
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">Coloca o VivaLeve na tela do seu celular e liga os avisos.</p>
      {msg && <p role="status" className="mt-3 rounded-xl bg-primary-soft p-3 text-sm leading-relaxed">{msg}</p>}
    </div>
  );
}
