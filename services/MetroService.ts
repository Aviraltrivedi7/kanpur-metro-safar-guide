/**
 * services/MetroService.ts
 *
 * Phase 12 — provider orchestration singleton.
 *
 * Resolution order:
 *  1. If NEXT_PUBLIC_UPMRC_API_URL + NEXT_PUBLIC_UPMRC_API_KEY are set and
 *     NEXT_PUBLIC_ENABLE_LIVE_ARRIVALS !== 'false', ATTEMPT the live feed.
 *  2. Any live-feed failure (it currently always throws — there is no
 *     verified public API) falls back gracefully to ScheduleProvider.
 *
 * The UI never talks to providers directly; it always goes through this
 * service, so a future live feed lights the whole app up with zero
 * frontend changes.
 */

import { LiveFeedProvider } from '@/services/providers/LiveFeedProvider';
import { ScheduleProvider } from '@/services/providers/ScheduleProvider';
import type {
  ArrivalEstimate,
  MetroDataProvider,
  ServiceAlert,
  ServiceStatusType,
  StationLiveBoard,
} from '@/services/providers/types';

const scheduleProvider = new ScheduleProvider();

function envFlag(name: string): string | undefined {
  // Accessed at call time so client bundles inline the NEXT_PUBLIC_* values.
  return process.env[name];
}

class MetroService {
  private static instance: MetroService | null = null;

  private readonly liveProvider: LiveFeedProvider;

  private constructor() {
    this.liveProvider = new LiveFeedProvider(
      envFlag('NEXT_PUBLIC_UPMRC_API_URL'),
      envFlag('NEXT_PUBLIC_UPMRC_API_KEY')
    );
  }

  static get(): MetroService {
    if (!MetroService.instance) MetroService.instance = new MetroService();
    return MetroService.instance;
  }

  /** Should we even attempt the live feed? */
  private get liveEnabled(): boolean {
    return (
      envFlag('NEXT_PUBLIC_ENABLE_LIVE_ARRIVALS') !== 'false' && this.liveProvider.configured
    );
  }

  /** The provider currently in effect, after any failure. */
  async resolveProvider(): Promise<MetroDataProvider> {
    if (!this.liveEnabled) return scheduleProvider;
    try {
      // Live feed is a placeholder that always throws today.
      await this.liveProvider.getOverallStatus();
      this.logInfo(`live provider active: ${this.liveProvider.name}`);
      return this.liveProvider;
    } catch {
      this.logWarn('live provider unavailable — falling back to schedule mode');
      return scheduleProvider;
    }
  }

  async getArrivals(stationId: string, directionTowardId: string): Promise<ArrivalEstimate[]> {
    const provider = await this.resolveProvider();
    return provider.getArrivals(stationId, directionTowardId);
  }

  async getBoard(stationId: string): Promise<StationLiveBoard> {
    const provider = await this.resolveProvider();
    return provider.getBoard(stationId);
  }

  async getOverallStatus(): Promise<ServiceStatusType> {
    const provider = await this.resolveProvider();
    return provider.getOverallStatus();
  }

  async getAlerts(): Promise<ServiceAlert[]> {
    const provider = await this.resolveProvider();
    return provider.getAlerts();
  }

  /** Poll interval (ms) appropriate for the active provider. */
  async getPollIntervalMs(): Promise<number> {
    const provider = await this.resolveProvider();
    return provider.pollIntervalMs;
  }

  private logInfo(message: string): void {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info('[MetroService]', message);
    }
  }

  private logWarn(message: string): void {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('[MetroService]', message);
    }
  }
}

/** Shared singleton — import this everywhere. */
export const metroService = MetroService.get();
