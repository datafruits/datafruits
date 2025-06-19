import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface UiModalSignature {
  Args: {
    toggleModal: any;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

export default class UiModal extends Component<UiModalSignature> {
  @tracked dragging = false;

  clickedOffsetX = 0;
  clickedOffsetY = 0;

  _element: HTMLElement | null = null;

  _mousedownListener = (event: MouseEvent) => {
    this.clickedOffsetX = event.offsetX;
    this.clickedOffsetY = event.offsetY;
    const modalTop = (this._element as HTMLElement).querySelector('.modal-top') as HTMLElement;
    if(event.target === modalTop) {
      this.dragging = true;
      (this._element as HTMLElement).classList.add('dragging');
    }
  };

  _mousemoveListener = (event: MouseEvent) => {
    if (this.dragging) {
      const modal = this._element as HTMLElement;
      modal.style.top = `${event.clientY - (this.clickedOffsetY)}px`;
      modal.style.left = `${event.clientX - this.clickedOffsetX}px`;
      modal.style.transform = 'none';
    }
  };

  _mouseupListener = () => {
      this.dragging = false;
      (this._element as HTMLElement).classList.remove('dragging');
  };

  @action
  didInsert(element: HTMLElement) {
    this._element = element;
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UiModal: typeof UiModal;
  };;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
}

