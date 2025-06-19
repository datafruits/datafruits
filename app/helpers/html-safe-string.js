import { htmlSafe } from '@ember/template';
import { helper } from '@ember/component/helper';

export function htmlSafeString(string) {
  return htmlSafe(string);
}

export default helper(htmlSafeString);
