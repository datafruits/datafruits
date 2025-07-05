import Component from '@glimmer/component';
import ShrimpoValidations from '../../validations/shrimpo';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import type Shrimpo from 'datafruits13/models/shrimpo';
import { BufferedChangeset } from 'ember-changeset/types';
import ENV from 'datafruits13/config/environment';
import t from "ember-intl/helpers/t";
import changeset from "ember-changeset/helpers/changeset";
import ChangesetForm from "../ui/changeset-form.gts";
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";
import eq from "ember-truth-helpers/helpers/equal";
import EmojiSelect from "../emoji-select.gts";
import formatDay from "../../helpers/format-day.js";
import TimePicker from "../time-picker.gts";
import Button from "@frontile/buttons/components/button";
import or from "ember-truth-helpers/helpers/or";

interface JsonApiError {
  detail: string;
  status?: string;
  title?: string;
  source?: {
    pointer?: string;
  };
}

interface ShrimpoFormArgs {
  model: Shrimpo;
}

export default class ShrimpoForm extends Component<ShrimpoFormArgs> {<template><h1 class="text-2xl">
  <img class="inline" src="/assets/images/emojis/sshrimp.png" />
    {{t "shrimpo.form.beginning"}}
  <img class="inline" src="/assets/images/emojis/sshrimp_clear.png" />
</h1>
<h2>
  <span class="shrimpo-marquee">
    many fruits will shrimp...only one will win! will you challenge the fruit-iverse of shrimp?! Dive into the fruit-iverse of SHRIMPO, where a symphony of flavors awaits your creative palate! Many fruits will shrimp, but only one will reign supreme in this electrifying musical showdown. Are you ready to peel back the layers of sound and embrace the challenge? Let the rhythm of the fruit-iverse guide your composition as you embark on this thrilling musical journey! Yo, 안녕하세요, mi bredren! SHRIMPO의 과일 세계로 들어가보세요. 여기서는 많은 과일이 새하얗게 살짝 삶을 겁니다. 그러나 이곳에선 오직 하나만이 최고로 빛날 것입니다. こんにちは、友よ！ この刺激的な音楽の対決に挑戦する準備はできていますか? Let the rhythm of the fruit-iverse guide yuh composition as yuh embark pon dis thrillin' musical journey, seen?音のレイヤーを一つずつ剥がし、挑戦を受け入れてください.果物の世界のリズムがあなたの作品を導いてくれるでしょう.
  </span>
</h2>
{{#let (changeset @model this.ShrimpoValidations) as |changeset|}}
  {{#each this.errors as |error|}}
    <div class="error">{{error}}</div>
  {{/each}}
  <ChangesetForm class="mb-2" @changeset={{changeset}} @onError={{this.onError}} @onSubmit={{this.onSubmit}} as |Form|>
    <Form.Input @label={{t "shrimpo.form.title"}} @fieldName="title" @containerClass="mb-2" />
    <label class="align-top" for="shrimpo-cover-art"> {{t "shrimpo.form.cover_art"}}</label>
    <br />
    <input class="py-4 px-4 my-2 text-df-yellow w-full semibold border-dashed" id="shrimpo-cover-art" name="shrimpo-cover-art" type="file" {{on "change" (fn this.updateCoverArt changeset)}} />
    {{this.coverArtUploadProgress}}
    <Form.Textarea @label={{t "shrimpo.form.rulepack"}} @fieldName="rulePack" @containerClass="mb-2" @size="lg" placeholder={{t "shrimpo.form.rulepack_placeholder"}} rows="10" cols="50" />
    <div class="mb-2">
      <label for="shrimpo-type">{{t "shrimpo.form.shrimpo_type"}}</label>
      <select id="shrimpo-type" {{on "change" (fn this.setShrimpoType changeset)}}>
          {{#each this.shrimpoTypes as |shrimpoType|}}
            <option value="{{shrimpoType}}" selected={{(eq changeset.shrimpoType shrimpoType)}}>{{shrimpoType}}</option>
          {{/each}}
      </select>
    </div>
    {{#if (eq changeset.shrimpoType "normal")}}
      <EmojiSelect @changeset={{changeset}} />
    {{else}}
    {{/if}}
    <div class="mb-2">
      <label class="block text-sm font-bold mb-2" for="body">{{t "shrimpo.form.start_at"}}</label>
      <input class="mr-2" type="date" id="start-date" min={{this.currentDate}} value={{formatDay changeset.startAt}} />
      <TimePicker @property="startAt" @changeset={{changeset}} />
    </div>

    <div class="mb-2 {{if this.notEnoughBalance "shake"}}">
      <h3>FRUIT TICKET DEPOSIT REQUIRED: Ƒ{{this.depositAmount}}</h3>
      {{#if this.notEnoughBalance}}
        <span>{{t "shrimpo.form.not_enough_balance"}}</span>
      {{/if}}
    </div>
    <div>
      <select id="length" {{on "change" (fn this.setLength changeset)}}>
        {{#each this.lengths as |length|}}
          <option value="{{length}}" selected={{(eq changeset.duration length)}}>{{length}}</option>
        {{/each}}
      </select>
    </div>

    <div>
      <label>
        {{t "shrimpo.form.zip_file"}}
        <input type="file" {{on "change" (fn this.uploadZip changeset)}}>
      </label>
      {{this.uploadProgress}}
    </div>

    <Button @type="submit" @intent="primary" class="cool-button" disabled={{or (Form.state.hasSubmitted changeset.isInvalid) (this.notEnoughBalance)}}>
      {{t "shrimpo.form.submit"}}
    </Button>
    {{#if Form.state.hasSubmitted}}
      <marquee>{{t "forms.saving"}}</marquee>
    {{/if}}
  </ChangesetForm>
{{/let}}</template>
  ShrimpoValidations = ShrimpoValidations;

  @tracked errors: string[] = [];

  @service currentUser: any;

  lengths = [
    '1 hour',
    '2 hours',
    '4 hours',
    '1 day',
    '2 days',
    '1 week',
    '1 month',
    '3 months',
  ];

  shrimpoTypes = [
    'normal',
    'mega'
  ];

  @service declare router: RouterService;
  @service declare activeStorage: any;

  @tracked uploadProgress = 0;

  @tracked coverArtUploadProgress = 0;

  @tracked duration = '1 hour';

  _depostAmount() {
    switch(this.duration) {
      case '1 hour':
        return 500;
      case '2 hours':
        return 750;
      case '4 hours':
        return 1000;
      case '1 day':
        return 1500;
      case '2 days':
        return 1750;
      case '1 week':
        return 2000;
      case '1 month':
        return 5000;
      case '3 months':
        return 7500;
      default:
        return 100;
    }
  }

  get depositAmount() {
    return this._depostAmount();
  }

  get notEnoughBalance() {
    return this.currentUser.user.fruitTicketBalance < this._depostAmount();
  }

  @action
  setLength(changeset: BufferedChangeset, event: any){
    console.log('setting duration: ', event.target.value);
    changeset.set('duration', event.target.value);
    this.duration = event.target.value;
  }

  @action
  setShrimpoType(changeset: BufferedChangeset, event: any){
    console.log('setting duration: ', event.target.value);
    changeset.set('shrimpoType', event.target.value);
    //this.duration = event.target.value;
  }

  @action
  onSubmit(data: any, event: Event) {
    console.log('on shrimpo form submit');
    console.log(data);
    console.log(event);
    this.router.transitionTo('home.shrimpos.show', data.slug);
  }

  @action
  onError(errors: JsonApiError[]) {
    this.errors = errors.map(error => error.detail);
    console.log('onError: ', errors);
    alert("Couldn't save shrimpo...check the form for errors.");
  }

  @action updateCoverArt(changeset: BufferedChangeset, event: Event){
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files) {
      const directUploadURL = `${ENV.API_HOST}/rails/active_storage/direct_uploads`;

      for (let i = 0; i < files.length; i++) {
        this.activeStorage
        .upload(files.item(i), directUploadURL, {
          onProgress: (progress: any) => {
            this.coverArtUploadProgress= progress;
          },
        })
        .then((blob: any) => {
          const signedId = blob.signedId;

          changeset.set('coverArt', signedId);
        });
      }
    }
  }


  @action
  uploadZip(changeset: BufferedChangeset, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files) {
      const directUploadURL = `${ENV.API_HOST}/rails/active_storage/direct_uploads`;

      for (let i = 0; i < files.length; i++) {
        this.activeStorage
        .upload(files.item(i), directUploadURL, {
          onProgress: (progress: any) => {
            this.uploadProgress = progress;
          },
        })
        .then((blob: any) => {
          const signedId = blob.signedId;

          changeset.set('zip', signedId);
        });
      }
    }
  }
}
