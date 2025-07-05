import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
import eq from "ember-truth-helpers/helpers/equal";

export default class ThemeSelector extends Component {<template><label id="theme-selector-label" for="theme-selector">
  {{t "theme.label"}}
</label>
<select name="theme-selector" id="theme-selector" class="bg-df-pink" {{on "change" @setTheme}}>
>
{{#each this.themes as |theme|}}
  {{#if (eq theme.value this.currentTheme)}}
    <option selected value={{theme.value}}>
      {{theme.text}}
    </option>
  {{else}}
    <option value={{theme.value}}>
      {{theme.text}}
    </option>
  {{/if}}
{{/each}}
</select></template>
  @service
  intl;

  @service
  fastboot;

  @tracked currentTheme;
  constructor(owner, args) {
    super(owner, args);

    if (!this.fastboot.isFastBoot) {
      this.currentTheme = localStorage.getItem('datafruits-theme') || 'classic';
    }
  }

  themes = [
    { text: this.intl.t('themes.classic'), value: 'classic' },
    { text: this.intl.t('themes.blm'), value: 'blm' },
    { text: this.intl.t('themes.trans'), value: 'trans' },
  ];
}
