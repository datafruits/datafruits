import emojione from 'npm:emojione';

export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
  const customEmojis = {
    ":bgs:": {
      custom: true,
      uc_base: "bgs",
      uc_output: "",
      shortnames: []
    },
    ":tony:": {
      custom: true,
      uc_base: "tony",
      uc_output: "",
      shortnames: [":firedrill:", ":freedrull:", ":mcfiredrill:"]
    },
    ":ovenrake:": {
      custom: true,
      uc_base: "ovenrake",
      uc_output: "",
      shortnames: [":dakota:", ":oven:"]
    },
    ":snailzone:": {
      custom: true,
      uc_base: "snailzone",
      uc_output: "",
      shortnames: [":snailzone:", ":slimethru:"]
    }
  };
  Object.keys(customEmojis).forEach(emoji => {
    emojione.emojioneList[emoji] = customEmojis[emoji];
  });
  emojione.shortnames = emojione.shortnames.concat(`|${Object.keys(customEmojis).join('|')}`);
  //emojione.shortnames = emojione.shortnames.concat("|:bgs:");
  emojione.regShortNames = new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|("+emojione.shortnames+")", "gi");

  //emojione.imagePathPNG = "/assets/images/emojis/";
  emojione.customImagePathPNG = "/assets/images/emojis/";
}

export default {
  name: 'custom-emoji',
  initialize
};
