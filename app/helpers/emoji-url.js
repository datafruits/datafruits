import { helper } from '@ember/component/helper';

export default helper(function emojiUrl(emoji) {
  let extension;
  if (emoji.animated) {
    extension = '.gif';
  } else {
    extension = '.png';
  }
  if (emoji.custom) {
    return `/assets/images/emojis/${emoji.unicode}${extension}`;
  } else {
    return `https://cdn.jsdelivr.net/emojione/assets/4.0/png/32/${emoji.unicode}.png`;
  }
});
