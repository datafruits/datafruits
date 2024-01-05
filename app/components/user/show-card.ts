import Component from '@glimmer/component';
import type ShowSeriesModel from 'datafruits13/models/show-series';

interface UserShowCardArgs {
  show: ShowSeriesModel;
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class UserShowCard extends Component<UserShowCardArgs> {}
