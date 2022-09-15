import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  title: validatePresence(true),
  body: validatePresence(true),
};
