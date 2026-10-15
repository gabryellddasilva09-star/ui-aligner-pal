import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { painRegions } from "@/data/body-pain";
import { fmt, sleepHours, type StoredRecord } from "@/lib/records";

const PURPLE = rgb(0.36, 0.25, 0.77);
const INK = rgb(0.16, 0.14, 0.25);
const MUTED = rgb(0.45, 0.43, 0.52);
const LINE = rgb(0.9, 0.88, 0.95);

export interface ReportSummaryItem {
  label: string;
  cur: number | null;
  change: number | null;
}

export async function buildReportPdf(opts: {
  from: Date;
  to: Date;
  records: StoredRecord[];
  summary: ReportSummaryItem[];
  patientName?: string;
}): Promise<Uint8Array> {
  const { from, to, records, summary, patientName } = opts;
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 595, H = 842, M = 48;
  let page = doc.addPage([W, H]);
  let y = H - M;

  const ensure = (need: number) => {
    if (y - need < M) {
      page = doc.addPage([W, H]);
      y = H - M;
    }
  };
  const text = (t: string, x: number, size: number, f = font, color = INK) => {
    page.drawText(t, { x, y, size, font: f, color });
  };
  const heading = (t: string) => {
    ensure(40);
    y -= 24;
    text(t, M, 14, bold, PURPLE);
    y -= 18;
  };

  // Header
  text("Relatorio de evolucao — VivaLeve", M, 20, bold, PURPLE);
  y -= 20;
  const period = `Periodo: ${from.toLocaleDateString("pt-BR")} a ${to.toLocaleDateString("pt-BR")} · ${records.length} ${records.length === 1 ? "registro" : "registros"}`;
  text(patientName ? `Paciente: ${patientName}` : period, M, 11, font, MUTED);
  y -= 14;
  if (patientName) {
    text(period, M, 11, font, MUTED);
    y -= 14;
  }
  y -= 6;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: LINE });

  // Summary
  heading("Resumo da evolucao");
  for (const s of summary) {
    ensure(18);
    const value = s.cur === null ? "—" : `${fmt(s.cur)} / 10`;
    const change = s.change === null || Math.round(s.change) === 0 ? "" : `  (${s.change > 0 ? "+" : ""}${Math.round(s.change)}% vs. periodo anterior)`;
    text(`${s.label}:`, M, 11, bold);
    text(value + change, M + 150, 11, font, INK);
    y -= 16;
  }

  // Daily records
  heading("Registros diarios");
  const sorted = records.slice().sort((a, b) => a.date.localeCompare(b.date));
  if (!sorted.length) {
    ensure(18);
    text("Sem registros neste periodo.", M, 11, font, MUTED);
    y -= 16;
  }
  for (const r of sorted) {
    const [yy, mm, dd] = r.date.split("-");
    ensure(60);
    y -= 4;
    text(`${dd}/${mm}/${yy}`, M, 11, bold, PURPLE);
    y -= 15;
    const lines: string[] = [
      `Dor: ${r.pain}/10 · Sono: ${r.sleep} · Humor: ${r.mood}`,
      `Cansaco: ${r.fatigue} · Disposicao: ${r.disposition}`,
    ];
    const hrs = sleepHours(r);
    if (hrs !== null) lines.push(`Dormiu ${hrs}h (${r.bedTime} as ${r.wakeTime})${r.awakenings != null ? ` · acordou ${r.awakenings}x` : ""}`);
    if (r.bodyPain && Object.keys(r.bodyPain).length) {
      const parts = painRegions.filter(p => r.bodyPain![p] != null).map(p => `${p} ${r.bodyPain![p]}/10`);
      if (parts.length) lines.push(`Dor no corpo: ${parts.join(", ")}`);
    }
    if (r.triggers?.length) lines.push(`Gatilhos: ${r.triggers.join(", ")}`);
    if (r.brainFog) lines.push(`Nevoa mental${r.brainFogNote ? `: ${r.brainFogNote}` : ""}`);
    if (r.cycle) lines.push(`Ciclo: ${r.cycle}`);
    for (const l of lines) {
      ensure(14);
      text(l, M + 8, 10, font, INK);
      y -= 13;
    }
    y -= 2;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.5, color: LINE });
  }

  // Footer
  ensure(30);
  y -= 20;
  text("Informacoes registradas pela propria paciente. Este relatorio nao substitui avaliacao profissional.", M, 9, font, MUTED);

  return doc.save();
}

export function downloadBlob(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
