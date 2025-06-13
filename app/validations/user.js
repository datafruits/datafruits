import { validatePresence, validateFormat, validateLength } from 'ember-changeset-validations/validators';
import uniqueEmail from 'datafruits13/validators/unique-email';
import uniqueUsername from 'datafruits13/validators/unique-username';

export default {
  username: [validatePresence(true), uniqueUsername()],
  password: [validatePresence(true), validateLength({ min: 8 })],
  email: [validateFormat({ type: 'email' }), uniqueEmail()],
};
