import Model, { attr, hasMany } from '@ember-data/model';

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
  bio;

  @attr()
  homepage;

  @attr()
  fruitsAffinity;

  @attr()
  fruitTicketBalance;

  @hasMany('track-favorite', { async: false }) trackFavorites; // ugh

  @hasMany('fruit-summon') fruitSummons;

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
    return this.role.split(" ")
  }
}
