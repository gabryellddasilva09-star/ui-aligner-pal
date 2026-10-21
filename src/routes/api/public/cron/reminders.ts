import { createFileRoute } from "@tanstack/react-router";

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
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        // Token lives only in the database (service-role table); the scheduler reads it from there.
        const token = /^Bearer (\S+)$/.exec(request.headers.get("authorization") ?? "")?.[1];
        const { data: key } = await supabaseAdmin.from("app_keys").select("value").eq("name", "cron_token").maybeSingle();
        const expected = typeof key?.value === "string" ? key.value : null;
        if (!token || !expected || token.length !== expected.length) return new Response("Unauthorized", { status: 401 });
        let diff = 0; for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
        if (diff !== 0) return new Response("Unauthorized", { status: 401 });
        const { sendPush } = await import("@/lib/push.server");
        const now = new Date();
        const { data: subs } = await supabaseAdmin.from("push_subscriptions").select("id, user_id, endpoint, time_zone");
        if (!subs?.length) return Response.json({ sent: 0 });
        const users = [...new Set(subs.map(s => s.user_id))];
        const [{ data: progs }, { data: trains }, { data: checkins }] = await Promise.all([
          supabaseAdmin.from("program_enrollments").select("user_id, remind_time, started_on").in("user_id", users).eq("active", true).eq("remind", true),
          supabaseAdmin.from("training_reminders").select("user_id, remind_time").in("user_id", users).eq("remind", true),
          supabaseAdmin.from("checkin_reminders").select("user_id, remind_time, frequency").in("user_id", users).eq("remind", true),
        ]);
        const jobs: { user: string; key: string; title: string; body: string }[] = [];
        for (const user of users) {
          const tz = subs.find(s => s.user_id === user)?.time_zone ?? "America/Sao_Paulo";
          const { date, minutes } = localParts(now, tz);
          for (const p of progs ?? []) if (p.user_id === user) {
            const [h = 0, mi = 0] = p.remind_time.split(":").map(Number);
            const diff = minutes - (h * 60 + mi);
            const day = Math.min(30, Math.floor((Date.parse(date) - Date.parse(p.started_on)) / 86400e3) + 1);
            if (diff >= 0 && diff < 5 && day >= 1) jobs.push({ user, key: `prog:${user}:${date}`, title: `Programa guiado · Dia ${day}`, body: "Sua atividade de hoje está esperando por você. Vá no seu ritmo 💜" });
          }
          for (const t of trains ?? []) if (t.user_id === user) {
            const [h = 0, mi = 0] = t.remind_time.split(":").map(Number);
            const diff = minutes - (h * 60 + mi);
            if (diff >= 0 && diff < 5) jobs.push({ user, key: `train:${user}:${date}`, title: "Hora de se movimentar", body: "Seus exercícios de hoje estão esperando. Vá no seu ritmo 💜" });
          }
          for (const c of checkins ?? []) if (c.user_id === user) {
            const [h = 0, mi = 0] = c.remind_time.split(":").map(Number);
            const diff = minutes - (h * 60 + mi);
            if (diff < 0 || diff >= 5) continue;
            const d = new Date(`${date}T12:00:00Z`);
            const dow = d.getUTCDay(); // 0=dom … 6=sáb
            const dom = d.getUTCDate();
            const due = c.frequency === "daily" || (c.frequency === "twice_week" && (dow === 1 || dow === 4))
              || (c.frequency === "weekly" && dow === 1) || (c.frequency === "monthly" && dom === 1);
            if (due) jobs.push({ user, key: `checkin:${user}:${date}`, title: "Como você está se sentindo hoje?", body: "Reserve um minutinho para registrar como está seu dia 💜" });
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
