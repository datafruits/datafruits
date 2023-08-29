import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  title: validatePresence(true),
  rule_pack: validatePresence(true)
};
