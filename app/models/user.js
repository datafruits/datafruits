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
  avatarUrl;

  @attr()
  imageUrl;

  @attr()
  imageThumbUrl;

  @attr()
  imageMediumUrl;


  @attr('file')
  avatar;

  @attr()
  avatarFilename;

  @attr()
  style;

  @attr()
  pronouns;

  @attr()
  bio;

  @hasMany('track-favorite', { async: false }) trackFavorites; // ugh

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
}
