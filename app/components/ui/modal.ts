import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface UiModalArgs {
  toggleModal: any;
}

export default class UiModal extends Component<UiModalArgs> {
  @tracked dragging = false;

  clickedOffsetX = 0;
  clickedOffsetY = 0;

  @action
  didInsert(element: HTMLElement) {
    element.addEventListener('mousedown', (event) => {
      this.clickedOffsetX = event.offsetX;
      this.clickedOffsetY = event.offsetY;
      const modalTop = element.querySelector('.modal-top') as HTMLElement;
      console.log('event.target', event.target);
      console.log(modalTop);
      if(event.target === modalTop) {
        console.log('set dragging true', event.target);
        this.dragging = true;
        element.classList.add('dragging');
      }
    });
    document.addEventListener('mouseup', () => {
      console.log('mouseUp');
      this.dragging = false;
      element.classList.remove('dragging');
    });
    document.addEventListener('mousemove', (event: any) => {
      if (this.dragging) {
        console.log('setting x and y', event);
        const modal = element as HTMLElement;
        modal.style.top = `${event.clientY - this.clickedOffsetY}px`;
        modal.style.left = `${event.clientX - this.clickedOffsetX}px`;
        modal.style.transform = 'none';
      }
    });
  }

  @action
  removeListeners() {
  }
}
