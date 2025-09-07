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
      let extension;
      if (emojiStrategy[shortname].animated) {
        extension = '.gif';
      } else {
        extension = '.png';
      }
      if (emojiStrategy[shortname].custom) {
        return `<img class="emojione" src="/assets/images/emojis/${emojiStrategy[shortname].unicode}${extension}"> ${shortname}`;
      } else {
        return (
          '<img class="emojione" src="//cdn.jsdelivr.net/emojione/assets/4.0/png/32/' +
          emojiStrategy[shortname].unicode +
          '.png"> ' +
          shortname
        );
      }
    },
    replace: function (shortname: string) {
      return shortname;
    },
  };
}