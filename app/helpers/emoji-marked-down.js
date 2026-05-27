import { helper } from '@ember/component/helper';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import { isBlank, isEmpty } from '@ember/utils';
import emojione from 'emojione';
import { replaceUserEmojis } from 'datafruits13/utils/user-emoji-registry';

export default helper(function markedDown(string) {
  if (isEmpty(string) || isBlank(string)) {
    return '';
  }
  const converter = new showdown.Converter({ simplifiedAutoLink: true });
  let text = replaceUserEmojis(string.toString());
  return htmlSafe(
    converter.makeHtml(emojione.shortnameToImage(text))
  );
});
