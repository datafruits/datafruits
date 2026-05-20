import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import getEmojiOwnerId from 'datafruits13/utils/get-emoji-owner-id';

export default class HomeUserCustomEmojisController extends Controller {
  @service currentUser;

  get savedEmojis() {
    const user = this.currentUser.user;
    const userId = String(user?.id ?? '');

    return Array.from(user?.customEmojis ?? []).filter((emoji) => {
      return getEmojiOwnerId(emoji) !== userId;
    });
  }

  get uploadedEmojis() {
    const user = this.currentUser.user;
    const userId = String(user?.id ?? '');

    return Array.from(user?.customEmojis ?? []).filter((emoji) => {
      return getEmojiOwnerId(emoji) === userId;
    });
  }
}
