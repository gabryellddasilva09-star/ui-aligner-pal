import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/public/seed-user")({
  server: { handlers: { POST: async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.createUser({ email: "gabryellddasilva09@gmail.com", password: "gabriel33", email_confirm: true });
    return new Response(JSON.stringify({ ok: !error, error: error?.message }));
  } } },
});
