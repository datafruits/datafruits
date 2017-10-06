import emojione from 'npm:emojione';

export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
  emojione.emojioneList[":bgs:"] = {
    custom: true,
    uc_base: "bgs",
    uc_output: "",
    shortnames: []
  };
  emojione.shortnames = emojione.shortnames.concat("|:bgs:");
  emojione.regShortNames = new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|("+emojione.shortnames+")", "gi");
}

export default {
  name: 'custom-emoji',
  initialize
};
