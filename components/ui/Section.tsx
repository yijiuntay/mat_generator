'use client';

import { ReactNode, useState } from 'react';

export function Section({
  title,
  defaultOpen = true,
  children,
  right,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  right?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-neutral-800">
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-2 text-left text-sm font-semibold uppercase tracking-wide text-neutral-200"
        >
          <span
            className={`inline-block transform text-neutral-500 transition-transform ${
              open ? 'rotate-90' : ''
            }`}
          >
            ▸
          </span>
          {title}
        </button>
        {right}
      </header>
      {open ? <div className="space-y-3 px-4 pb-4">{children}</div> : null}
    </section>
  );
}
