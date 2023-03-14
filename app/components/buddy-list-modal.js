import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class BuddyListModalComponent extends Component {
  @service chat;
}