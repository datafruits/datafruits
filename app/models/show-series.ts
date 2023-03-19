import Model, { attr } from '@ember-data/model';

export default class ShowSeries extends Model {
  @attr('string') declare title: string;
  @attr('string') declare description: string;

  @attr('string') declare recurringInterval: 'not_recurring' | 'week' | 'biweek' | 'month';
  @attr('string') declare recurringWeekday: string;
  @attr('string') declare recurringCadence: string;

  @attr('string') declare image: string;
  @attr('string') declare imageFilename: string;
  @attr('string') declare imageUrl: string;
  @attr('string') declare thumbImageUrl: string;

  @attr('string') declare startTime: string;
  @attr('string') declare endTime: string;
  @attr('string') declare startDate: string;
  @attr('string') declare endDate: string;

  get isWeekly() {
    return this.recurringInterval === 'week';
  }

  get isBiweekly() {
    return this.recurringInterval === 'biweek';
  }

  get isMonthly() {
    return this.recurringInterval === 'month';
  }

  get repeating() {
    return this.recurringInterval != 'not_recurring';
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'show-series': ShowSeries;
//   }
// }
