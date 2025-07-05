import { on } from "@ember/modifier";
import { fn } from "@ember/helper";import type { TemplateOnlyComponent } from '@ember/component/template-only';

interface GifPreviewSignature {
  Args: {
    gif: unknown;
    sendGif: unknown;
  };
}

const GifPreviewComponent =
  <template><button class="gif-button" type="button" {{on "click" (fn @sendGif @gif)}}>
  <img class="gif-preview" alt={{@gif.name}} src={{@gif.previewUrl}}>
</button>
</template> satisfies TemplateOnlyComponent<GifPreviewSignature>;

export default GifPreviewComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'GifPreview': typeof GifPreviewComponent;
    'gif-preview': typeof GifPreviewComponent;
  }
}
