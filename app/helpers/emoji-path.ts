import { helper } from '@ember/component/helper';
import emojione from 'emojione';

export function emojiPath(args: unknown[]) {
  return emojione.shortnameToPath(args[0] as string);
}

export default helper(emojiPath);
