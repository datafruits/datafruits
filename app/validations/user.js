import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  username: validatePresence(true),
  password: validatePresence(true),
  email: validatePresence(true),
};
