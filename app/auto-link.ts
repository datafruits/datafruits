const autoLink = function(s: string, options: any): string {
  let linkAttributes: string = "";
  const pattern: RegExp = /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[-A-Z0-9+\u0026\u2019@#/%?=()~_|!:,.;]*[-A-Z0-9+\u0026@#/%=~()_|])/gi;
  if (!(options.length > 0)) {
    return s.replace(pattern, "$1<a href='$2'>$2</a>");
  }

  const results: any[] = [];
  for (const [key, value] of Object.entries(options)) {
    results.push(" " + key + "='" + value + "'");
  }
  linkAttributes = results.join('');
  return s.replace(pattern, function(_match, space, url) {
    let link: string = "";
    link =
      "<a href='" + url + "'" + linkAttributes + ">" + url + "</a>)";
    return "" + space + link;
  });
};

export default autoLink;
