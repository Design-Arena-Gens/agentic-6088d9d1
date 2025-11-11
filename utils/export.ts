import { type PlanItem } from '@/lib/agent';

export function toCSV(items: PlanItem[]): string {
  const headers = ['platform','scheduledAt','title','caption','hashtags','cta','goal','suggestedAsset'];
  const rows = items.map(i => [
    i.platform,
    i.scheduledAt,
    safe(i.title),
    safe(i.caption),
    i.hashtags.join(' '),
    safe(i.cta),
    i.goal,
    i.suggestedAsset ?? ''
  ]);
  return [headers, ...rows]
    .map(cols => cols.map(escapeCSV).join(','))
    .join('\n');
}

function escapeCSV(val: string) {
  if (val == null) return '';
  const s = String(val);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function safe(s: string) {
  return s.replace(/\n/g, ' ');
}
