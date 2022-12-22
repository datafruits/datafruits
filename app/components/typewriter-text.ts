import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface TypewriterTextArgs {
  text: string;
}

export default class TypewriterText extends Component<TypewriterTextArgs> {
  @tracked displayedText: string = '';

  @tracked index: number = 0;

  @action
  didInsert() {
    const updateText = () => {
      if(this.index < this.args.text.length) {
        this.displayedText = this.displayedText.concat(this.args.text[this.index]);
        this.index = this.index + 1;
        console.log('index: ', this.index);
        console.log('displayedText: ', this.displayedText);
        setTimeout(() => {
          updateText();
        }, 30);
      }
    };

    updateText();
  }
}
