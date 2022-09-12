import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { SafeString } from 'handlebars';
import emojione from 'emojione';

interface WikiArticleArgs {
  page: any;
}

export default class WikiArticle extends Component<WikiArticleArgs> {
  get body(): SafeString {
    return htmlSafe(emojione.shortnameToImage(this.args.page.body));
  }
}
