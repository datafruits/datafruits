import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import type ShrimpoVotingCategoryScore from 'datafruits13/models/shrimpo-voting-category-score';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';

interface ShrimpoEntryCardArgs {
  shrimpoEntry: ShrimpoEntry;
  categoryScore: ShrimpoVotingCategoryScore;
}

export default class ShrimpoEntryCard extends Component<ShrimpoEntryCardArgs> {
  get scoreEmoji() {
    // need to use get here
    return formatEmojiHtml(this.args.shrimpoEntry.get('shrimpoEmoji'));
  }

  get categoryScoreEmoji() {
    return formatEmojiHtml(this.args.categoryScore.shrimpoVotingCategory.get('emoji'));
  }
}
