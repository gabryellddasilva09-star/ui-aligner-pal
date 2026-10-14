import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    staleTime: Infinity,
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user;
      const meta = (u?.user_metadata ?? {}) as Record<string, unknown>;
      const full = typeof meta["name"] === "string" && meta["name"].trim() ? meta["name"].trim() : (u?.email?.split("@")[0] ?? "");
      const { data: admin } = await supabase.rpc("is_admin");
      return { firstName: full.split(" ")[0] ?? "", isAdmin: !!admin };
    },
  });
}
