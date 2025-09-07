import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { BufferedChangeset } from 'ember-changeset/types';

interface RecordingSelectorArgs {
  changeset: BufferedChangeset;
}

export default class RecordingSelectorComponent extends Component<RecordingSelectorArgs> {
  @tracked selectedOption: 'prerecorded' | 'upload' = 'prerecorded';

  constructor(owner: unknown, args: RecordingSelectorArgs) {
    super(owner, args);
    this.initializeSelectedOption();
  }

  @action
  selectOption(option: 'prerecorded' | 'upload'): void {
    this.selectedOption = option;

    if (option === 'upload') {
      this.args.changeset.set('prerecordTrackId', null);
      this.args.changeset.set('usePrerecordedFileForArchive', false);
    } else if (option === 'prerecorded') {
      this.args.changeset.set('prerecordTrackFile', null);
      this.args.changeset.set('prerecordTrackFilename', null);
    }
  }

  private initializeSelectedOption(): void {
    const { changeset } = this.args;
    if (
      changeset.get('prerecordTrackId') ||
      changeset.get('usePrerecordedFileForArchive')
    ) {
      this.selectedOption = 'prerecorded';
    } else {
      this.selectedOption = 'upload';
    }
  }
}
