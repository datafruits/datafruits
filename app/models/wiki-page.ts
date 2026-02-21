import { Model, attr, hasMany } from '../../framework/index.js';

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
// }
