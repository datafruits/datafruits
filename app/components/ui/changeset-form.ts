import { action } from '@ember/object';
import Component from '@glimmer/component';
import { BufferedChangeset } from 'ember-changeset/types';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { next } from '@ember/runloop';

interface ChangesetFormArgs {
  /** Changeset Object */
  changeset: BufferedChangeset;

  /**
   * Run Changeset execute method instead of save
   * @defaultValue false
   * */
  runExecuteInsteadOfSave?: boolean;

  /**
   * Always show errors if there are any
   * @defaultValue false
   */
  alwaysShowErrors?: boolean;

  /**
   * Validate the changeset on initialization
   * @defaultValue false
   */
  validateOnInit?: boolean;

  /** Callback exeuted when from `onsubmit` event is triggered */
  onSubmit?: (data: unknown, event: Event) => void;

  /** Callback exeuted when from form submit errors */
  onError?: () => void;

  /** Callback exeuted when from `onreset` event is triggered */
  onReset?: (data: unknown, event: Event) => void;
}

export default class UiChangesetFormComponent extends Component<ChangesetFormArgs> {
  constructor(owner: unknown, args: ChangesetFormArgs) {
    super(owner, args);
    assert(
      '@changeset must be defined on <ChangesetForm> component',
      this.args.changeset
    );

    if (this.args.validateOnInit) {
      next(() => {
        this.args.changeset.validate();
      });
    }
  }


  @tracked hasSubmitted = false;

  @action
  async handleSubmit(
    changeset: BufferedChangeset,
    event: Event
  ): Promise<void> {

    event.preventDefault();
    await changeset.validate();

    this.hasSubmitted = true;

    if (changeset.isInvalid) {
      return;
    }

    let result;
    if (this.args.runExecuteInsteadOfSave) {
      result = changeset.execute();
    } else {
      try {
        result = await changeset.save({});
        if (typeof this.args.onSubmit === 'function') {
          this.args.onSubmit(result, event);
        }
      } catch (error) {
        console.log('couldnt save changeset');
        console.log(error);
        if (typeof this.args.onError === 'function') {
          this.args.onError();
        }
      }
    }
  }

  @action
  handleReset(changeset: BufferedChangeset, event: Event): void {
    event.preventDefault();
    this.hasSubmitted = false;

    const { data } = changeset.rollback();
    if (typeof this.args.onReset === 'function') {
      this.args.onReset(data, event);
    }
  }
}
