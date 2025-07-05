import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import Await from "../await.js";
import randomLoadingMessage from "../../helpers/random-loading-message.js";
import Search from "./search.gjs";
import { LinkTo } from "@ember/routing";
import Badges from "../user/badges.gts";
import eq from "ember-truth-helpers/helpers/equal";
import Pagination from "fruits-ui/components/fruits-ui/pagination";

interface DjsListArgs {
  searchParams: any;
}

export default class DjsList extends Component<DjsListArgs> {<template><Await @promise={{this.fetchDjs}}>
  <:pending>
    <h1>
      {{randomLoadingMessage}}
    </h1>
  </:pending>
  <:success as |result|>
    {{log result}}
    <div>
      <Search />
    </div>
    <div class="djs flex flex-wrap ">
      {{#each result as |dj|}}
        <div class="dj m-5 classic:bg-df-pink blm:bg-black trans:bg-df-blue rounded-md">
          <h2 class="name font-debussy text-xl m-2 overflow-hidden">
            <LinkTo @route="home.dj" @model={{dj.username}} title={{dj.username}}>
              {{dj.username}}
            </LinkTo>
          </h2>
          <Badges @role={{dj.role}} />
          {{#if (eq dj.avatarUrl null)}}
            <img width="150" height="150" class="rounded-b-md align-bottom" src="/assets/images/dj_placeholder.png" alt={{dj.username}}>
          {{else}}
            <img width="150" height="150" class="rounded-b-md align-bottom" src={{dj.avatarUrl}} alt={{dj.username}}>
          {{/if}}
        </div>
      {{/each}}
    </div>
    <Pagination @totalPages={{result.meta.total_pages}} @page={{@searchParams.page}} @route={{this.router.currentRouteName}} />
  </:success>
  <:error>
    error ... :(
  </:error>
</Await></template>
  @service declare router: RouterService;
  @service declare store: Store;

  get fetchDjs() {
    const query = {
      page: this.args.searchParams.page,
      search: { keyword: this.args.searchParams.query },
      tags: this.args.searchParams.tags,
    };
    const djsPromise = this.store.query('user', query);
    return djsPromise;
  }
}
