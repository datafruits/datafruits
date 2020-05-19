import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TvModeButtonComponent extends Component {
  @service
  videoStream;

  @action
  toggle(){
    this.videoStream.toggleMode();
  }
}
