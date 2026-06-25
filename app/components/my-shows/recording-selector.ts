import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { BufferedChangeset } from 'ember-changeset/types';

interface TrackOption {
  option: 'prerecorded' |  'upload';
  trackId: string | null;
  trackFilename: string | null;
  recordingId: string | null;
}

interface RecordingSelectorArgs {
  changeset: BufferedChangeset;
  trackOption: TrackOption;
}

export default class RecordingSelectorComponent extends Component<RecordingSelectorArgs> {
  @tracked selectedOption: 'prerecorded' | 'upload' = 'prerecorded';

  @action
  selectOption(option: 'prerecorded' | 'upload'): void {
    this.selectedOption = option;
    this.args.trackOption.option = option;

    if (option === 'upload') {
      this.args.changeset.set('usePrerecordedFileForArchive', true);
    } else if (option === 'prerecorded') {
      this.args.changeset.set('usePrerecordedFileForArchive', false);
    }
  }
}
