import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  amount: validatePresence(true),
};
