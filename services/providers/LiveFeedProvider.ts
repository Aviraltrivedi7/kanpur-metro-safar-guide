/**
 * services/providers/LiveFeedProvider.ts
 *
 * MODE B — LIVE (future).
 *
 * Placeholder for a future official UPMRC real-time feed. Until a verified
 * public API exists, EVERY method throws — MetroService catches this and
 * falls back to the ScheduleProvider. No frontend change is ever needed:
 * when the official feed becomes available, implement these methods and
 * the whole UI switches to 🟢 LIVE automatically.
 */

import type {
  MetroDataProvider,
  ServiceAlert,
  ServiceStatusType,
  StationLiveBoard,
  ArrivalEstimate,
} from '@/services/providers/types';

export class LiveFeedProvider implements MetroDataProvider {
  readonly name = 'UPMRC Live Feed';
  readonly isLive = true;
  readonly pollIntervalMs = 30_000;

  private readonly envReady: boolean;

  constructor(
    private readonly apiUrl: string | undefined,
    private readonly apiKey: string | undefined
  ) {
    this.envReady = Boolean(apiUrl && apiKey);
  }

  /** True only when official credentials are configured. */
  get configured(): boolean {
    return this.envReady;
  }

  private notAvailable(): never {
    throw new Error(
      'UPMRC real-time feed is not available. ' +
        'LiveFeedProvider is a future integration point only.'
    );
  }

  async getArrivals(): Promise<ArrivalEstimate[]> {
    this.notAvailable();
  }

  async getBoard(): Promise<StationLiveBoard> {
    this.notAvailable();
  }

  async getOverallStatus(): Promise<ServiceStatusType> {
    this.notAvailable();
  }

  async getAlerts(): Promise<ServiceAlert[]> {
    this.notAvailable();
  }
}
