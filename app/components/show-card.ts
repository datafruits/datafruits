import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import type ShowSeriesModel from 'datafruits13/models/show-series';

interface ShowCardArgs {
  showSeries: ShowSeriesModel;
}

export default class ShowCardComponent extends Component<ShowCardArgs> {
  get backgroundStyle() {
    const image = this.args.showSeries.thumbImageOrDefault;
    return htmlSafe(`background-image: url('${image}');`);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ShowCardComponent: typeof ShowCardComponent;
  }
}

