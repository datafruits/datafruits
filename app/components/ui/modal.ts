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
      if(event.target === modalTop) {
        this.dragging = true;
        element.classList.add('dragging');
      }
    });
    document.addEventListener('mouseup', () => {
      this.dragging = false;
      element.classList.remove('dragging');
    });
    document.addEventListener('mousemove', (event: any) => {
      if (this.dragging) {
        const modal = element as HTMLElement;
        modal.style.top = `${event.clientY - (this.clickedOffsetY)}px`;
        modal.style.left = `${event.clientX - this.clickedOffsetX}px`;
      }
    });
  }

  @action
  removeListeners() {
    //window.removeEventListener('mousemove');
    //window.removeEventListener('mouseup');
    //window.removeEventListener('mousedown');
  }

  get destinationElement(): HTMLElement {
    return document.getElementById("modals-container") as HTMLElement;
  }
}
