import Component from '@glimmer/component';
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
import eq from "ember-truth-helpers/helpers/equal";

export default class LocaleSelector extends Component {<template><label id="locale-selector-label" for="locale-selector">
  {{t "locale"}}
</label>
<select id="locale-selector" name="locale-selector" class="bg-df-pink" aria-label="{{t "locale"}}" {{on "change" @setLocale}}>
  {{#each this.locales as |localeChoice|}}
    {{#if (eq localeChoice.value @selectedLocale)}}
      <option selected value={{localeChoice.value}}>
        {{localeChoice.text}}
      </option>
    {{else}}
      <option value={{localeChoice.value}}>
        {{localeChoice.text}}
      </option>
    {{/if}}
  {{/each}}
</select>
</template>
  locales = [
    { text: 'English', value: 'en' },
    { text: '日本語', value: 'ja' },
    { text: '한국어', value: 'ko' },
    { text: 'Español', value: 'es' },
    { text: '中文', value: 'zh-cn' },
  ];
}
