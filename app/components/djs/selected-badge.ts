import templateOnly from '@ember/component/template-only';

export interface SelectedBadgeSignature {
  Element: Element;
  Args: {
    option: any;
  };
}

export default templateOnly<SelectedBadgeSignature>();