import Component from '@glimmer/component';
import '@ember/object'; //eslint-disable-line ember/no-observers
import { tracked } from '@glimmer/tracking';

export default class GiphySearch extends Component {
  @tracked query;
}
