import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import getEmojiOwnerId from 'datafruits13/utils/get-emoji-owner-id';
import { registerUserEmoji } from 'datafruits13/utils/user-emoji-registry';

export default class CustomEmojiGallery extends Component {
  @service currentUser;
  @service session;
  @service store;

  @tracked error = '';
  @tracked savingEmojiIds = [];

  get savedEmojiIds() {
    return new Set(
      Array.from(this.currentUser.user?.userEmojis ?? []).map((userEmoji) => String(userEmoji.customEmojiId)),
    );
  }

  get displayEmojis() {
    const currentUserId = String(this.currentUser.user?.id ?? '');

    return Array.from(this.args.emojis ?? []).map((emoji) => {
      const emojiId = String(emoji.id);
      const isOwner = currentUserId !== '' && getEmojiOwnerId(emoji) === currentUserId;
      const isSaved = this.savedEmojiIds.has(emojiId);
      const isSaving = this.savingEmojiIds.includes(emojiId);

      return {
        emoji,
        isSaved,
        isSaving,
        ownerName: emoji?.user?.username,
        showSaveButton:
          Boolean(this.args.allowSave) &&
          this.session.isAuthenticated &&
          !isOwner,
      };
    });
  }

  @action
  async saveEmoji(emoji) {
    const emojiId = String(emoji.id);

    if (
      !this.session.isAuthenticated ||
      this.savedEmojiIds.has(emojiId) ||
      this.savingEmojiIds.includes(emojiId)
    ) {
      return;
    }

    this.error = '';
    this.savingEmojiIds = [...this.savingEmojiIds, emojiId];

    try {
      const userEmoji = this.store.createRecord('user-emoji', {
        customEmojiId: emoji.id,
      });
      await userEmoji.save();

      const userEmojis = this.currentUser.user?.userEmojis;
      const alreadySaved = userEmojis?.find?.((savedUserEmoji) => {
        return String(savedUserEmoji.customEmojiId) === emojiId;
      });

      if (userEmojis && !alreadySaved) {
        if (typeof userEmojis.pushObject === 'function') {
          userEmojis.pushObject(userEmoji);
        } else {
          userEmojis.push(userEmoji);
        }
      }

      registerUserEmoji(emoji.name, emoji.imageUrl);
    } catch (err) {
      console.error('Error saving custom emoji:', err);
      this.error = 'Failed to save emoji. Please try again.';
    } finally {
      this.savingEmojiIds = this.savingEmojiIds.filter((id) => id !== emojiId);
    }
  }
}
