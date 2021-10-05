import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class GiphySearch extends Component {
  @tracked query;
}
