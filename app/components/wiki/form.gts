import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import WikiPageValidations from '../../validations/wiki-page';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import emojione from 'emojione';
import { SafeString } from 'handlebars';
import { htmlSafe } from '@ember/template';
import type WikiPage from 'datafruits13/models/wiki-page';
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import changeset from "ember-changeset/helpers/changeset";
import ChangesetForm from "../ui/changeset-form.ts";
import t from "ember-intl/helpers/t";
import Button from "@frontile/buttons/components/button";
import markedDown from "../../helpers/marked-down.js";

interface WikiFormSignature {
  Args: {
    model: WikiPage;
  };
}

export default class WikiForm extends Component<WikiFormSignature> {<template><div class="grid grid-cols-2 gap-2" {{didInsert this.didInsert}}>
  <div class>
    <span>You can format this article with <a href="https://www.markdownguide.org/basic-syntax" target="_blank" rel="noopener noreferrer">Markdown</a>.</span>
    {{#let (changeset @model this.WikiPageValidations) as |changeset|}}
      <ChangesetForm @changeset={{changeset}} @onError={{this.onError}} @onSubmit={{this.onSubmit}} as |Form|>
        <Form.Input @label={{t "wiki.form.title"}} @fieldName="title" @containerClass="mb-2" @onInput={{this.setPreviewTitle}} />
        <Form.Textarea @label={{t "wiki.form.body"}} @fieldName="body" @containerClass="mb-2" @size="lg" @onInput={{this.setPreviewBody}} rows="20" cols="50" />
        {{#unless @model.isNew}}
          <Form.Input @label={{t "wiki.form.summary"}} @fieldName="summary" @containerClass="mb-2" />
        {{/unless}}
        <Button @type="submit" @intent="primary" class="cool-button" disabled={{changeset.isInvalid}}>
          {{t "wiki.form.submit"}}
        </Button>
      </ChangesetForm>
    {{/let}}
  </div>
  <div class>
    <h1>{{this.previewTitle}}</h1>
    {{markedDown this.previewBody}}
  </div>
</div></template>
  WikiPageValidations = WikiPageValidations;

  @service declare store: Store;
  @service declare router: RouterService;

  @tracked previewBody: SafeString = new SafeString('');
  @tracked previewTitle: SafeString = new SafeString('');

  @action didInsert() {
    this.previewBody = htmlSafe(emojione.shortnameToImage(this.args.model.body || ""));
    this.previewTitle = htmlSafe(emojione.shortnameToImage(this.args.model.title || ""));
  }

  @action
  setPreviewBody(value: string) {
    this.previewBody = htmlSafe(emojione.shortnameToImage(value));
  }

  @action
  setPreviewTitle(value: string) {
    this.previewTitle = htmlSafe(emojione.shortnameToImage(value));
  }

  @action
  onSubmit(data: any, event: Event) {
    console.log(data);
    console.log(event);
    this.router.transitionTo('home.wiki.show', data.slug);
  }

  @action
  onError() {
    alert("Couldn't save wiki article...check the form for errors.");
  }

}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    WikiForm: typeof WikiForm;
  }
}

