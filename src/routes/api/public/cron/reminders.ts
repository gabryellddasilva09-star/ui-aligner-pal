import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

function localParts(now: Date, tz: string) {
  try {
    const f = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    const p = Object.fromEntries(f.formatToParts(now).map(x => [x.type, x.value]));
    return { date: `${p['year']}-${p['month']}-${p['day']}`, minutes: Number(p['hour']) * 60 + Number(p['minute']) };
  } catch { return localParts(now, "America/Sao_Paulo"); }
}

export const Route = createFileRoute("/api/public/cron/reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await authenticateCronRequest(request);
        if (denied) return denied;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendPush } = await import("@/lib/push.server");
        const now = new Date();
        const { data: subs } = await supabaseAdmin.from("push_subscriptions").select("id, user_id, endpoint, time_zone");
        if (!subs?.length) return Response.json({ sent: 0 });
        const users = [...new Set(subs.map(s => s.user_id))];
        const [{ data: meds }, { data: appts }] = await Promise.all([
          supabaseAdmin.from("medications").select("id, user_id, name, dose, times").in("user_id", users).eq("active", true).eq("remind", true),
          supabaseAdmin.from("appointments").select("id, user_id, kind, title, starts_at").in("user_id", users).eq("remind", true)
            .gte("starts_at", now.toISOString()).lte("starts_at", new Date(now.getTime() + 25 * 3600e3).toISOString()),
        ]);
        const jobs: { user: string; key: string; title: string; body: string }[] = [];
        for (const user of users) {
          const tz = subs.find(s => s.user_id === user)?.time_zone ?? "America/Sao_Paulo";
          const { date, minutes } = localParts(now, tz);
          for (const m of meds ?? []) if (m.user_id === user) for (const t of m.times) {
            const [h = 0, mi = 0] = t.split(":").map(Number);
            const diff = minutes - (h * 60 + mi);
            if (diff >= 0 && diff < 5) jobs.push({ user, key: `med:${m.id}:${date}:${t}`, title: "Hora do seu remédio", body: `${m.name}${m.dose ? ` · ${m.dose}` : ""} — ${t}` });
          }
          for (const a of appts ?? []) if (a.user_id === user) {
            const mins = (new Date(a.starts_at).getTime() - now.getTime()) / 60000;
            const when = new Intl.DateTimeFormat("pt-BR", { timeZone: tz, weekday: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(a.starts_at));
            if (mins <= 60 && mins > 50) jobs.push({ user, key: `appt1h:${a.id}`, title: `${a.kind} em 1 hora`, body: `${a.title} — ${when}` });
            if (mins <= 24 * 60 && mins > 24 * 60 - 10) jobs.push({ user, key: `appt24h:${a.id}`, title: `${a.kind} amanhã`, body: `${a.title} — ${when}. Que tal revisar suas dúvidas?` });
          }
        }
        let sent = 0;
        for (const job of jobs) {
          const { error } = await supabaseAdmin.from("reminders_sent").insert({ key: job.key });
          if (error) continue; // already sent
          for (const s of subs.filter(x => x.user_id === job.user)) {
            await supabaseAdmin.from("push_subscriptions").update({ pending_title: job.title, pending_body: job.body }).eq("id", s.id);
            const alive = await sendPush(s.endpoint).catch(() => true);
            if (!alive) await supabaseAdmin.from("push_subscriptions").delete().eq("id", s.id);
            sent++;
          }
        }
        await supabaseAdmin.from("reminders_sent").delete().lt("created_at", new Date(now.getTime() - 3 * 86400e3).toISOString());
        return Response.json({ sent });
      },
    },
  },
});
