import type { TemplateOnlyComponent } from '@ember/component/template-only';

export interface SelectedBadgeSignature {
  Element: Element;
  Args: {
    option: any;
  };
}

export default <template><img class="w-8" src={{@option.img}} /></template> satisfies TemplateOnlyComponent<SelectedBadgeSignature>;