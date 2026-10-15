import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bell, CalendarHeart, HeartPulse, Pill, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { todayKey, useRecords } from "@/lib/records";
import { unlockedDay, useProgram } from "@/lib/program";
import { cn } from "@/lib/utils";

type Notice = { id: string; icon: "pill" | "calendar" | "checkin" | "program"; title: string; body: string; to: string };

const icons = { pill: Pill, calendar: CalendarHeart, checkin: HeartPulse, program: Sparkles } as const;
const SEEN_KEY = "vl-notif-seen";

function useNotices(): Notice[] {
  const today = todayKey();
  const records = useRecords();
  const program = useProgram();
  const meds = useQuery({
    queryKey: ["medications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("medications").select("*").eq("active", true);
      if (error) throw error;
      return data ?? [];
    },
  });
  const logs = useQuery({
    queryKey: ["medication_logs", today],
    queryFn: async () => {
      const { data, error } = await supabase.from("medication_logs").select("*").eq("taken_on", today);
      if (error) throw error;
      return data ?? [];
    },
  });
  const appointments = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("appointments").select("*").order("starts_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  return useMemo(() => {
    const out: Notice[] = [];
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    for (const m of meds.data ?? []) {
      for (const t of m.times) {
        const [h, min] = t.split(":").map(Number);
        const passed = h * 60 + min <= nowMinutes;
        const taken = (logs.data ?? []).some(l => l.medication_id === m.id && l.slot === t);
        if (passed && !taken) out.push({ id: `med-${m.id}-${t}`, icon: "pill", title: `Hora do remédio: ${m.name}`, body: `${t}${m.dose ? ` · ${m.dose}` : ""} — marque quando tomar.`, to: "/remedios" });
      }
    }

    for (const a of appointments.data ?? []) {
      const at = new Date(a.starts_at);
      const diffH = (at.getTime() - now.getTime()) / 3600e3;
      if (diffH > -1 && diffH <= 24) {
        const when = at.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
        const time = at.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        out.push({ id: `appt-${a.id}`, icon: "calendar", title: `${a.kind}: ${a.title}`, body: `${when} às ${time}${a.place ? ` · ${a.place}` : ""}`, to: "/consultas" });
      }
    }

    if (records.data && !records.data.some(r => r.date === today)) {
      out.push({ id: `checkin-${today}`, icon: "checkin", title: "Como você está se sentindo hoje?", body: "Seu registro de hoje ainda não foi feito.", to: "/" });
    }

    const en = program.data?.enrollment;
    if (en?.active) {
      const day = unlockedDay(en.started_on);
      const done = (program.data?.progress ?? []).some(p => p.day === day);
      if (!done) out.push({ id: `program-${day}`, icon: "program", title: `Dia ${day} do seu programa`, body: "A atividade de hoje do programa guiado te espera.", to: "/programa" });
    }

    return out;
  }, [meds.data, logs.data, appointments.data, records.data, program.data, today]);
}

export function NotificationsBell() {
  const notices = useNotices();
  const [open, setOpen] = useState(false);
  const signature = notices.map(n => n.id).join("|");
  const seen = typeof window !== "undefined" ? window.localStorage.getItem(SEEN_KEY) : null;
  const hasNew = notices.length > 0 && signature !== seen;

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (next) window.localStorage.setItem(SEEN_KEY, signature);
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button aria-label={hasNew ? `Notificações, ${notices.length} novas` : "Notificações"} className="relative grid size-10 place-items-center rounded-full border bg-card transition hover:bg-secondary">
          <Bell className="size-[18px]" />
          {hasNew && <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-pain ring-2 ring-card" />}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl p-0">
        <p className="border-b px-4 py-3 font-display text-base font-semibold">Notificações</p>
        {notices.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">Tudo em dia por aqui. 💜</p>
        ) : (
          <ul className="max-h-80 divide-y overflow-y-auto">
            {notices.map(n => {
              const Icon = icons[n.icon];
              return (
                <li key={n.id}>
                  <Link to={n.to} onClick={() => setOpen(false)} className={cn("flex items-start gap-3 px-4 py-3 transition hover:bg-secondary/60")}>
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Icon className="size-4" /></span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium leading-snug">{n.title}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{n.body}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
