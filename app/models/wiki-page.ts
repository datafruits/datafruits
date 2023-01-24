import Model, { attr, hasMany } from '@ember-data/model';
import classic from 'ember-classic-decorator';

@classic // why ??
export default class WikiPage extends Model {
  @attr('string') declare title: string;
  @attr('string') declare body: string;
  @attr('string') declare summary: string;
  @attr('string') declare slug: string;

  @hasMany('wiki-page-edit', { async: false }) wikiPageEdits: any;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'wiki-page': WikiPage;
//   }
// }
