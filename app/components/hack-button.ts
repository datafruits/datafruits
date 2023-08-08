import templateOnlyComponent from '@ember/component/template-only';

interface HackButtonSignature {
  Args: {};
  Element: HTMLAnchorElement;
}

const HackButtonComponent =
  templateOnlyComponent<HackButtonSignature>();

export default HackButtonComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'HackButton': typeof HackButtonComponent;
    'hack-button': typeof HackButtonComponent;
  }
}
