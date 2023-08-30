import '@glint/environment-ember-loose';
import { ComponentLike, HelperLike } from '@glint/template';
import type RenderModifiersRegistry from '@ember/render-modifiers/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends RenderModifiersRegistry {
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
    'format-message-body': HelperLike;
  }
}

