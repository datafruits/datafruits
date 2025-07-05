import { action } from '@ember/object';
import { debounce } from '@ember/runloop';
import Component from '@glimmer/component';
import { concat, get, fn } from "@ember/helper";
import startCase from "../helpers/start-case.js";
import eq from "ember-truth-helpers/helpers/equal";
import { Textarea, Input } from "@ember/component";
import { on } from "@ember/modifier";

export default class ValidatedField extends Component {<template>{{#unless this.noLabel}}
  {{#if @label}}
    <label class="block text-sm font-bold mb-2" for={{concat @type "-" @property}}>{{@label}}</label>
  {{else}}
    <label class="block text-sm font-bold mb-2" for={{concat @type "-" @property}}>{{startCase @property}}</label>
  {{/if}}
{{/unless}}

{{#if (eq @type "textarea")}}
  <Textarea ...attributes id={{concat @type "-" @property}} class="form-input focus:outline-none focus:shadow-outline" cols="80" rows="6" oninput={{action (mut (get @changeset @property)) value="target.value"}} {{on "blur" (fn this.validateProperty @changeset @property)}}>{{get @changeset @property}}</Textarea>
{{else}}
  <Input ...attributes class="form-input focus:outline-none focus:shadow-outline" @type={{@type}} autofocus={{true}} id={{concat @type "-" @property}} @value={{get @changeset @property}} {{on "change" this.updateProperty}} />
{{/if}}

{{#if this.hasErrors}}
  <div class="text-red-700">
    {{#each this.errors as |message|}}
      <div class="error item">{{message}}</div>
    {{/each}}
  </div>
{{/if}}</template>
  get hasErrors() {
    let keys = this.args.changeset.get('errors').map((error) => {
      return error.key;
    });
    return keys.includes(this.args.property);
  }

  get errors() {
    let changeset = this.args.changeset;
    let property = this.args.property;
    return changeset
      .get('errors')
      .filter((error) => {
        return error.key === property;
      })
      .map((error) => {
        return error.validation;
      });
  }

  @action
  updateProperty(event) {
    debounce(this, this._updateProperty, event.target.value, 500);
  }

  @action
  validateProperty() {
    debounce(this, this._validateProperty, 500);
  }

  _validateProperty() {
    let property = this.args.property;
    this.args.validateProperty(property);
  }

  _updateProperty(newValue) {
    let property = this.args.property;
    this.args.updateProperty(property, newValue);
  }
}
