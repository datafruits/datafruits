import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { SafeString } from 'handlebars';
import emojione from 'emojione';
import { inject as service } from '@ember/service';

interface WikiArticleArgs {
  page: any;
}

export default class WikiArticle extends Component<WikiArticleArgs> {
  @service declare session: any;

  get body(): SafeString {
    return htmlSafe(emojione.shortnameToImage(this.args.page.body));
  }
}
