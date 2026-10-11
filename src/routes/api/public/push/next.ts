import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Called by the service worker after a payload-less push to learn what to show.
// The push endpoint URL is an unguessable capability held only by that device.
export const Route = createFileRoute("/api/public/push/next")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = z.object({ endpoint: z.string().url().max(1000) }).safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Bad request", { status: 400 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin.from("push_subscriptions").select("id, pending_title, pending_body").eq("endpoint", parsed.data.endpoint).maybeSingle();
        if (!data) return Response.json({ title: "VivaLeve", body: "Você tem um lembrete." });
        await supabaseAdmin.from("push_subscriptions").update({ pending_title: null, pending_body: null }).eq("id", data.id);
        return Response.json({ title: data.pending_title ?? "VivaLeve", body: data.pending_body ?? "Você tem um lembrete." });
      },
    },
  },
});
