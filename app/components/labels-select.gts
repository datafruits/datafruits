import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';
import { debounce } from '@ember/runloop';
import type Label from 'datafruits13/models/label';
import PowerSelectMultipleWithCreate from "ember-power-select-with-create/components/power-select-multiple-with-create";

interface LabelsSelectArgs {
  changeset: BufferedChangeset;
}

export default class LabelsSelect extends Component<LabelsSelectArgs> {<template><section ...attributes>
  <h4 class="block text-sm font-bold mb-2">Tags</h4>
  {{#if this.error}}
    <div class="error">
        {{this.error}}
    </div>
  {{/if}}
  <PowerSelectMultipleWithCreate @options={{this.labels}} @selected={{@changeset.labels}} @searchEnabled={{true}} @search={{this.searchLabels}} @renderInPlace={{true}} @onChange={{this.setSelectedLabels}} @onCreate={{this.createTag}} @showCreateWhen={{this.hideCreateOptionOnSameName}} as |label|>
    {{label.name}}
  </PowerSelectMultipleWithCreate>
</section></template>
  @service declare store: any;

  @tracked error: string = "";
  @tracked labels: Label[] = [];

  @action
  hideCreateOptionOnSameName(term: string) {
    const existingOption = this.labels.findBy('name', term);
    return !existingOption;
  }

  @action
  setSelectedLabels(labels: Label[]) {
    this.args.changeset.set('labels', labels);
    const labelIds = labels.map((label) => {
      return label.get('id');
    });
    this.args.changeset.set('labelIds', labelIds);
  }

  @action
  createTag(name: string) {
    const store = this.store;
    const label = store.createRecord('label', { name: name });
    const onSuccess = (label: Label) => {
      console.log('label saved!');
      this.args.changeset.get('labels').push(label);
      this.args.changeset.get('labelIds').push(label.get('id'));
    };
    const onFail = (response: any) => {
      this.error = 'Failed to save tag: ' + response.errors[0].detail;
      //this.flashMessages.danger('Sorry, something went wrong!');
      console.log('label save failed');
    };
    label.save().then(onSuccess, onFail);
  }

  @action
  searchLabels(term: string) {
    return new Promise((resolve, reject) => {
      debounce(this, this._performLabelsSearch.bind(this), term, resolve, reject, 600);
    });
  }

  _performLabelsSearch(term: string, resolve: any, reject: any) {
    this.store.query('label', { term: term }).then((labels: Label[]) => {
      this.labels = labels;
      return resolve(labels);
    }, reject);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LabelsSelect: typeof LabelsSelect;
  }
}
