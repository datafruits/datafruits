import Model, { attr } from '@ember-data/model';
import classic from 'ember-classic-decorator';

@classic // why ??
export default class WikiPage extends Model {
  @attr('string') declare title: string;
  @attr('string') declare body: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'wiki-page': WikiPage;
//   }
// }
