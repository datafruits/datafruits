import Component from '@glimmer/component';

interface PasswordFormArgs {}

export default class PasswordForm extends Component<PasswordFormArgs> {
  get cantSubmit(): boolean {
    return false;
  }
}
