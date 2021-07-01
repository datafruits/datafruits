import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SpNav extends Component {
  @service
  session;

  @service
  currentUser;
}
