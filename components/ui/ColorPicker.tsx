'use client';

import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        aria-label="Choose color"
        onClick={() => setOpen((v) => !v)}
        className="h-7 w-7 flex-shrink-0 rounded border border-neutral-600"
        style={{ background: value }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 font-mono text-xs text-neutral-100 focus:border-sky-500 focus:outline-none"
      />
      {open ? (
        <div
          ref={popRef}
          className="absolute left-0 top-9 z-50 rounded-md border border-neutral-700 bg-neutral-900 p-2 shadow-xl"
        >
          <HexColorPicker color={value} onChange={onChange} />
        </div>
      ) : null}
    </div>
  );
}
