import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class HomeUserShowsEpisode extends Controller {
  @service declare session: any;
  @service declare currentUser: any;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
// declare module '@ember/controller' {
//   interface Registry {
//     'home/user/shows/episode': HomeUserShowsEpisode;
//   }
// }
