/* eslint-disable-file ember/no-empty-glimmer-component-classes */
import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { LinkTo } from "@ember/routing";
import { array } from "@ember/helper";

interface ShrimpoPaginationArgs {
  entry: ShrimpoEntry;
}

export default class ShrimpoPagination extends Component<ShrimpoPaginationArgs> {<template><div class="flex space-x-2">
  <LinkTo @route="home.shrimpos.show" @model={{this.args.entry.shrimpoSlug}}>
    {{this.args.entry.shrimpoTitle}}
  </LinkTo>
  {{#if this.args.entry.previousShrimpoEntrySlug}}
    <LinkTo @route="home.shrimpos.entries.show" @models={{array this.args.entry.shrimpoSlug this.args.entry.previousShrimpoEntrySlug}} class="cool-button uppercase">
      Previous Shrimp
    </LinkTo>
  {{/if}}
  {{#if this.args.entry.nextShrimpoEntrySlug}}
    <LinkTo @route="home.shrimpos.entries.show" @models={{array this.args.entry.shrimpoSlug this.args.entry.nextShrimpoEntrySlug}} class="cool-button uppercase">
      Next Shrimp
    </LinkTo>
  {{/if}}
</div></template>}
