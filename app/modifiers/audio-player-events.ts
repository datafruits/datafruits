import { modifier } from 'ember-modifier';

interface AudioPlayerEventsNamed {
  onLoadstart: (el: HTMLAudioElement) => void;
  onPause: () => void;
  onPlaying: () => void;
  onSeeked: (el: HTMLAudioElement) => void;
  onTimeupdate: (el: HTMLAudioElement) => void;
  onSeeking: () => void;
  onCanplay: (el: HTMLAudioElement) => void;
  onSetup: (el: HTMLAudioElement) => void;
}

/**
 * Modifier that attaches and cleans up all audio element event listeners
 * for the datafruits player.
 */
const audioPlayerEvents = modifier(function audioPlayerEvents(
  element: HTMLAudioElement,
  _positional: [],
  named: AudioPlayerEventsNamed,
) {
  const { onLoadstart, onPause, onPlaying, onSeeked, onTimeupdate, onSeeking, onCanplay, onSetup } = named;

  const handleLoadstart = () => onLoadstart(element);
  const handleSeeked = () => onSeeked(element);
  const handleTimeupdate = () => onTimeupdate(element);
  const handleCanplay = () => onCanplay(element);

  element.addEventListener('loadstart', handleLoadstart);
  element.addEventListener('pause', onPause);
  element.addEventListener('playing', onPlaying);
  element.addEventListener('seeked', handleSeeked);
  element.addEventListener('timeupdate', handleTimeupdate);
  element.addEventListener('seeking', onSeeking);
  element.addEventListener('canplay', handleCanplay);

  onSetup(element);

  return () => {
    element.removeEventListener('loadstart', handleLoadstart);
    element.removeEventListener('pause', onPause);
    element.removeEventListener('playing', onPlaying);
    element.removeEventListener('seeked', handleSeeked);
    element.removeEventListener('timeupdate', handleTimeupdate);
    element.removeEventListener('seeking', onSeeking);
    element.removeEventListener('canplay', handleCanplay);
  };
});

export default audioPlayerEvents;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'audio-player-events': typeof audioPlayerEvents;
  }
}
