import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  title: validatePresence(true),
  rulePack: validatePresence(true),
  emoji: validatePresence(true),
};
