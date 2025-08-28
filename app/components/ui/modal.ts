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
  @tracked resizing = false;

  clickedOffsetX = 0;
  clickedOffsetY = 0;
  resizeDirection = '';
  
  // Store initial dimensions and position for resize operations
  initialWidth = 0;
  initialHeight = 0;
  initialX = 0;
  initialY = 0;
  initialMouseX = 0;
  initialMouseY = 0;

  _element: HTMLElement | null = null;

  _mousedownListener = (event: MouseEvent) => {
    this.clickedOffsetX = event.offsetX;
    this.clickedOffsetY = event.offsetY;
    const modalTop = (this._element as HTMLElement).querySelector('.modal-top') as HTMLElement;
    const target = event.target as HTMLElement;
    
    // Check if clicking on a resize handle
    if (target.classList.contains('resize-handle')) {
      this.resizing = true;
      this.resizeDirection = target.getAttribute('data-resize-direction') || '';
      
      // Store initial state for resize calculation
      const modal = this._element as HTMLElement;
      const rect = modal.getBoundingClientRect();
      this.initialWidth = rect.width;
      this.initialHeight = rect.height;
      this.initialX = rect.left;
      this.initialY = rect.top;
      this.initialMouseX = event.clientX;
      this.initialMouseY = event.clientY;
      
      modal.classList.add('resizing');
      event.preventDefault();
      event.stopPropagation();
    } else if(event.target === modalTop) {
      this.dragging = true;
      (this._element as HTMLElement).classList.add('dragging');
    }
  };

  _mousemoveListener = (event: MouseEvent) => {
    if (this.resizing) {
      const modal = this._element as HTMLElement;
      const deltaX = event.clientX - this.initialMouseX;
      const deltaY = event.clientY - this.initialMouseY;
      
      // Minimum sizes to prevent modal from becoming too small
      const minWidth = 300;
      const minHeight = 200;
      
      // Maximum sizes to prevent modal from becoming larger than viewport
      const maxWidth = window.innerWidth - 40;
      const maxHeight = window.innerHeight - 40;
      
      if (this.resizeDirection === 'right') {
        const newWidth = Math.max(minWidth, Math.min(maxWidth, this.initialWidth + deltaX));
        modal.style.width = `${newWidth}px`;
      } else if (this.resizeDirection === 'bottom') {
        const newHeight = Math.max(minHeight, Math.min(maxHeight, this.initialHeight + deltaY));
        modal.style.height = `${newHeight}px`;
      } else if (this.resizeDirection === 'bottom-right') {
        const newWidth = Math.max(minWidth, Math.min(maxWidth, this.initialWidth + deltaX));
        const newHeight = Math.max(minHeight, Math.min(maxHeight, this.initialHeight + deltaY));
        modal.style.width = `${newWidth}px`;
        modal.style.height = `${newHeight}px`;
      }
      
      // Update modal body max constraints to allow content to fit
      const modalBody = modal.querySelector('.modal-body') as HTMLElement;
      if (modalBody) {
        modalBody.style.maxWidth = 'none';
        modalBody.style.maxHeight = 'none';
      }
    } else if (this.dragging) {
      const modal = this._element as HTMLElement;
      modal.style.top = `${event.clientY - (this.clickedOffsetY)}px`;
      modal.style.left = `${event.clientX - this.clickedOffsetX}px`;
      modal.style.transform = 'none';
    }
  };

  _mouseupListener = () => {
    if (this.resizing) {
      this.resizing = false;
      this.resizeDirection = '';
      (this._element as HTMLElement).classList.remove('resizing');
    }
    if (this.dragging) {
      this.dragging = false;
      (this._element as HTMLElement).classList.remove('dragging');
    }
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
  }
}

