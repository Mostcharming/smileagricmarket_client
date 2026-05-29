'use client'

import React from 'react';
import Link from 'next/link';
import { TickIcon } from '@/components/icons';

type CompletionItem = {
  label: string;
  status: string;
  tone: string;
  complete?: boolean;
  href?: string;
};

type Props = {
  completion: number;
  items: CompletionItem[];
};

export default function ProfileCompletion({ completion, items }: Props) {
  return (
    <aside className="rounded-2xl border border-[#DFE7D3] bg-white px-4 py-4 shadow-[0_3px_8px_rgba(21,28,11,0.03)]">
      <p className="text-[13px] text-[#374151]">Profile Completion</p>
      <div className="mt-1 text-[36px] font-semibold leading-none text-[#1F2937]">{completion}%</div>

      <div className="mt-4 h-3 rounded-full bg-[#D4E8C4]">
        <div className="h-3 rounded-full bg-[#69B33C]" style={{ width: `${completion}%` }} />
      </div>

      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {item.complete ? (
                <TickIcon size={20} color="#64B03F" />
              ) : (
                <span className="h-5 w-5 rounded-full border border-[#D5E7C7] bg-[#F4FAEF]" />
              )}

              <span className="text-[14px] font-semibold text-[#404448]">{item.label}</span>
            </div>

            {item.href ? (
              <Link href={item.href} className={`rounded-md px-3 py-1 cursor-pointer text-[12px] font-semibold ${item.tone}`}>
                {item.status}
              </Link>
            ) : (
              <span className={`rounded-md px-3 py-1 text-[12px] font-semibold ${item.tone}`}>{item.status}</span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
