import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';
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
    let existingOption = this.labels.findBy('name', term);
    return !existingOption;
  }

  @action
  setSelectedLabels(labels: Label[]) {
    this.args.changeset.set('labels', labels);
    let labelIds = labels.map((label) => {
      return label.get('id');
    });
    this.args.changeset.set('labelIds', labelIds);
  }

  @action
  createTag(name: string) {
    let store = this.store;
    let label = store.createRecord('label', { name: name });
    let onSuccess = (label: Label) => {
      console.log('label saved!');
      this.args.changeset.get('labels').pushObject(label);
      this.args.changeset.get('labelIds').pushObject(label.get('id'));
    };
    let onFail = (response: any) => {
      this.error = 'Failed to save tag: ' + response.errors[0].detail;
      //this.flashMessages.danger('Sorry, something went wrong!');
      console.log('label save failed');
    };
    label.save().then(onSuccess, onFail);
  }

  @action
  searchLabels(term: string) {
    this.store.query('label', { term: term }).then((labels: Label[]) => {
      this.labels = labels;
    });
  }
}
