import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class ValidatedField extends Component {
  get hasErrors() {
    let keys = this.args.changeset.get('errors').map((error) => {
      return error.key;
    });
    return keys.includes(this.args.property);
  }

  get errors() {
    let changeset = this.args.changeset;
    let property = this.args.property;
    return changeset
      .get('errors')
      .filter((error) => {
        return error.key === property;
      })
      .map((error) => {
        return error.validation;
      });
  }

  @action
  updateProperty(event) {
    let property = this.args.property;
    this.args.updateProperty(property, event.target.value);
  }

  @action
  validateProperty() {
    let property = this.args.property;
    return this.args.validateProperty(property);
  }
}
