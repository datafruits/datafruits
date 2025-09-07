import templateOnlyComponent from '@ember/component/template-only';

const HackButtonComponent =
  templateOnlyComponent();

export default HackButtonComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'HackButton': typeof HackButtonComponent;
    'hack-button': typeof HackButtonComponent;
  };;;;;;;;;;
}
