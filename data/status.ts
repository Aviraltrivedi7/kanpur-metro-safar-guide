/**
 * data/status.ts
 *
 * Network status. There is no public live-status API for Kanpur Metro,
 * so everything defaults to unknown/unavailable until a real API exists.
 */

export type NetworkState = 'unknown' | 'operational' | 'disruption' | 'closed';

export interface NetworkStatus {
  state: NetworkState;
  label: string;
  isLive: boolean;
  updatedAt: string | null;
  note: string;
}

export function getNetworkStatus(): NetworkStatus {
  return {
    state: 'unknown',
    label: 'Status unavailable',
    isLive: false,
    updatedAt: null,
    note: 'Live status is not available. Kanpur Metro does not publish a public status feed yet.',
  };
}
