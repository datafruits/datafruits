import Model, { attr } from '@ember-data/model';

export default class Notification extends Model {
  @attr('string') declare message: string;
  @attr('string') declare url: string;

  @attr('string') declare createdAt: string;
}
