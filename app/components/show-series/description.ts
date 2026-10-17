import Component from '@glimmer/component';

interface ShowSeriesDescriptionArgs {
  description: string | undefined;
}

export default class ShowSeriesDescription extends Component<ShowSeriesDescriptionArgs> {
  get body(): string | undefined {
    return this.args.description;
  }
}