import { modifier } from 'ember-modifier';
import type PodcastTrack from 'datafruits13/components/podcast-track';

interface PodcastTrackLifecycleSignature {
  Element: HTMLDivElement;
  Args: {
    Positional: [track: PodcastTrack];
  };
}

const podcastTrackLifecycle = modifier<PodcastTrackLifecycleSignature>((_element, [track]) => {
  track.setupSubscriptions();

  return () => {
    track.teardownSubscriptions();
  };
});

export default podcastTrackLifecycle;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'podcast-track-lifecycle': typeof podcastTrackLifecycle;
  }
}
