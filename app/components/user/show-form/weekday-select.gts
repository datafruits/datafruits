import Component from '@glimmer/component';
import { BufferedChangeset } from 'ember-changeset/types';
import { on } from "@ember/modifier";
import pick from "ember-composable-helpers/helpers/pick";
import set from "ember-set-helper/helpers/set";
import eq from "ember-truth-helpers/helpers/equal";

interface UserShowFormWeekdaySelectArgs {
  changeset: BufferedChangeset;
}

export default class UserShowFormWeekdaySelect extends Component<UserShowFormWeekdaySelectArgs> {<template><select id="weekly-interval" {{on "change" (pick "target.value" (set @changeset "recurringWeekday"))}}>
  {{#each-in this.weekdays as |key val|}}
    <option value="{{val}}" selected={{eq @changeset.recurringWeekday val}}>
      {{key}}
    </option>
  {{/each-in}}
</select></template>
  // TODO i18n
  weekdays = {
    'Sunday': 'Sunday',
    'Monday': 'Monday',
    'Tuesday': 'Tuesday',
    'Wednesday': 'Wednesday',
    'Thursday': 'Thursday',
    'Friday': 'Friday',
    'Saturday': 'Saturday'
  };
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'User::ShowForm::WeekdaySelect': typeof UserShowFormWeekdaySelect;
  }
}
