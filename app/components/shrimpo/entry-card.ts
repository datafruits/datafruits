import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import type ShrimpoVotingCategoryScore from 'datafruits13/models/shrimpo-voting-category-score';
import { inject as service } from '@ember/service';
import type EmojiZoneService from 'datafruits13/services/emoji-zone';

interface ShrimpoEntryCardArgs {
  shrimpoEntry: ShrimpoEntry;
  categoryScore: ShrimpoVotingCategoryScore;
}

export default class ShrimpoEntryCard extends Component<ShrimpoEntryCardArgs> {
  @service('emoji-zone')
  declare emojiZone: EmojiZoneService;

  get scoreEmoji() {
    return this.emojiZone.htmlFor(this.args.shrimpoEntry.get('shrimpoEmoji'));
  }

  get categoryScoreEmoji() {
    return this.emojiZone.htmlFor(this.args.categoryScore?.shrimpoVotingCategory?.get('emoji'));
  }
}