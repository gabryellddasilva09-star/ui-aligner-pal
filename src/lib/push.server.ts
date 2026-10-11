// Web Push (VAPID, no payload) using WebCrypto only — runs on Workers.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const b64url = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = ""; for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), c => c.charCodeAt(0));

type Vapid = { publicKey: string; privateJwk: JsonWebKey };
let cached: Vapid | null = null;

export async function getVapid(): Promise<Vapid> {
  if (cached) return cached;
  const { data } = await supabaseAdmin.from("app_keys").select("value").eq("name", "vapid").maybeSingle();
  if (data) { cached = data.value as unknown as Vapid; return cached; }
  const pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]) as CryptoKeyPair;
  const raw = await crypto.subtle.exportKey("raw", pair.publicKey) as ArrayBuffer;
  const privateJwk = await crypto.subtle.exportKey("jwk", pair.privateKey) as JsonWebKey;
  const fresh: Vapid = { publicKey: b64url(raw), privateJwk };
  await supabaseAdmin.from("app_keys").upsert({ name: "vapid", value: fresh as never }, { onConflict: "name", ignoreDuplicates: true });
  const { data: again } = await supabaseAdmin.from("app_keys").select("value").eq("name", "vapid").single();
  cached = (again?.value as unknown as Vapid) ?? fresh;
  return cached;
}

async function vapidHeader(endpoint: string) {
  const v = await getVapid();
  const key = await crypto.subtle.importKey("jwk", v.privateJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const enc = new TextEncoder();
  const header = b64url(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const claims = b64url(enc.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: "mailto:contato@vivaleve.app" })));
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, enc.encode(`${header}.${claims}`));
  return `vapid t=${header}.${claims}.${b64url(sig)}, k=${v.publicKey}`;
}

/** Returns false when the subscription is gone and should be removed. */
export async function sendPush(endpoint: string): Promise<boolean> {
  const res = await fetch(endpoint, { method: "POST", headers: { Authorization: await vapidHeader(endpoint), TTL: "3600", Urgency: "high", "Content-Length": "0" } });
  if (res.status === 404 || res.status === 410) return false;
  if (!res.ok) console.error("push failed", res.status, await res.text().catch(() => ""));
  return true;
}

export { fromB64url };
