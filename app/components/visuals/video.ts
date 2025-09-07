import templateOnlyComponent from '@ember/component/template-only';

interface VisualsVideoSignature {
  Args: {
    draggable: unknown;
    styleProperties: unknown;
  };
}

const VisualsVideoComponent =
  templateOnlyComponent<VisualsVideoSignature>();

export default VisualsVideoComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Visuals::Video': typeof VisualsVideoComponent;
    'visuals/video': typeof VisualsVideoComponent;
  };;;;;;;;;;
}
