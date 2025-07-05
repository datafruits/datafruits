import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type Fruit from '../../fruit';
import CurrentUserService from 'datafruits13/services/current-user';
import ChatService from 'datafruits13/services/chat';
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";
import gt from "ember-truth-helpers/helpers/gt";
import lockedFruitImagePath from "../../helpers/locked-fruit-image-path.ts";

interface FruitTipFruitSignature {
  Args: {
    fruit: Fruit;
    fruitTip: any;
  };
}

export default class FruitTipFruitComponent extends Component<FruitTipFruitSignature> {<template><button {{on "click" (fn @fruitTip @fruit)}} class="cool-button fruit-tip-button tip mr-1 ml-1 mt-1 text-xl font-black" type="button" disabled={{this.disabled}}>
  {{#if (gt @fruit.levelReq 0)}}
    <span class="s">Lv. {{@fruit.levelReq}}</span>
  {{/if}}
  {{#if @fruit.cost}}
    <span class="xs">Ƒ</span><span>{{@fruit.cost}}</span>
  {{/if}}
  {{#if this.session.isAuthenticated}}
    {{#if (gt @fruit.levelReq this.currentUser.user.level)}}
      <img src={{lockedFruitImagePath @fruit.levelReq}} />
    {{else}}
      <img src={{@fruit.image}} alt={{@fruit.name}} />
    {{/if}}
  {{else}}
    {{#if (gt @fruit.levelReq 0)}}
      <img src={{lockedFruitImagePath @fruit.levelReq}} />
    {{else}}
      <img src={{@fruit.image}} alt={{@fruit.name}} />
    {{/if}}
  {{/if}}

  <h1 class="text-xl">{{this.count}}</h1>
</button></template>
  @service declare chat: ChatService;
  @service declare currentUser: CurrentUserService;
  @service declare session: any;

  get count() {
    return this.chat.getFruitCount(this.args.fruit.name);
  }

  get disabled() {
    if(this.session.isAuthenticated) {
      return (this.currentUser.user?.level < this.args.fruit.levelReq) ||
        (this.currentUser.user?.fruitTicketBalance < this.args.fruit.cost);
    } else {
      return this.args.fruit.levelReq || this.args.fruit.cost;
    }
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'FruitTip::Fruit': typeof FruitTipFruitComponent;
  }
}

