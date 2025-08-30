import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { TrackEventPayload } from '../types/player';

// Define event types and their payloads
export interface EventTypeMap {
  // Track-related events with typed payloads
  trackPlayed: TrackEventPayload;
  trackPaused: TrackEventPayload;
  
  // Metadata events
  metadataUpdate: string;
  donationLinkUpdate: string;
  
  // Video/audio events  
  liveVideoAudio: void;
  liveVideoAudioOff: void;
  
  // Chat/UI events
  treasureOpened: any;
  fruitTipped: any;
  weatherChanged: string;
}

export default class EventBusService extends Service.extend(Evented) {
  // Type-safe publish method with overloads
  publish<K extends keyof EventTypeMap>(eventName: K, payload: EventTypeMap[K]): void;
  publish<K extends keyof EventTypeMap>(eventName: K): EventTypeMap[K] extends void ? void : never;
  publish(eventName: string, payload?: any): void;
  publish(eventName: string, payload?: any): void {
    if (payload !== undefined) {
      return this.trigger(eventName, payload);
    } else {
      return this.trigger(eventName);
    }
  }

  // Type-safe subscribe method with overloads
  subscribe<K extends keyof EventTypeMap>(
    eventName: K,
    target: object,
    method: string | ((payload: EventTypeMap[K]) => void)
  ): void;
  subscribe(eventName: string, target: object, method: string | Function): void;
  subscribe(eventName: string, target: object, method: string | Function): void {
    this.on(eventName, target, method as any);
  }

  // Type-safe unsubscribe method
  unsubscribe<K extends keyof EventTypeMap>(
    eventName: K,
    target: object,
    method?: string | ((payload: EventTypeMap[K]) => void)
  ): void;
  unsubscribe(eventName: string, target: object, method?: string | Function): void;
  unsubscribe(eventName: string, target: object, method?: string | Function): void {
    this.off(eventName, target, method as any);
  }
}