import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class ValidatedField extends Component {
  @action
  updateProperty(event) {
    let changeset = this.args.changeset;
    let property = this.args.property;
    changeset.set(property, event.target.value);
  }

  @action
  validateProperty() {
    let changeset = this.args.changeset;
    let property = this.args.property;
    return changeset.validate(property);
  }
}
