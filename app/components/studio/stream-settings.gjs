import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

export default class StudioStreamSettings extends Component {
  @service currentUser;

  @tracked showStreamKey = false;

  @action
  toggleStreamKey(e) {
    e.preventDefault();
    this.showStreamKey = !this.showStreamKey;
  }

  <template>
    <div class="stream-settings">
      <label>Stream Key</label>
      <div class="stream-key-field">
        <input
          type={{if this.showStreamKey "text" "password"}}
          value={{this.currentUser.user.streamKey}}
          readonly
          class="input focus:outline-none focus:shadow-outline"
        />
        <a href="#" {{on "click" this.toggleStreamKey}}>
          {{if this.showStreamKey "Hide" "Show"}}
        </a>
      </div>
    </div>
  </template>
}
