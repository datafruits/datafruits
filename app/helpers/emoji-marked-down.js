import { helper } from '@ember/component/helper';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import { isBlank, isEmpty } from '@ember/utils';
import emojione from 'emojione';

export default helper(function markedDown(string) {
  if (isEmpty(string) || isBlank(string)) {
    return '';
  }
  const converter = new showdown.Converter({ simplifiedAutoLink: true });
  return htmlSafe(
    converter.makeHtml(emojione.shortnameToImage(string.toString()))
  );
});
