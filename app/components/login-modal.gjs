import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';
import Modal from "./ui/modal.ts";
import { on } from "@ember/modifier";
import t from "ember-intl/helpers/t";
import { Input } from "@ember/component";
import { LinkTo } from "@ember/routing";

export default class LoginModalComponent extends Component {<template><Modal @toggleModal={{@toggleModal}}>
  <div class="modal-body m-1">
    <form {{on "submit" this.submit}}>
      <p class="mt-2 mb-2">
        {{t "chat.login_why"}}
      </p>
      <div>
        <Input @type="text" name="username" @value={{this.username}} autocorrect="off" autocapitalize="none" placeholder={{t "chat.username"}} data-test-username />
        <Input @type="password" name="pass" @value={{this.pass}} autocorrect="off" autocapitalize="none" placeholder={{t "chat.password"}} data-test-password />
      </div>
      <div>
        <button type="submit" class="cool-button mt-2" data-test-login-submit disabled={{this.disableJoinButton}}>
          {{t "chat.login"}}
        </button>
      </div>

      <div class="flex items-center justify-between mt-3">
        <span {{on "click" @toggleModal}}>
          <LinkTo @route="home.password-reset">
            {{t "chat.forgot_password"}}
          </LinkTo>
        </span>
        <div class="relative">
          <span {{on "click" @toggleModal}}>
            <LinkTo @route="home.sign-up">
              {{t "chat.sign_up"}}
            </LinkTo>
          </span>
        </div>
      </div>
    </form>
  </div>
</Modal>
</template>
  @action
  submit(event) {
    event.preventDefault();
    if (this.args.login(this.username, this.pass)) {
      this.args.toggleModal();
    }
  }

}
