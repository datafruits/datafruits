import '@glint/environment-ember-loose';
import { ComponentLike, HelperLike } from '@glint/template';
import { BufferedChangeset } from 'ember-changeset/types';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    WelcomePage: ComponentLike;
    Await: ComponentLike;
    'page-title': HelperLike<{
      Args: { Positional: [title: string] };
      Return: void;
    }>;
    't': HelperLike<{
      Args: { Positional: [title: string] };
      Return: void;
    }>;
    PowerSelect: ComponentLike;
    PowerSelectMultipleWithCreate: ComponentLike;
    changeset: HelperLike<{
      Args: { Positional: [model: any, valiadtions: any] };
      Return: BufferedChangeset;
    }>;
    'format-message-body': HelperLike;
  }
}

