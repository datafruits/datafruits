import Model, { attr } from '@ember-data/model';

export default class UserSignupModel extends Model {
  @attr()
  month;

  @attr()
  monthName;

  @attr()
  count;
}