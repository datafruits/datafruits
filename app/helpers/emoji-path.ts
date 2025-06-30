import { helper } from '@ember/component/helper';
import emojione from 'emojione';

export function emojiPath(args: any) {
  return emojione.shortnameToPath(args);
}

export default helper(emojiPath);
