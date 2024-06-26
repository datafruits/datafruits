import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { SafeString } from 'handlebars';
import emojione from 'emojione';

interface ShowSeriesDescriptionArgs {
  description: string | undefined;
}

export default class ShowSeriesDescription extends Component<ShowSeriesDescriptionArgs> {
  get body(): SafeString | undefined {
    if(this.args.description) {
      return htmlSafe(emojione.shortnameToImage(this.args.description));
    } else {
      return undefined;
    }
  }
}
