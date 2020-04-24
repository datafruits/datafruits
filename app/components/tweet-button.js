import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class TweetButton extends Component {
  didInsertElement() {
    if(window.twttr){
      window.twttr.widgets.load();
    }
  }
}
