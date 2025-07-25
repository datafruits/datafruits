import Model, { attr, hasMany } from '@ember-data/model';
import type ScheduledShowModel from 'datafruits13/models/scheduled-show';
import type Label from 'datafruits13/models/label';
import type User from 'datafruits13/models/user';

export default class ShowSeries extends Model {
  @hasMany('scheduled-show', {
    async: false,
    inverse: null
  }) declare episodes: ScheduledShowModel;
  @hasMany('label', {
    async: false,
    inverse: null
  }) declare labels: Label;
  @hasMany('user', {
    async: false,
    inverse: null
  }) declare users: User;

  @attr('string') declare title: string;
  @attr('string') declare description: string;

  @attr('string') declare recurringInterval: 'not_recurring' | 'week' | 'biweek' | 'month' | 'year';
  @attr('string') declare recurringWeekday: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  @attr('string') declare recurringCadence: 'First' | 'Second' | 'Third' | 'Fourth' | 'Last';

  @attr('string') declare image: string;
  @attr('string') declare imageFilename: string;
  @attr('string') declare imageUrl: string;
  @attr('string') declare thumbImageUrl: string;

  @attr('string') declare startTime: string;
  @attr('string') declare endTime: string;
  @attr('string') declare startDate: string;
  @attr('string') declare endDate: string;

  @attr('string') declare slug: string;

  @attr('string') declare status: 'active' | 'archived' | 'disabled';

  get isWeekly() {
    return this.recurringInterval === 'week';
  }

  get isBiweekly() {
    return this.recurringInterval === 'biweek';
  }

  get isMonthly() {
    return this.recurringInterval === 'month';
  }

  get isYearly() {
    return this.recurringInterval === 'year';
  }

  get repeating() {
    return this.recurringInterval != 'not_recurring';
  }

  get formattedRecurringInterval() {
    return `${this.recurringInterval}ly`;
  }

  get formattedCadence(): string | undefined {
    if(this.isWeekly) {
      return this.recurringWeekday;
    }else if(this.isBiweekly) {
      // TODO i18n
      return `other ${this.recurringWeekday}`;
    } else if(this.isMonthly) {
      // TODO i18n
      return `${this.recurringCadence} ${this.recurringWeekday}`;
    } else if(this.isYearly) {
      // TODO i18n
      return "year";
    } else {
      return undefined;
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'show-series': ShowSeries;
//   }
// }
