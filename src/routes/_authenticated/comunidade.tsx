import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Users, Search, PenLine, Heart, MessageCircle, Reply, Camera, Phone, Send, X, Trash2 } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/comunidade")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Comunidade — VivaLeve" },
      { name: "description", content: "Compartilhe, apoie e se conecte com outras mulheres que também vivem com fibromialgia." },
      { property: "og:title", content: "Comunidade — VivaLeve" },
      { property: "og:description", content: "Um fórum acolhedor entre pacientes com fibromialgia." },
    ],
  }),
  component: Comunidade,
});

const textSchema = z.string().trim().min(2, "Escreva pelo menos algumas palavras.").max(1000, "Máximo de 1000 letras.");
type Filter = "todas" | "meus" | "populares";

async function me() {
  const { data } = await supabase.auth.getSession();
  const u = data.session?.user;
  if (!u) throw new Error("Sem sessão");
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const name = typeof meta["name"] === "string" && meta["name"].trim() ? meta["name"].trim() : (u.email?.split("@")[0] ?? "Paciente");
  return { id: u.id, name };
}

function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "agora mesmo";
  const m = Math.floor(s / 60); if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60); if (h < 24) return `há ${h} ${h === 1 ? "hora" : "horas"}`;
  const d = Math.floor(h / 24); if (d < 7) return `há ${d} ${d === 1 ? "dia" : "dias"}`;
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function Avatar({ name, url, size = "md" }: { name: string; url?: string | null | undefined; size?: "sm" | "md" }) {
  const cls = size === "md" ? "size-14 text-lg" : "size-9 text-sm";
  if (url) return <img src={url} alt={`Foto de ${name}`} className={cn(cls, "shrink-0 rounded-full object-cover ring-2 ring-primary-soft")} />;
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join("");
  return <span aria-hidden className={cn(cls, "grid shrink-0 place-items-center rounded-full bg-primary-soft font-semibold text-primary")}>{initials || "?"}</span>;
}

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const c = document.createElement("canvas"); c.width = 160; c.height = 160;
      c.getContext("2d")!.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 160, 160);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function Comunidade() {
  const qc = useQueryClient();
  const feed = useQuery({
    queryKey: ["community"],
    queryFn: async () => {
      const user = await me();
      const [msgs, likes, replies, profiles] = await Promise.all([
        supabase.from("community_messages").select("id, author_name, body, created_at, user_id").order("created_at", { ascending: false }).limit(100),
        supabase.from("community_likes").select("message_id, user_id"),
        supabase.from("community_replies").select("id, message_id, user_id, author_name, body, created_at").order("created_at"),
        supabase.from("community_profiles").select("user_id, avatar_url"),
      ]);
      for (const r of [msgs, likes, replies, profiles]) if (r.error) throw r.error;
      const avatars = new Map((profiles.data ?? []).map(p => [p.user_id, p.avatar_url]));
      return { user, avatars, msgs: msgs.data ?? [], likes: likes.data ?? [], replies: replies.data ?? [] };
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["community"] });

  const [filter, setFilter] = useState<Filter>("todas");
  const [q, setQ] = useState("");
  const [composer, setComposer] = useState(false);
  const [openReplies, setOpenReplies] = useState<string | null>(null);

  const posts = useMemo(() => {
    const d = feed.data; if (!d) return [];
    let list = d.msgs.map(m => ({
      ...m,
      avatar: d.avatars.get(m.user_id),
      likeCount: d.likes.filter(l => l.message_id === m.id).length,
      liked: d.likes.some(l => l.message_id === m.id && l.user_id === d.user.id),
      replies: d.replies.filter(r => r.message_id === m.id),
    }));
    if (filter === "meus") list = list.filter(p => p.user_id === d.user.id || p.replies.some(r => r.user_id === d.user.id));
    if (filter === "populares") list = [...list].sort((a, b) => (b.likeCount + b.replies.length) - (a.likeCount + a.replies.length));
    const term = q.trim().toLowerCase();
    if (term) list = list.filter(p => p.body.toLowerCase().includes(term) || p.author_name.toLowerCase().includes(term));
    return list;
  }, [feed.data, filter, q]);

  const toggleLike = useMutation({
    mutationFn: async ({ id, liked }: { id: string; liked: boolean }) => {
      const u = await me();
      const { error } = liked
        ? await supabase.from("community_likes").delete().eq("message_id", id).eq("user_id", u.id)
        : await supabase.from("community_likes").insert({ message_id: id, user_id: u.id });
      if (error) throw error;
    },
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("community_messages").delete().eq("id", id); if (error) throw error; },
    onSuccess: refresh,
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const setPhoto = useMutation({
    mutationFn: async (file: File) => {
      if (!file.type.startsWith("image/")) throw new Error("Escolha uma imagem.");
      const url = await resizeToDataUrl(file);
      const u = await me();
      const { error } = await supabase.from("community_profiles").upsert({ user_id: u.id, avatar_url: url, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: refresh,
  });
  const myAvatar = feed.data ? feed.data.avatars.get(feed.data.user.id) : null;

  return (
    <AppShell>
      <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-soft via-card to-card p-6">
        <div className="flex items-center gap-3">
          <Users className="size-9 text-primary" strokeWidth={1.8} />
          <h1 className="text-3xl font-semibold">Comunidade</h1>
        </div>
        <p className="mt-2 max-w-md text-[16px] leading-relaxed text-muted-foreground">Compartilhe, apoie e se conecte com outras mulheres que também vivem com fibromialgia.</p>
        {feed.data && (
          <button type="button" onClick={() => fileRef.current?.click()} className="mt-4 flex items-center gap-3 rounded-full bg-card/80 py-1.5 pl-1.5 pr-4 text-sm font-medium text-primary shadow-sm">
            <Avatar name={feed.data.user.name} url={myAvatar} size="sm" />
            <Camera className="size-4" />{setPhoto.isPending ? "Salvando foto..." : myAvatar ? "Trocar minha foto" : "Adicionar minha foto"}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setPhoto.mutate(f); e.target.value = ""; }} />
        {setPhoto.isError && <p className="mt-2 text-sm text-destructive">Não foi possível salvar a foto. Tente outra imagem.</p>}
      </header>

      <div className="mt-5 flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3.5 shadow-sm">
        <Search className="size-5 text-muted-foreground" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar no fórum..." aria-label="Buscar no fórum" className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2" role="tablist">
        {([["todas", "Todas"], ["meus", "Meus assuntos"], ["populares", "Populares"]] as const).map(([k, label]) => (
          <button key={k} role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}
            className={cn("rounded-full border px-2 py-3 text-sm font-medium transition", filter === k ? "border-primary bg-primary text-primary-foreground shadow-md" : "border-border bg-card text-foreground")}>
            {label}
          </button>
        ))}
      </div>

      <Button size="lg" onClick={() => setComposer(true)} className="mt-4 h-14 w-full gap-3 rounded-full text-base shadow-md">
        <PenLine className="size-5" />Compartilhar minha experiência
      </Button>

      <section className="mt-5 space-y-4" aria-label="Publicações">
        {feed.isLoading && <p className="text-muted-foreground">Carregando publicações...</p>}
        {feed.isError && <p className="text-destructive">Não foi possível carregar a comunidade agora. Tente de novo mais tarde.</p>}
        {feed.data && posts.length === 0 && (
          <div className="card-soft p-6 text-center text-muted-foreground">
            {filter === "meus" ? "Você ainda não publicou nem respondeu nenhum assunto." : q ? "Nada encontrado nessa busca." : "A comunidade está começando. Sua experiência pode ser a primeira a acolher alguém."}
          </div>
        )}
        {posts.map(p => (
          <article key={p.id} className="card-soft rounded-[1.75rem] p-5">
            <div className="flex items-center gap-3">
              <Avatar name={p.author_name} url={p.avatar} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold">{p.author_name}</p>
                <p className="text-sm text-muted-foreground"><time dateTime={p.created_at} title={new Date(p.created_at).toLocaleString("pt-BR")}>{timeAgo(p.created_at)}</time></p>
              </div>
              {p.user_id === feed.data?.user.id && (
                <button type="button" aria-label="Apagar minha publicação" onClick={() => { if (confirm("Apagar esta publicação?")) remove.mutate(p.id); }} className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted">
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
            <p className="mt-4 whitespace-pre-line break-words text-[17px] leading-relaxed">{p.body}</p>
            <div className="mt-4 flex items-center gap-5">
              <button type="button" aria-pressed={p.liked} aria-label={p.liked ? "Descurtir" : "Curtir"} disabled={toggleLike.isPending}
                onClick={() => toggleLike.mutate({ id: p.id, liked: p.liked })} className="flex items-center gap-2 text-base font-medium">
                <Heart className={cn("size-6 text-destructive transition", p.liked && "fill-destructive scale-110")} />{p.likeCount}
              </button>
              <button type="button" onClick={() => setOpenReplies(p.id)} aria-label="Ver respostas" className="flex items-center gap-2 text-base font-medium">
                <MessageCircle className="size-6" />{p.replies.length}
              </button>
              <button type="button" onClick={() => setOpenReplies(p.id)} className="ml-auto flex items-center gap-2 text-base font-semibold text-primary">
                <Reply className="size-5" />Responder
              </button>
            </div>
          </article>
        ))}
      </section>

      <a href="tel:188" className="mt-8 flex items-center gap-3 rounded-2xl bg-primary-soft p-4 text-sm leading-relaxed">
        <Phone className="size-5 shrink-0 text-primary" />
        <span>Precisa conversar com alguém agora? Ligue <strong>CVV 188</strong> — gratuito, 24 horas.</span>
      </a>

      <Composer open={composer} onOpenChange={setComposer} onDone={() => { setFilter("todas"); refresh(); }} />
      {feed.data && openReplies && (() => {
        const post = posts.find(p => p.id === openReplies) ?? feed.data.msgs.find(m => m.id === openReplies);
        if (!post) return null;
        const replies = feed.data.replies.filter(r => r.message_id === post.id);
        return (
          <RepliesDialog
            open
            onOpenChange={o => { if (!o) setOpenReplies(null); }}
            postId={post.id}
            authorName={"author_name" in post ? post.author_name : "Paciente"}
            replies={replies}
            avatars={feed.data.avatars}
            onDone={refresh}
          />
        );
      })()}
    </AppShell>
  );
}

function RepliesDialog({ open, onOpenChange, postId, authorName, replies, avatars, onDone }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  postId: string;
  authorName: string;
  replies: { id: string; author_name: string; body: string; created_at: string; user_id: string }[];
  avatars: Map<string, string | null>;
  onDone: () => void;
}) {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const send = useMutation({
    mutationFn: async (body: string) => {
      const u = await me();
      const { error } = await supabase.from("community_replies").insert({ message_id: postId, user_id: u.id, author_name: u.name, body });
      if (error) throw error;
    },
    onSuccess: () => { setText(""); onDone(); },
    onError: () => setErr("Não foi possível enviar. Tente de novo."),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85dvh] max-w-lg flex-col rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Respostas</DialogTitle>
          <DialogDescription>Conversa iniciada por {authorName}.</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-1">
          {replies.length === 0 && (
            <p className="rounded-2xl bg-muted/60 p-4 text-center text-[15px] text-muted-foreground">Ainda não há respostas. Seja a primeira a acolher.</p>
          )}
          {replies.map(r => (
            <div key={r.id} className="flex gap-3">
              <Avatar name={r.author_name} url={avatars.get(r.user_id)} size="sm" />
              <div className="min-w-0 flex-1 rounded-2xl bg-muted/60 px-4 py-2.5">
                <p className="text-sm font-semibold">{r.author_name} <span className="font-normal text-muted-foreground">· {timeAgo(r.created_at)}</span></p>
                <p className="whitespace-pre-line break-words text-[15px] leading-relaxed">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="flex items-end gap-2 pt-2" onSubmit={e => { e.preventDefault(); const v = textSchema.safeParse(text); if (!v.success) { setErr(v.error.issues[0]?.message ?? ""); return; } setErr(""); send.mutate(v.data); }}>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={2} maxLength={1000} placeholder="Escreva uma resposta carinhosa..." aria-label="Sua resposta"
            className="min-h-12 flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary" />
          <Button type="submit" size="icon" className="size-12 shrink-0 rounded-full" disabled={send.isPending} aria-label="Enviar resposta"><Send className="size-5" /></Button>
        </form>
        {err && <p className="text-sm text-destructive">{err}</p>}
      </DialogContent>
    </Dialog>
  );
}

function Composer({ open, onOpenChange, onDone }: { open: boolean; onOpenChange: (o: boolean) => void; onDone: () => void }) {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const send = useMutation({
    mutationFn: async (body: string) => {
      const u = await me();
      const { error } = await supabase.from("community_messages").insert({ user_id: u.id, author_name: u.name, body, status: "approved" });
      if (error) throw error;
    },
    onSuccess: () => { setText(""); onOpenChange(false); onDone(); },
    onError: () => setErr("Não foi possível publicar. Tente de novo."),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Compartilhar minha experiência</DialogTitle>
          <DialogDescription>Conte como você está, o que tem ajudado ou faça uma pergunta. Todas da comunidade poderão ler.</DialogDescription>
        </DialogHeader>
        <textarea autoFocus value={text} onChange={e => setText(e.target.value)} rows={6} maxLength={1000} placeholder="Escreva aqui..." aria-label="Sua experiência"
          className="w-full rounded-2xl border border-border bg-background p-4 text-base outline-none focus:border-primary" />
        <p className="text-right text-xs text-muted-foreground">{text.length}/1000</p>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <div className="flex gap-2">
          <Button variant="outline" size="lg" className="flex-1 gap-2 rounded-full" onClick={() => onOpenChange(false)}><X className="size-4" />Cancelar</Button>
          <Button size="lg" className="flex-1 gap-2 rounded-full" disabled={send.isPending}
            onClick={() => { const v = textSchema.safeParse(text); if (!v.success) { setErr(v.error.issues[0]?.message ?? ""); return; } setErr(""); send.mutate(v.data); }}>
            <Send className="size-4" />{send.isPending ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
