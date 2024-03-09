import { helper } from '@ember/component/helper';
import emojione from 'emojione';

export function emojiPath(emoji: any) {
  return emojione.shortnameToPath(emoji);
}

export default helper(emojiPath);
