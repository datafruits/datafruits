import Component from '@glimmer/component';
import ShrimpoEntryValidations from '../../validations/shrimpo-entry';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import type Shrimpo from 'datafruits13/models/shrimpo';
import ENV from 'datafruits13/config/environment';
import changeset from "ember-changeset/helpers/changeset";
import ChangesetForm from "../ui/changeset-form.gts";
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";
import Button from "@frontile/buttons/components/button";
import or from "ember-truth-helpers/helpers/or";

interface ShrimpoEntryUploaderArgs {
  shrimpo: Shrimpo;
}

export default class ShrimpoEntryUploader extends Component<ShrimpoEntryUploaderArgs> {<template>{{#if this.canSubmitEntry}}
  {{#let (changeset this.entry this.ShrimpoEntryValidations) as |changeset|}}
    <ChangesetForm @changeset={{changeset}} @onError={{this.onError}} @onSubmit={{this.onSubmit}} as |Form|>
      <Form.Input @label={{t "shrimpo.form.title"}} @fieldName="title" @containerClass="mb-2" />
      <div>
        <label>
          Upload file plz (mp3 only)
          <input type="file" {{on "change" (fn this.uploadEntry changeset)}}>
        </label>
        {{this.uploadProgress}}
      </div>
      <Button @type="submit" @intent="primary" class="cool-button" disabled={{or (or Form.state.hasSubmitted changeset.isInvalid) this.isUploading}}>
        {{t "shrimpo.form.submit"}}
      </Button>
      {{#if Form.state.hasSubmitted}}
        <marquee>SAVING....DON'T TURN OFF THE POWER.........</marquee>
      {{/if}}
    </ChangesetForm>
  {{/let}}
{{else}}
  <h1>YOu've submitted your shrimpo entry!!!!</h1>
{{/if}}</template>
  ShrimpoEntryValidations = ShrimpoEntryValidations;

  @service declare activeStorage: any;
  @service declare store: any;
  @service declare currentUser: any;

  @tracked uploadProgress = 0;

  @tracked isUploading = false;

  @tracked entry: ShrimpoEntry;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    const myEntry = this.args.shrimpo.get('shrimpoEntries').filter((e: ShrimpoEntry) => {
      return e.username === this.currentUser.user.username;
    });
    if(myEntry.length && !this.args.shrimpo.multiSubmitAllowed) {
      this.entry = myEntry[0];
    } else {
      this.entry = this.store.createRecord('shrimpo-entry', {
        shrimpo: this.args.shrimpo
      });
    }
  }

  get canSubmitEntry() {
    return this.args.shrimpo.multiSubmitAllowed || this.entry.isNew;
  }

  @action
  onSubmit(data: any, event: Event) {
    console.log(data);
    console.log(event);
    alert('shrimpoed successfully...');
    //this.router.transitionTo('home.shrimpo.show', data.slug);
  }

  @action
  onError() {
    alert("Couldn't save shrimpo entry...check the form for errors.");
  }

  @action
  uploadEntry(changeset: BufferedChangeset, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files) {
      const directUploadURL = `${ENV.API_HOST}/rails/active_storage/direct_uploads`;

      for (let i = 0; i < files.length; i++) {
        this.isUploading = true;
        const validMimeTypes = ['audio/mp3', 'audio/mpeg'];
        if(!validMimeTypes.includes(files.item(i)?.type as string)) {
          alert('Only mp3 is supported! sorry...');
          return;
        }

        this.activeStorage
        .upload(files.item(i), directUploadURL, {
          onProgress: (progress: any) => {
            this.uploadProgress = progress;
          },
        })
        .then((blob: any) => {
          const signedId = blob.signedId;

          changeset.set('audio', signedId);
          this.isUploading = false;
        });
      }
    }
  }

}
