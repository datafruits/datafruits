import Component from '@glimmer/component';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';

interface ChatEnableGifsButtonSignature {
  Args: {
    enabled: unknown;
    toggleGifs: unknown;
  };
}

export default class EnableGifsButton extends Component<ChatEnableGifsButtonSignature> {

  get imgOn() {
    return formatEmojiHtml(":frame_photo:")
  }

  get imgOff() {
    return formatEmojiHtml(":no_entry_sign:");
  }
  
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    EnableGifsButton: typeof EnableGifsButton;
  }
}
  