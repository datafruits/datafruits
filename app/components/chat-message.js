import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Component from '@ember/component';

@classic
export default class ChatMessage extends Component {
  gifsEnabled = true;
  imgRegex = /https?:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:jpg|gif|png|webp)(\?.*$)*/;

  get isDj() {
    if (!this.message.role) return false;
    return this.message.role.includes('dj');
  }
 
  @computed('message.body', 'imgRegex')
  get hasImage() {
    return this.imgRegex.test(this.message.body);
  }

  @computed('message.body', 'imgRegex')
  get imgUrl() {
    return this.message.body.match(this.imgRegex)[0];
  }

  willRender() {
    this.setupAutoscroll();
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.adjustScrolling();
  }
}
