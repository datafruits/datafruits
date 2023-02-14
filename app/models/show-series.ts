import Model, { attr } from '@ember-data/model';

export default class ShowSeries extends Model {
  @attr('string') declare title: string;
  @attr('string') declare description: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'show-series': ShowSeries;
//   }
// }
