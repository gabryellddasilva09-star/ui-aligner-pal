import { createServerFn } from "@tanstack/react-start";

export const getPushPublicKey = createServerFn({ method: "GET" }).handler(async () => {
  const { getVapid } = await import("./push.server");
  return (await getVapid()).publicKey;
});
