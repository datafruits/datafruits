import Component from '@glimmer/component';
import { action } from '@ember/object';
import didInsert from "@ember/render-modifiers/modifiers/did-insert";

export default class ChatLazyImage extends Component {<template><div {{didInsert this.didInsert}}>
  <img src={{@url}} loading="lazy" alt role="presentation" />
</div>
</template>
  @action
  didInsert(element) {
    let img = element.querySelector('img');
    if (img.complete) {
      this.args.adjustScrolling();
    } else {
      img.addEventListener('load', this.args.adjustScrolling);
      img.addEventListener('error', function () {
        console.log('error');
      });
    }
  }
}
