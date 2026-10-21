import emojiStrategy from 'datafruits13/emojiStrategy';

export function createEmojiAutocomplete() {
  return {
    id: 'emojis',
    match: /\B:([-+\w]*)$/,

    context: () => {
      return true;
    },

    search: (term: string, callback: (results: any) => void) => {
      const results: string[] = [];
      const results2: string[] = [];
      const results3: string[] = [];
      for (const [shortname, data] of Object.entries(emojiStrategy)) {
        if (shortname.indexOf(term) > -1) {
          results.push(shortname);
        } else {
          if (data.keywords !== null && data.keywords.indexOf(term) > -1) {
            results3.push(shortname);
          }
        }
      }
      if (term.length >= 3) {
        results.sort((a, b) => {
          if(a.length > b.length) {
            return 1;
          }
          if(a.length < b.length) {
            return -1;
          }
          return 0;
        });
        results2.sort((a, b) => {
          if(a.length > b.length) {
            return 1;
          }
          if(a.length < b.length) {
            return -1;
          }
          return 0;
        });
        results3.sort();
      }
      const newResults = results.concat(results2).concat(results3);

      callback(newResults);
    },
    template: function (shortname: string) {
      const emoji = emojiStrategy[shortname];
      const file = emoji?.file || `${shortname}.png`;
      return `<img class="inline-emoji" src="/emoji-zone/${file}"> ${shortname}`;
    },
    replace: function (shortname: string) {
      return shortname;
    },
  };
}