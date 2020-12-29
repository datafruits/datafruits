import { helper } from '@ember/component/helper';
import jstz from 'jstimezonedetect';

export function currentTimezone() {
  return jstz.determine().name();
}

export default helper(currentTimezone);
