import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service  } from '@ember/service';

@classic
export default class DjController extends Controller {
  @service currentUser;
  @service store;

  get following(){
    return this.currentUser.user.followingUser(this.model);
  }

  @action
  browseLabel(label) {
    this.transitionToRoute('home.podcasts', { queryParams: { tags: label.name } });
  }

  @action
  followUser(followee) {
    this.store.createRecord('userFollow', {
      user: this.currentUser;
      followee: followee;
    }).then(() => {
      console.log('faved ya ');
    }).catch((error) => {
      console.log(`oh no error: ${error}`);
    });
  }
}
