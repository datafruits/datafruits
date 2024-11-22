import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PcNav extends Component {
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


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PcNav: typeof PcNav;
  }
}
  
