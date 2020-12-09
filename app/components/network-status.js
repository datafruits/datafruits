import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

@classic
@tagName('')
export default class NetworkStatus extends Component {
  isOffline = false;

  didInsertElement() {
    super.didInsertElement(...arguments);

    let _update = () => {
      this.updateStatus();
    };
    this.set('_update', _update);

    window.addEventListener('online', _update);
    window.addEventListener('offline', _update);

    this.updateStatus();
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    let _update = this._update;
    window.removeEventListener('online', _update);
    window.removeEventListener('offline', _update);
  }

  updateStatus() {
    console.log('setting offline status'); // eslint-disable-line no-console
    this.set('isOffline', !navigator.onLine);
  }
}
