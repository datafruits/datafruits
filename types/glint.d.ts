import '@glint/environment-ember-loose';
import { ComponentLike, HelperLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    WelcomePage: ComponentLike;
    'page-title': HelperLike<{
      Args: { Positional: [title: string] };
      Return: void;
    }>;
    't': HelperLike<{
      Args: { Positional: [title: string] };
      Return: void;
    }>;
    PowerSelect: ComponentLike;
  }
}

