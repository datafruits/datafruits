import Component from '@glimmer/component';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';

export default class EnableGifsButton extends Component {

  get imgOn() {
    return formatEmojiHtml(":frame_photo:")
  }

  get imgOff() {
    return formatEmojiHtml(":no_entry_sign:");
  }
  
}