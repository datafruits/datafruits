import templateOnlyComponent from '@ember/component/template-only';

interface GifPreviewSignature {
  Args: {
    gif: unknown;
    sendGif: unknown;
  };
}

const GifPreviewComponent =
  templateOnlyComponent<GifPreviewSignature>();

export default GifPreviewComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'GifPreview': typeof GifPreviewComponent;
    'gif-preview': typeof GifPreviewComponent;
  }
}
