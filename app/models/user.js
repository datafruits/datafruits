import Model, { attr, hasMany } from '@ember-data/model';
import { isEmpty } from '@ember/utils';

export default class UserModel extends Model {
  @attr()
  username;

  @attr()
  email;

  @attr()
  password;

  @attr()
  role;

  @attr()
  timeZone;

  @attr()
  avatarUrl;

  get avatarUrlOrDefault() {
    if (isEmpty(this.avatarUrl)) {
      return '/assets/images/show_placeholder.jpg';
    } else {
      return this.avatarUrl;
    }
  }

  @attr()
  imageUrl;

  @attr()
  imageThumbUrl;

  @attr()
  imageMediumUrl;


  @attr()
  avatar;

  @attr()
  avatarFilename;

  @attr()
  style;

  @attr()
  pronouns;

  @attr()
  createdAt;

  @attr()
  lastSignInAt;

  @attr()
  bio;

  @attr()
  homepage;

  @attr()
  fruitsAffinity;

  @attr()
  fruitTicketBalance;

  @attr()
  level;

  @attr()
  experiencePoints;

  @attr()
  xpNeededForNextLevel;

  @attr()
  xpProgressPercentage;

  @attr()
  hasUnreadNotifications;

  @hasMany('track-favorite', {
    async: false,
    inverse: null
  }) trackFavorites; // ugh
  @hasMany('scheduled-show-favorite', {
    async: false,
    inverse: null
  }) scheduledShowFavorites; // ugh

  @hasMany('fruit-summon', {
    async: false,
    inverse: null
  }) fruitSummons;

  @hasMany('shrimpo-entry', {
    async: false,
    inverse: 'user'
  }) shrimpoEntries;

  async favoritedTrack(trackId) {
    let trackFavorites = await this.trackFavorites;
    let trackIds = trackFavorites.map((trackFavorite) => {
      return trackFavorite.trackId;
    });
    console.log(trackIds);
    console.log(`trackId: ${trackId}`);
    console.log(trackIds.includes(parseInt(trackId)));
    return trackIds.includes(trackId);
  }

  get roles() {
    return this.role.split(" ");
  }
}
