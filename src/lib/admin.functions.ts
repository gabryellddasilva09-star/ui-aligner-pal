import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const input = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  redirectTo: z.string().url().max(300),
});

export const createPatientUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data, context }) => {
    const { data: ok } = await context.supabase.rpc("is_admin");
    if (!ok) throw new Error("Apenas a conta administradora pode cadastrar usuários.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: res, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
      data: { name: data.name },
      redirectTo: data.redirectTo,
    });
    if (error || !res.user) {
      throw new Error(error?.message.toLowerCase().includes("already") ? "Este e-mail já tem conta." : "Não foi possível enviar o convite.");
    }
    await supabaseAdmin.auth.admin.updateUserById(res.user.id, { app_metadata: { needs_password: true } });
    return { ok: true };
  });

export const setInitialPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ password: z.string().min(8).max(100) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: u } = await supabaseAdmin.auth.admin.getUserById(context.userId);
    if (!u.user?.app_metadata?.needs_password) throw new Error("Sua senha já foi definida. Use Meu perfil para trocá-la.");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(context.userId, {
      password: data.password,
      app_metadata: { needs_password: false },
    });
    if (error) throw new Error("Não foi possível salvar a senha. Tente outra.");
    return { ok: true };
  });
