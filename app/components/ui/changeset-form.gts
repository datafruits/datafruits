import { action } from '@ember/object';
import Component from '@glimmer/component';
import { BufferedChangeset } from 'ember-changeset/types';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { next } from '@ember/runloop';
import { on } from "@ember/modifier";
import { fn, hash } from "@ember/helper";
import ChangesetFormFieldsInput from "@frontile/changeset-form/components/changeset-form/fields/input";
import ChangesetFormFieldsTextarea from "@frontile/changeset-form/components/changeset-form/fields/textarea";
import ChangesetFormFieldsSelect from "@frontile/changeset-form/components/changeset-form/fields/select";
import ChangesetFormFieldsCheckbox from "@frontile/changeset-form/components/changeset-form/fields/checkbox";
import ChangesetFormFieldsCheckboxGroup from "@frontile/changeset-form/components/changeset-form/fields/checkbox-group";
import ChangesetFormFieldsRadio from "@frontile/changeset-form/components/changeset-form/fields/radio";
import ChangesetFormFieldsRadioGroup from "@frontile/changeset-form/components/changeset-form/fields/radio-group";

interface UiChangesetFormSignature {
  Args: {
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
    onError?: (error: any) => void;
    /** Callback exeuted when from `onreset` event is triggered */
    onReset?: (data: unknown, event: Event) => void;
  };
  Blocks: {
    default: [unknown];
  };
  Element: HTMLFormElement;
}

export default class UiChangesetFormComponent extends Component<UiChangesetFormSignature> {<template><form ...attributes {{on "submit" (fn this.handleSubmit @changeset)}} {{on "reset" (fn this.handleReset @changeset)}}>

  {{yield (hash Input=(component ChangesetFormFieldsInput changeset=@changeset hasSubmitted=this.hasSubmitted showError=@alwaysShowErrors) Textarea=(component ChangesetFormFieldsTextarea changeset=@changeset hasSubmitted=this.hasSubmitted showError=@alwaysShowErrors) Select=(component ChangesetFormFieldsSelect changeset=@changeset hasSubmitted=this.hasSubmitted showError=@alwaysShowErrors) Checkbox=(component ChangesetFormFieldsCheckbox changeset=@changeset hasSubmitted=this.hasSubmitted showError=@alwaysShowErrors) CheckboxGroup=(component ChangesetFormFieldsCheckboxGroup changeset=@changeset hasSubmitted=this.hasSubmitted showError=@alwaysShowErrors) Radio=(component ChangesetFormFieldsRadio changeset=@changeset hasSubmitted=this.hasSubmitted showError=@alwaysShowErrors) RadioGroup=(component ChangesetFormFieldsRadioGroup changeset=@changeset hasSubmitted=this.hasSubmitted showError=@alwaysShowErrors) state=(hash hasSubmitted=this.hasSubmitted))}}

</form>
</template>
  constructor(owner: unknown, args: UiChangesetFormSignature['Args']) {
    super(owner, args);
    assert(
      '@changeset must be defined on <ChangesetForm> component',
      this.args.changeset
    );

    if (this.args.validateOnInit) {
      next(() => {
        this.args.changeset.validate().catch((e) => {
          console.log("couldn't validate changeset: ", e);
        });
      });
    }
  }


  @tracked hasSubmitted = false;

  @action
  async handleSubmit(
    changeset: BufferedChangeset,
    event: Event
  ): Promise<void> {
    console.log("form handle submit");

    event.preventDefault();
    await changeset.validate();

    this.hasSubmitted = true;

    if (changeset.isInvalid) {
      console.log('changeset invalid: ', changeset.errors);
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
          this.hasSubmitted = false;
          this.args.onError(error.errors);
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Ui::ChangesetForm': typeof UiChangesetFormComponent;
  }
}
