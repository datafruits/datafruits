import { htmlSafe } from '@ember/string';
import { helper } from '@ember/component/helper';

export function htmlSafeString(string) {
  return htmlSafe(string);
}

export default helper(htmlSafeString);
