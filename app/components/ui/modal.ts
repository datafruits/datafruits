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

  _mousedownListener = (event: MouseEvent) => {
    this.clickedOffsetX = event.offsetX;
    this.clickedOffsetY = event.offsetY;
    const modalTop = this.element.querySelector('.modal-top') as HTMLElement;
    if(event.target === modalTop) {
      this.dragging = true;
      this.element.classList.add('dragging');
    }
  };

  _mousemoveListener = (event: MouseEvent) => {
    if (this.dragging) {
      const modal = this.element as HTMLElement;
      modal.style.top = `${event.clientY - (this.clickedOffsetY)}px`;
      modal.style.left = `${event.clientX - this.clickedOffsetX}px`;
    }
  };

  _mouseupListener = (_event: MouseEvent) => {
      this.dragging = false;
      this.element.classList.remove('dragging');
  };

  @action
  didInsert(element: HTMLElement) {
    element.addEventListener('mousedown', this._mousedownListener);
    document.addEventListener('mouseup', this._mouseupListener);
    document.addEventListener('mousemove', this._mousemoveListener);
  }

  @action
  removeListeners() {
    window.removeEventListener('mousemove', this._mousemoveListener);
    window.removeEventListener('mouseup', this._mouseupListener);
    window.removeEventListener('mousedown', this._mousedownListener);
  }

  get destinationElement(): HTMLElement {
    return document.getElementById("modals-container") as HTMLElement;
  }
}
