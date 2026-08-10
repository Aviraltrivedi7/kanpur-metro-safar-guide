import { getNetworkStatus } from '@/services/metro';
import { WifiOff } from 'lucide-react';

export function StatusBanner() {
  const status = getNetworkStatus();

  return (
    <div className="card flex items-start gap-3 border-l-4 border-l-upcoming p-4" role="status">
      <WifiOff className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold">{status.label}</p>
        <p className="mt-0.5 text-sm text-muted">{status.note}</p>
      </div>
    </div>
  );
}
