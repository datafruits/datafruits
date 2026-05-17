import { modifier } from 'ember-modifier';
import type RandomBannerAd from 'datafruits13/components/random-banner-ad';

interface RandomBannerAdLifecycleSignature {
  Element: HTMLDivElement;
  Args: {
    Positional: [component: RandomBannerAd];
  };
}

const randomBannerAdLifecycle = modifier<RandomBannerAdLifecycleSignature>((_element, [component]) => {
  component.startRotation();

  return () => {
    component.stopRotation();
  };
});

export default randomBannerAdLifecycle;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'random-banner-ad-lifecycle': typeof randomBannerAdLifecycle;
  }
}
