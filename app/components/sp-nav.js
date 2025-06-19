import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';


export default class SpNav extends Component {
  @service
  session;

  @service
  currentUser;

  @tracked
  showingSettings = false;

  @action
  settingsDialogToggle() {
    this.showingSettings = !this.showingSettings;
  }

  @action
  closeDialog() {
    this.showingSettings = false;
  }
}
