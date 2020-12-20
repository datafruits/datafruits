import Component from '@glimmer/component';

export default class ThemeSelector extends Component {
  themes = [
    { text: 'its just a website', value: 'classic' },
    { text: 'BLM', value: 'blm' },
    { text: 'TRANS RIGHTS', value: 'trans' },
  ];
}
