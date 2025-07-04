import Component from '@glimmer/component';
import type ShowSeriesModel from 'datafruits13/models/show-series';

interface UserShowCardArgs {
  show: ShowSeriesModel;
}

 
export default class UserShowCard extends Component<UserShowCardArgs> {}
