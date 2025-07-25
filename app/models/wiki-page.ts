import Model, { attr, hasMany } from '@ember-data/model';

export default class WikiPage extends Model {
  @attr('string') declare title: string;
  @attr('string') declare body: string;
  @attr('string') declare summary: string;
  @attr('string') declare slug: string;

  @hasMany('wiki-page-edit', {
    async: false,
    inverse: null
  }) wikiPageEdits: any;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'wiki-page': WikiPage;
//   }
// }
