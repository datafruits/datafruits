import Model from '@ember-data/model';
import classic from 'ember-classic-decorator';

@classic // why ??
export default class WikiPage extends Model {
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'wiki-page': WikiPage;
//   }
// }
