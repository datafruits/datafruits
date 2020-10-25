import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class ValidatedField extends Component {
  @action
  validateProperty(changeset, property) {
    console.log('validating property');
    return changeset.validate(property);
  }
}
