'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqItems } from '@/services/metro';
import { cn } from '@/lib/utils';

export function FAQSection({ limit }: { limit?: number }) {
  const items = typeof limit === 'number' ? faqItems.slice(0, limit) : faqItems;
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className="card overflow-hidden">
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${item.id}`}
                className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium hover:bg-surface"
                onClick={() => setOpenId(open ? null : item.id)}
              >
                {item.question}
                <ChevronDown
                  className={cn('h-4 w-4 shrink-0 text-muted transition-transform duration-150', open && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {open && (
              <div id={`faq-panel-${item.id}`} className="border-t border-app px-4 py-3 text-sm leading-relaxed text-muted">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
      {typeof limit === 'number' && faqItems.length > limit && (
        <div className="pt-2 text-center">
          <Link href="/faq" className="text-sm font-medium text-metro-blue hover:underline">
            View all FAQs
          </Link>
        </div>
      )}
    </div>
  );
}
