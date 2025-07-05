import Component from '@glimmer/component';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import FruitTicketGiftValidations from '../validations/fruit-ticket-gift';
import type FruitTicketGift from 'datafruits13/models/fruit-ticket-gift';
import type User from 'datafruits13/models/user';
import { on } from "@ember/modifier";
import Modal from "./ui/modal.ts";
import changeset from "ember-changeset/helpers/changeset";
import ChangesetForm from "./ui/changeset-form.ts";
import t from "ember-intl/helpers/t";
import Button from "@frontile/buttons/components/button";

interface GiftUserFruitTixArgs {
  toUser: User;
}

export default class GiftUserFruitTix extends Component<GiftUserFruitTixArgs> {<template><button {{on "click" this.showFruitTixModal}} class="cool-button">
  Send Gift Ƒ
</button>
{{#if this.showingModal}}
  <Modal @toggleModal={{this.showFruitTixModal}}>
    <div class="m-2">
      {{#let (changeset this.fruitTicketGift this.FruitTicketGiftValidations) as |changeset|}}
        <ChangesetForm @changeset={{changeset}} @onError={{this.onError}} @onSubmit={{this.onSubmit}} as |Form|>
          <Form.Input @label={{t "fruit-tickets.amount"}} @fieldName="amount" @type="number" @containerClass="mb-2" max={{this.currentUser.fruitTicketBalance}} />
          <Button @type="submit" @intent="primary" class="cool-button" disabled={{changeset.isInvalid}}>
            {{t "fruit-tickets.submit"}}
          </Button>
        </ChangesetForm>
      {{/let}}
    </div>
  </Modal>
{{/if}}</template>
  FruitTicketGiftValidations = FruitTicketGiftValidations;

  @tracked showingModal: boolean = false;
  @tracked fruitTicketGift: null | FruitTicketGift = null;
  @service declare store: Store;
  @service declare currentUser: any;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.fruitTicketGift = this.store.createRecord('fruit-ticket-gift', {
      toUserId: this.args.toUser.id
    });
  }

  @action
  showFruitTixModal() {
    this.showingModal = !this.showingModal;
  }

  @action
  onSubmit(result: any, event: any) {
    console.log(result);
    console.log(event);
    this.currentUser.load().then(() => {
      alert('successsssss!');
    });
  }

  @action
  onError(error: any) {
    console.log('error giving fruit tix: ', error);
    alert('couldnt give fruit tix :(!');
  }
}
