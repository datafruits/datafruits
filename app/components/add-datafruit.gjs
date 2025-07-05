import Component from '@glimmer/component';
import { Await } from '@warp-drive/ember';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { later } from '@ember/runloop';
import ENV from 'datafruits13/config/environment';
import Await0 from "./await.js";
import t from "ember-intl/helpers/t";
import { LinkTo } from "@ember/routing";
import { on } from "@ember/modifier";
import { Input } from "@ember/component";

export default class AddDatafruit extends Component {<template><Await0 @promise={{this.loadDatafruits}}>
  <:pending>
    {{t "microtext.loading"}}
  </:pending>

  <:success as |datafruits|>
    {{#if this.showingDatafruits}}
      <marquee id="add-datafruit-bar" class="text-sm sm:text-xl">
        [<img style="height: 20px; display: inline;" src="{{this.currentDatafruit.avatarUrlOrDefault}}" alt={{this.currentDatafruit.username}}>
        <LinkTo @model={{this.currentDatafruit.username}} @route="home.dj">
          {{this.currentDatafruit.username}}
        </LinkTo>]
        :
        <span>
          {{this.currentDatafruit.content}}
        </span>
        <span class="italic text-xs sm:text-sm">
          {{this.currentTimestamp}}
        </span>
      </marquee>
      {{#if this.session.isAuthenticated}}
        <button {{on "click" this.addDatafruit}} type="button" class="cool-button">{{t "microtext.add"}}</button>
      {{/if}}
    {{else}}
      <div>
        {{t "microtext.we_need_it"}}
      </div>
      <form {{on "submit" this.submit}}>
        <Input @value={{this.datafruit.content}} placeholder="your datafruit" />
        <input type="submit" value="{{t "microtext.submit"}}" class="cool-button" disabled={{this.isSubmittable}}>
      </form>
    {{/if}}
  </:success>

  <:error>
    Something went wrong :(
  </:error>
</Await0></template>
  @service
  store;

  @service
  session;

  @tracked
  showingDatafruits = true;

  @tracked
  datafruit = null;

  get currentTimestamp() {
    if (this.currentDatafruit) {
      return `(${new Date(
        this.currentDatafruit.createdAt
      ).toLocaleDateString()})`;
    } else {
      return 'Unable to find timestamp';
    }
  }

  get isSubmittable() {
    let datafruit = this.datafruit;
    return !(!isEmpty(datafruit.content) && !datafruit.isSaving);
  }

  // current datafruits loaded from the server
  @tracked
  datafruits;

  // currentDatafruit on display in the <marquee>
  @tracked
  currentDatafruit;

  currentDatafruitIndex = 0;

  incrementDatafruitIndex() {
    this.currentDatafruitIndex += 1;
    if (this.currentDatafruitIndex > this.datafruits.length - 1) {
      this.currentDatafruitIndex = 0;
      // TODO do we really need to load more ??
      // this.actions.loadDatafruits.apply(this);
    }
    this.currentDatafruit = this.datafruits[this.currentDatafruitIndex];
    if (ENV.environment === 'test') return;
    later(() => {
      this.incrementDatafruitIndex();
    }, 20000);
  }

  setDatafruits(data) {
    this.datafruits = data;
    this.currentDatafruit = this.datafruits[this.currentDatafruitIndex];
    // increment the currentDatafruit index in 5 sec
    if (ENV.environment === 'test') return;
    later(() => {
      this.incrementDatafruitIndex();
    }, 20000);
  }

  get loadDatafruits() {
    return this.store
      .findAll('microtext', { backgroundReload: false })
      .then((data) => {
        this.setDatafruits(data);
        return data;
      });
  }

  @action
  addDatafruit() {
    this.showingDatafruits = false;
    this.datafruit = this.store.createRecord('microtext');
  }

  @action
  submit(e) {
    e.preventDefault();
    this.datafruit
      .save()
      .then(() => {
        this.showingDatafruits = true;
        this.datafruit = null;
      })
      .catch(() => {
        // couldn't save
      });
  }
}
