import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SignUpFormComponent extends Component {
  @tracked cocAccepted = false;

  get canSave() {
    const changeset = this.args.changeset;
    return !changeset.isSaving && changeset.isValid && this.cocAccepted === true;
  }

  @action
  submit() {
    let user = this.model;
    user.save().then(() => {
      //login user then transition to chat ??
    });
  }
}
