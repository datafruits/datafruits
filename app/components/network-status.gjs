import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import willDestroy from "@ember/render-modifiers/modifiers/will-destroy";

export default class NetworkStatus extends Component {<template><span {{didInsert this.didInsert}} {{willDestroy this.willDestroy}}>
</span>
{{yield this}}
</template>
  @tracked
  isOffline = false;

  @action
  didInsert() {
    let _update = () => {
      this.updateStatus();
    };
    this._update = _update;

    window.addEventListener('online', _update);
    window.addEventListener('offline', _update);

    this.updateStatus();
  }

  @action
  willDestroy() {
    super.willDestroy(...arguments);
    let _update = this._update;
    window.removeEventListener('online', _update);
    window.removeEventListener('offline', _update);
  }

  updateStatus() {
    console.log('setting offline status');
    this.isOffline = !navigator.onLine;
  }
}
