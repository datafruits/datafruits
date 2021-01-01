import { action } from '@ember/object';
import { debounce } from '@ember/runloop';
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
    console.log('debouncing updateProperty...');
    debounce(this, this._updateProperty, event.target.value, 500);
  }

  @action
  validateProperty() {
    console.log('debouncing validateProperty');
    debounce(this, this._validateProperty, 500);
  }

  _validateProperty() {
    console.log('validating');
    let property = this.args.property;
    this.args.validateProperty(property);
  }

  _updateProperty(newValue) {
    console.log('updating property...');
    let property = this.args.property;
    this.args.updateProperty(property, newValue);
  }
}
