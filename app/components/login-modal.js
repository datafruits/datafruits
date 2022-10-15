import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LoginModalComponent extends Component {
  @tracked dragging = false;

  @action
  submit(event) {
    event.preventDefault();
    if (this.args.login(this.username, this.pass)) {
      this.args.toggleModal();
    }
  }

  @action
  didInsert() {
    console.log('adding event listeners');
    document.addEventListener('mousedown', (event) => {
      console.log('mousedown');
      let modalTop = document.getElementById('login-modal-top');
      if(event.target === modalTop) {
        console.log('set dragging true', event.target);
        this.dragging = true;
        let loginModal = document.getElementById('login-modal');
        if(loginModal) {
          loginModal.classList.add('dragging');
        }
      }
    });
    document.addEventListener('mouseup', (event) => {
      console.log('mouseUp');
      this.dragging = false;
      let loginModal = document.getElementById('login-modal');
      loginModal.classList.remove('dragging');
    });
    document.addEventListener('mousemove', (event) => {
      if (this.dragging) {
        console.log('setting x and y');
        let loginModal = document.getElementById('login-modal');
        loginModal.style.top = `${event.clientY}px`;
        loginModal.style.left = `${event.clientX}px`;
      }
    });
  }
}
