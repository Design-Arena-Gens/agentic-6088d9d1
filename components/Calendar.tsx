"use client";
import React, { useMemo, useState } from 'react';
import { type PlanItem } from "@/lib/agent";

export function Calendar({ items, onChange }: { items: PlanItem[]; onChange: (items: PlanItem[]) => void }) {
  const [filter, setFilter] = useState<string>('');

  const filtered = useMemo(() => {
    if (!filter.trim()) return items;
    const f = filter.toLowerCase();
    return items.filter(i =>
      i.platform.toLowerCase().includes(f) ||
      i.title.toLowerCase().includes(f) ||
      i.caption.toLowerCase().includes(f) ||
      i.hashtags.join(' ').toLowerCase().includes(f)
    );
  }, [items, filter]);

  const updateItem = (idx: number, patch: Partial<PlanItem>) => {
    const next = [...items];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input
          placeholder="Filter by platform, title, caption or hashtag"
          className="w-full rounded border px-3 py-2"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      <div className="grid gap-3">
        {filtered.map((i, idx) => (
          <div key={`${i.platform}-${i.scheduledAt}-${idx}`} className="rounded-lg border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold text-slate-800">{i.platform.toUpperCase()} ? {new Date(i.scheduledAt).toLocaleString()}</div>
              <div className="text-xs text-slate-500">Goal: {i.goal}</div>
            </div>
            <div className="mt-2">
              <input
                className="w-full rounded border px-3 py-2 font-medium"
                value={i.title}
                onChange={e => updateItem(idx, { title: e.target.value })}
              />
            </div>
            <div className="mt-2">
              <textarea
                rows={3}
                className="w-full rounded border px-3 py-2"
                value={i.caption}
                onChange={e => updateItem(idx, { caption: e.target.value })}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              <input
                className="flex-1 rounded border px-3 py-2"
                value={i.hashtags.join(' ')}
                onChange={e => updateItem(idx, { hashtags: e.target.value.split(/\s+/).filter(Boolean) })}
              />
              <input
                className="w-36 rounded border px-3 py-2"
                value={i.cta}
                onChange={e => updateItem(idx, { cta: e.target.value })}
              />
            </div>
            {i.suggestedAsset && (
              <div className="mt-2 text-sm text-slate-600">Asset: {i.suggestedAsset}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
