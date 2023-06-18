import { validatePresence, validateLength } from 'ember-changeset-validations/validators';
// import notInPast from 'datafruits13/validators/not-in-past';
// import notBeforeStart from 'datafruits13/validators/not-before-start';

export default {
  title: validatePresence(true),
  description: [validatePresence(true), validateLength({ max: 10000 })],
  // start: notInPast(),
  // end: [notInPast(), notBeforeStart()],
};
