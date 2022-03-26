import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

@classic
export default class DjController extends Controller {
  @service currentUser;
  @service store;

  get following() {
    return this.currentUser.user.followingUser(this.model);
  }

  @action
  browseLabel(label) {
    this.transitionToRoute('home.podcasts', { queryParams: { tags: label.name } });
  }

  @action
  followUser() {
    let userFollow = this.store.createRecord('userFollow', {
      followee: this.model,
    });
    userFollow
      .save()
      .then(() => {
        console.log('faved ya ');
      })
      .catch((error) => {
        console.log(`oh no error: ${error}`);
      });
  }

  @action
  unfollowUser() {
    let userFollow = this.currentUser.user.userFollows.find((userFollow) => {
      return userFollow.followeeName === this.model.username;
    });
    userFollow
      .destroyRecord()
      .then(() => {
        console.log('unfaved ya ');
      })
      .catch((error) => {
        console.log(`oh no error: ${error}`);
      });
  }
}
