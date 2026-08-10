'use client';

/**
 * components/arrivals/ServiceStateMessage.tsx
 *
 * Friendly Hinglish state messages for edge cases. Returns null when the
 * service is running normally so the standard board can render.
 */

import { Moon, Sunrise, TriangleAlert } from 'lucide-react';

import type { ServiceStatusType } from '@/services/providers/types';

interface Props {
  status: ServiceStatusType;
  /** e.g. '06:00' — shown in the not-started message. */
  firstTrain?: string;
}

const MESSAGE_BY_STATUS: Record<
  Exclude<ServiceStatusType, 'normal'>,
  { title: string; body: string }
> = {
  'not-started-yet': {
    title: 'Abhi metro chal nahi rahi 😴',
    body: 'Service hamesha ki tarah subah {first} se shuru hogi. Pehli metro {first} par nikalengi.',
  },
  'service-ended': {
    title: 'Aaj ki service khatam ho gayi 🌙',
    body: 'Agli service kal subah {first} par shuru hogi. Shukriya!',
  },
  unavailable: {
    title: 'Abhi data uplabdh nahi hai 🛠️',
    body: 'Thodi der baad dobara check karein. Station par bhi timings confirm kar sakte hain.',
  },
};

export function ServiceStateMessage({ status, firstTrain = '06:00' }: Props) {
  if (status === 'normal') return null;

  const message = MESSAGE_BY_STATUS[status];
  const Icon =
    status === 'not-started-yet' ? Moon : status === 'service-ended' ? Sunrise : TriangleAlert;

  return (
    <div className="card flex items-start gap-3 p-4" role="status">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold">{message.title}</p>
        <p className="mt-0.5 text-sm text-muted">
          {message.body.split('{first}').join(firstTrain)}
        </p>
      </div>
    </div>
  );
}
