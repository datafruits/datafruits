import Model, { attr } from '@ember-data/model';

export default class ShowSeries extends Model {
  @attr('string') declare title: string;
  @attr('string') declare description: string;

  @attr('boolean') declare repeating: boolean;
  @attr('string') declare recurringInterval: string;
  @attr('string') declare recurringWeekday: string;
  @attr('string') declare recurringCadence: string;

  @attr('string') declare image: string;
  @attr('string') declare imageFilename: string;

  @attr('date') declare startTime: Date;
  @attr('date') declare endTime: Date;
  @attr('date') declare startDate: Date;
  @attr('date') declare endDate: Date;

  get isWeekly() {
    return this.recurringInterval === 'week';
  }

  get isBiweekly() {
    return this.recurringInterval === 'biweek';
  }

  get isMonthly() {
    return this.recurringInterval === 'month';
  }

  get startDateFormatted() {
    return this.startDate.toISOString().split("T")[0];
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'show-series': ShowSeries;
//   }
// }
