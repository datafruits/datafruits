import Model, { attr } from '@ember-data/model';

export default class WikiPageEdit extends Model {
  // normal class body definition here
  @attr('string') declare summary: string;
  @attr('date') declare createdAt: string;
  @attr('string') declare username: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'wiki-page-edit': WikiPageEdit;
  };;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
}
