import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface UiModalArgs {}

export default class UiModal extends Component<UiModalArgs> {
  @tracked dragging = false;

  clickedOffsetX = 0;
  clickedOffsetY = 0;

  @action
  didInsert() {
    console.log('adding event listeners');
    document.addEventListener('mousedown', (event) => {
      console.log('mousedown', event);
      this.clickedOffsetX = event.offsetX;
      this.clickedOffsetY = event.offsetY;
      let modalTop = document.getElementById('login-modal-top'); // HOW TO GET UNIQUE ID?!!!
      if(event.target === modalTop) {
        console.log('set dragging true', event.target);
        this.dragging = true;
        let modal = document.getElementById('login-modal');
        if(modal) {
          modal.classList.add('dragging');
        }
      }
    });
    document.addEventListener('mouseup', (event) => {
      console.log('mouseUp');
      this.dragging = false;
      let modal = document.getElementById('login-modal') as HTMLElement;
      modal.classList.remove('dragging');
    });
    document.addEventListener('mousemove', (event) => {
      if (this.dragging) {
        console.log('setting x and y', event);
        let modal = document.getElementById('login-modal');
        modal.style.top = `${event.clientY - this.clickedOffsetY}px`;
        modal.style.left = `${event.clientX - this.clickedOffsetX}px`;
        modal.style.transform = 'none';
      }
    });
  }

  @action
  removeListeners() {
    // TODO remove event listeners
  }
}
