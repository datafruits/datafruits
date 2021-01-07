import emojione from 'emojione';

const emojiStrategy = {};

Object.keys(emojione.emojioneList).forEach((emoji) => {
  let keywords = emojione.emojioneList[emoji].keywords ? emojione.emojioneList[emoji].keywords : [];
  emojiStrategy[emoji] = {
    unicode: emojione.emojioneList[emoji].uc_base,
    shortname: emojione.emojioneList[emoji].shortnames[0],
    aliases: '',
    keywords: keywords,
    custom: emojione.emojioneList[emoji].custom,
    animated: emojione.emojioneList[emoji].animated,
  };
});

export default emojiStrategy;
