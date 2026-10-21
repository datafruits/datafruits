import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import type ShrimpoVotingCategoryScore from 'datafruits13/models/shrimpo-voting-category-score';
import { inject as service } from '@ember/service';
import type EmojiService from 'datafruits13/services/emoji';

interface ShrimpoEntryCardArgs {
  shrimpoEntry: ShrimpoEntry;
  categoryScore: ShrimpoVotingCategoryScore;
}

export default class ShrimpoEntryCard extends Component<ShrimpoEntryCardArgs> {
  @service('emoji')
  declare emoji: EmojiService;

  get scoreEmojiUrl() {
    return this.emoji.urlFor(this.args.shrimpoEntry.get('shrimpoEmoji'));
  }

  get categoryScoreEmojiUrl() {
    return this.emoji.urlFor(this.args.categoryScore?.shrimpoVotingCategory?.get('emoji'));
  }
}