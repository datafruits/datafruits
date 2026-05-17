import { modifier } from 'ember-modifier';
import type DatafruitsPlayer from 'datafruits13/components/datafruits-player';

interface PlayerLifecycleSignature {
  Element: HTMLAudioElement;
  Args: {
    Positional: [player: DatafruitsPlayer];
  };
}

const playerLifecycle = modifier<PlayerLifecycleSignature>((element, [player]) => {
  player.setupPlayer(element);

  return () => {
    player.teardownPlayer(element);
  };
});

export default playerLifecycle;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'player-lifecycle': typeof playerLifecycle;
  }
}
