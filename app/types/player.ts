// Shared event payload type
export type TrackEventPayload = {
  title: string;
  cdnUrl: string;
  id: number | string;
  track_id: number | string;
};

// Player state enum
export enum PlayerState {
  Playing = 'playing',
  Paused = 'paused',
  Stopped = 'stopped'
}