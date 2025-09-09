import { helper } from '@ember/component/helper';

export default helper(function episodeImageUrl([changeset]) {
  if (changeset.image) {
    return changeset.image;
  }
  if (changeset.thumbImageUrl) {
    return changeset.thumbImageUrl;
  }
  return null;
});
