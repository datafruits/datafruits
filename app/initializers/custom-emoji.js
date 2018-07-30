import emojione from 'npm:emojione';

export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
  const customEmojis = {
    ":bgs:": {
      custom: true,
      uc_base: "bgs",
      uc_output: "",
      shortnames: [":bgs:"],
      keywords: ["bgs"]
    },
    ":tony:": {
      custom: true,
      uc_base: "tony",
      uc_output: "",
      shortnames: [":firedrill:", ":freedrull:", ":mcfiredrill:"],
      keywords: ["firedrill", "freedrull", "mcfiredrill"]
    },
    ":ovenrake:": {
      custom: true,
      uc_base: "ovenrake",
      uc_output: "",
      shortnames: [":dakota:", ":oven:"],
      keywords: ["dakota", "oven"]
    },
    ":snailzone:": {
      custom: true,
      uc_base: "snailzone",
      uc_output: "",
      shortnames: [":snailzone:"],
      keywords: ["snail", "slimethru"]
    },
    ":trekkie:": {
      custom: true,
      uc_base: "trekkie",
      uc_output: "",
      shortnames: [":trekkie:", ":trekkietrax:"],
      keywords: ["trekkie", "trekkietrax"]
    },
    ":datafruits:": {
      custom: true,
      uc_base: "datafruits",
      uc_output: "",
      shortnames: [":datafruits:", ":datacoin:"],
      keywords: ["datafruits", "datacoin"],
      extension: "gif"
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
