import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class ThemeSelector extends Component {
  init() {
    super.init(...arguments);
    this.setTheme = () => {};
    this.themes = [
      { text: 'its just a website', value: 'classic' },
      { text: 'BLM', value: 'blm' },
      { text: 'TRANS RIGHTS', value: 'trans' },
    ];
  }
}
