"use client";
import React from 'react';

export type Platform = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'tiktok';

const PLATFORM_LABEL: Record<Platform, string> = {
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  tiktok: 'TikTok',
};

export function PlatformSelector({
  value,
  onChange,
}: {
  value: Platform[];
  onChange: (platforms: Platform[]) => void;
}) {
  const toggle = (p: Platform) => {
    const next = value.includes(p) ? value.filter(x => x !== p) : [...value, p];
    onChange(next);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {(Object.keys(PLATFORM_LABEL) as Platform[]).map(p => (
        <label key={p} className={`flex items-center gap-2 rounded border p-2 bg-white cursor-pointer ${value.includes(p) ? 'ring-2 ring-blue-600' : ''}`}>
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={value.includes(p)}
            onChange={() => toggle(p)}
          />
          <span>{PLATFORM_LABEL[p]}</span>
        </label>
      ))}
    </div>
  );
}
