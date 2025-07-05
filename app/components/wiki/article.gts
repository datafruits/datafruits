import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { SafeString } from 'handlebars';
import emojione from 'emojione';
import { inject as service } from '@ember/service';
import { LinkTo } from "@ember/routing";
import markedDown from "../../helpers/marked-down.js";

interface WikiArticleSignature {
  Args: {
    page: any;
  };
}

export default class WikiArticle extends Component<WikiArticleSignature> {<template><h1 class="text-3xl font-cursive text-center pb-2">{{@page.title}}</h1>
<article class="bg-df-blue-dark wiki-article p-1">
  <div class="flex pb-2">
    <div class="m-2">
      <LinkTo @route="home.wiki" class="cool-button">
        BACK
      </LinkTo>
    </div>
    {{#if this.session.isAuthenticated}}
      <div class="m-2">
        <LinkTo @route="home.wiki.edit" class="cool-button" @model={{@page.slug}}>
          EDIT
        </LinkTo>
      </div>
    {{/if}}
    <div class="m-2">
      <LinkTo @route="home.wiki.history" class="cool-button" @model={{@page.slug}}>
        HISTORY
      </LinkTo>
    </div>
  </div>
  {{markedDown this.body}}
</article></template>
  @service declare session: any;

  get body(): SafeString {
    return htmlSafe(emojione.shortnameToImage(this.args.page.body));
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    WikiArticle: typeof WikiArticle;
  }
}

