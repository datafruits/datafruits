import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import type ShrimpoVotingCategoryScore from 'datafruits13/models/shrimpo-voting-category-score';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';
import or from "ember-truth-helpers/helpers/or";
import eq from "ember-truth-helpers/helpers/equal";
import { LinkTo } from "@ember/routing";
import { array } from "@ember/helper";
import formattedShrimpoRanking from "../../helpers/formatted-shrimpo-ranking.ts";
import BadgeViewerContainer from "../user/badge-viewer-container.js";
import Player from "./player.gts";

interface ShrimpoEntryCardArgs {
  shrimpoEntry: ShrimpoEntry;
  categoryScore: ShrimpoVotingCategoryScore;
}

export default class ShrimpoEntryCard extends Component<ShrimpoEntryCardArgs> {<template><div class="bg-df-pink text-2xl rounded-lg border-4 border-white sm:py-1 flex justify-between space-x-1 text-xs sm:text-xl mb-2 p-2 md:py-4">
  <div class="flex items-start">
    {{#if (or (eq @shrimpoEntry.shrimpo.status "completed") (eq @shrimpoEntry.shrimpo.shrimpoType "mega"))}}
      <span>
        <img class="rounded-lg" style="height: 3rem;" src="{{@shrimpoEntry.userAvatar}}" alt />
      </span>
    {{/if}}
    <div class="flex flex-col">
      <LinkTo @route="home.shrimpos.entries.show" @models={{array @shrimpoEntry.shrimpo.slug @shrimpoEntry.slug}}>
        <h2>{{@shrimpoEntry.title}}</h2>
      </LinkTo>
      {{#if (or (eq @shrimpoEntry.shrimpo.status "completed") (eq @shrimpoEntry.shrimpo.shrimpoType "mega"))}}
        <LinkTo @route="home.dj" @model={{@shrimpoEntry.username}}>
          <h3>{{@shrimpoEntry.username}}</h3>
        </LinkTo>
      {{/if}}
    </div>
  </div>
  {{#if (eq @shrimpoEntry.shrimpo.status "completed")}}
    <div class>
      {{#if @categoryScore}}
        <span class="font-extrabold">
          {{formattedShrimpoRanking @categoryScore.ranking @shrimpoEntry.shrimpo.savedShrimpoEntries.length}}
        </span>
      {{else}}
        <span class="font-extrabold">
          {{formattedShrimpoRanking @shrimpoEntry.ranking @shrimpoEntry.shrimpo.savedShrimpoEntries.length}}
        </span>
      {{/if}}
      <div>
        {{#each @shrimpoEntry.trophyAwards as |trophyAward|}}
          <BadgeViewerContainer @badge={{trophyAward}} />
        {{/each}}
      </div>

      <div>
        {{#if @categoryScore}}
          <span>Total {{this.categoryScoreEmoji}}'s:</span>
          <span class="font-extrabold">{{@categoryScore.score}}</span>
        {{else}}
          <span>Total {{this.scoreEmoji}}'s:</span>
          <span class="font-extrabold">{{@shrimpoEntry.totalScore}}</span>
        {{/if}}
      </div>
    </div>
  {{/if}}
  <Player @shrimpoEntry={{@shrimpoEntry}} />
</div></template>
  get scoreEmoji() {
    // need to use get here
    return formatEmojiHtml(this.args.shrimpoEntry.get('shrimpoEmoji'));
  }

  get categoryScoreEmoji() {
    return formatEmojiHtml(this.args.categoryScore.shrimpoVotingCategory.get('emoji'));
  }
}
