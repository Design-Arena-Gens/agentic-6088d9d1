"use client";
import React, { useMemo, useState } from 'react';
import { PlatformSelector, type Platform } from '@/components/PlatformSelector';
import { Calendar } from '@/components/Calendar';
import { type PlanItem } from '@/lib/agent';
import { toCSV } from '@/utils/export';

export default function Page() {
  const [brandName, setBrandName] = useState('Acme Co');
  const [brandDescription, setBrandDescription] = useState('We help small businesses grow with simple software.');
  const [audience, setAudience] = useState('small business owners');
  const [tone, setTone] = useState<'friendly' | 'professional' | 'playful' | 'bold'>('friendly');
  const [platforms, setPlatforms] = useState<Platform[]>(['twitter','linkedin','instagram']);
  const [goals, setGoals] = useState<Array<'awareness'|'engagement'|'traffic'|'leads'|'sales'>>(['awareness','engagement','traffic']);
  const [weeks, setWeeks] = useState(2);
  const [cadence, setCadence] = useState(3);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanItem[] | null>(null);
  const [summary, setSummary] = useState<string>('');

  const goalsOptions: Array<{key: typeof goals[number], label: string}> = [
    { key: 'awareness', label: 'Awareness' },
    { key: 'engagement', label: 'Engagement' },
    { key: 'traffic', label: 'Traffic' },
    { key: 'leads', label: 'Leads' },
    { key: 'sales', label: 'Sales' },
  ];

  const disabled = useMemo(() => {
    return !brandName || !brandDescription || !audience || platforms.length === 0 || goals.length === 0;
  }, [brandName, brandDescription, audience, platforms, goals]);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          brandDescription,
          audience,
          tone,
          goals,
          platforms,
          weeks,
          cadencePerWeek: cadence,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setPlan(data.items);
      setSummary(data.summary);
    } catch (e: any) {
      alert(e.message || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  }

  function downloadCSV() {
    if (!plan) return;
    const csv = toCSV(plan);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smm-plan-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyJSON() {
    if (!plan) return;
    navigator.clipboard.writeText(JSON.stringify({ summary, items: plan }, null, 2));
  }

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Social Media Marketing Agent</h1>
        <p className="text-slate-600">Generate an actionable, editable content plan across platforms in seconds.</p>
      </header>

      <section className="grid gap-4 rounded-xl border bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Brand name</span>
            <input className="rounded border px-3 py-2" value={brandName} onChange={e=>setBrandName(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Audience</span>
            <input className="rounded border px-3 py-2" value={audience} onChange={e=>setAudience(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="text-sm text-slate-600">Brand description / value props</span>
          <textarea rows={3} className="rounded border px-3 py-2" value={brandDescription} onChange={e=>setBrandDescription(e.target.value)} />
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Tone</span>
            <select className="rounded border px-3 py-2" value={tone} onChange={e=>setTone(e.target.value as any)}>
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="playful">Playful</option>
              <option value="bold">Bold</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Weeks to plan</span>
            <input type="number" min={1} max={8} className="rounded border px-3 py-2" value={weeks} onChange={e=>setWeeks(parseInt(e.target.value||'1'))} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Cadence per week (per platform)</span>
            <input type="number" min={1} max={7} className="rounded border px-3 py-2" value={cadence} onChange={e=>setCadence(parseInt(e.target.value||'1'))} />
          </label>
        </div>
        <div className="grid gap-1">
          <span className="text-sm text-slate-600">Goals</span>
          <div className="flex flex-wrap gap-2">
            {goalsOptions.map(g => (
              <label key={g.key} className={`flex items-center gap-2 rounded border px-3 py-2 bg-white cursor-pointer ${goals.includes(g.key) ? 'ring-2 ring-blue-600' : ''}`}>
                <input
                  type="checkbox"
                  checked={goals.includes(g.key)}
                  onChange={() => setGoals(goals.includes(g.key) ? goals.filter(x=>x!==g.key) : [...goals, g.key])}
                />
                <span>{g.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid gap-1">
          <span className="text-sm text-slate-600">Platforms</span>
          <PlatformSelector value={platforms} onChange={setPlatforms} />
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            disabled={disabled || loading}
            onClick={generate}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >{loading ? 'Generating...' : 'Generate plan'}</button>
          <button
            onClick={downloadCSV}
            disabled={!plan}
            className="rounded border px-4 py-2 disabled:opacity-50"
          >Download CSV</button>
          <button
            onClick={copyJSON}
            disabled={!plan}
            className="rounded border px-4 py-2 disabled:opacity-50"
          >Copy JSON</button>
        </div>
      </section>

      {plan && (
        <section className="space-y-3">
          <div className="text-slate-700">{summary}</div>
          <Calendar items={plan} onChange={setPlan} />
        </section>
      )}
    </main>
  );
}
