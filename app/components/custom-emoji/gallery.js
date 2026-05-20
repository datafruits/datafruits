import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { syncUserEmojis } from 'datafruits13/utils/user-emoji-registry';

function getEmojiOwnerId(emoji) {
  return String(emoji?.user?.id ?? emoji?.belongsTo?.('user')?.id?.() ?? '');
}

export default class CustomEmojiGallery extends Component {
  @service currentUser;
  @service session;
  @service store;

  @tracked error = '';
  @tracked savingEmojiIds = [];

  get savedEmojiIds() {
    return new Set(
      Array.from(this.currentUser.user?.customEmojis ?? []).map((emoji) => String(emoji.id)),
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
      await this.store.createRecord('user-emoji', {
        customEmojiId: emoji.id,
      }).save();

      const savedEmojis = this.currentUser.user?.customEmojis;
      const alreadySaved = savedEmojis?.find?.((savedEmoji) => {
        return String(savedEmoji.id) === emojiId;
      });

      if (savedEmojis && !alreadySaved) {
        if (typeof savedEmojis.pushObject === 'function') {
          savedEmojis.pushObject(emoji);
        } else {
          savedEmojis.push(emoji);
        }
      }

      syncUserEmojis(this.currentUser.user?.customEmojis);
    } catch (err) {
      console.error('Error saving custom emoji:', err);
      this.error = 'Failed to save emoji. Please try again.';
    } finally {
      this.savingEmojiIds = this.savingEmojiIds.filter((id) => id !== emojiId);
    }
  }
}
