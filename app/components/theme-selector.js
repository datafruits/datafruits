import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ThemeSelector extends Component {
  @tracked currentTheme;
  constructor(owner, args) {
    super(owner, args);

    this.currentTheme = localStorage.getItem('datafruits-theme') || 'classic';
  }

  themes = [
    { text: 'its just a website', value: 'classic' },
    { text: 'BLM', value: 'blm' },
    { text: 'TRANS RIGHTS', value: 'trans' },
  ];
}
