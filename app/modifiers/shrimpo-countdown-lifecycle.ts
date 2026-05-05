import { modifier } from 'ember-modifier';
import type ShrimpoCountdown from 'datafruits13/components/shrimpo/countdown';

interface ShrimpoCountdownLifecycleSignature {
  Element: HTMLElement;
  Args: {
    Positional: [countdown: ShrimpoCountdown];
  };
}

const shrimpoCountdownLifecycle = modifier<ShrimpoCountdownLifecycleSignature>((_element, [countdown]) => {
  countdown.startCountdown();

  return () => {
    countdown.stopCountdown();
  };
});

export default shrimpoCountdownLifecycle;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'shrimpo-countdown-lifecycle': typeof shrimpoCountdownLifecycle;
  }
}
