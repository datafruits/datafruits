import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';
import { debounce } from '@ember/runloop';
import type Label from 'datafruits13/models/label';

interface LabelsSelectArgs {
  changeset: BufferedChangeset;
}

export default class LabelsSelect extends Component<LabelsSelectArgs> {
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
  };;;;;;;;;;
}
