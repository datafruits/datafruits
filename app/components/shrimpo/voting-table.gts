import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
//import type ShrimpoVote from 'datafruits13/models/shrimpo-vote';
//import type ShrimpoVote from 'datafruits13/models/shrimpo-vote';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';
import { emojiPath } from 'datafruits13/helpers/emoji-path';
import { inject as service } from '@ember/service';
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
import gte from "ember-truth-helpers/helpers/gte";

interface ShrimpoVotingTableArgs {
  entry: ShrimpoEntry;
  votingCompletionPercentage: number;
}

export default class ShrimpoVotingTable extends Component<ShrimpoVotingTableArgs> {<template>{{#if this.session.isAuthenticated}}
  <div>
    <h3>Shrimps command voting happens now!</h3>
    <h2 class="text-lg">You are... {{@votingCompletionPercentage}}% {{t "shrimpo.voting_completion"}}!</h2>
    <p>
      Rate tune by number of {{this.scoreEmoji}}.
    </p>
    {{#if this.voted}}
      <p>
        {{t "shrimpo.already_voted"}}
      </p>
      <img class="bounce" src="/assets/images/i_voted.png">
    {{/if}}

    <div class="shrimpo-score-picker mb-2">
      <input type="range" min="1" max="6" value={{this.score}} {{on "change" this.setScore}}>
      <div class="flex">
        <img width="48" src="{{this.scoreEmojiPath}}">
        <img class={{if (gte this.score 2) "opacity-100" "opacity-50"}} width="48" src="{{this.scoreEmojiPath}}">
        <img class={{if (gte this.score 3) "opacity-100" "opacity-50"}} width="48" src="{{this.scoreEmojiPath}}">
        <img class={{if (gte this.score 4) "opacity-100" "opacity-50"}} width="48" src="{{this.scoreEmojiPath}}">
        <img class={{if (gte this.score 5) "opacity-100" "opacity-50"}} width="48" src="{{this.scoreEmojiPath}}">
        <img class={{if (gte this.score 6) "opacity-100" "opacity-50"}} width="48" src="{{this.scoreEmojiPath}}">
      </div>
    </div>
    <button {{on "click" this.saveVote}} class="cool-button">
      SAVE VOTE
    </button>
  </div>
{{else}}
  <div>
    <p>Login or register to vote on this shrimpo!</p>
  </div>
{{/if}}</template>
  @service
  declare session: any;

  @service
  declare store: any;

  @service
  declare currentUser: any;

  @tracked score: number = 1;

  @tracked voted: boolean = false;

  //vote: ShrimpoVote;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    const existingVote = this.args.entry.shrimpoVotes.find((vote: any) => {
      return vote.get('user.id') == this.currentUser.user.id;
    });
    console.log(existingVote);
    if(existingVote) {
      console.log(existingVote.score);
      //this.vote = existingVote;
      this.score = existingVote.score;
      this.voted = true;
    }
  }

  @action
  async saveVote() {
    //console.log(this.vote.get('shrimpoEntry'));
    const vote = this.store.createRecord('shrimpo-vote', {
      shrimpoEntry: this.args.entry,
      score: this.score
    });
    try {
      await vote.save();
      console.log(vote);
      alert('saved shrimpo vote!');
      this.voted = true;
    } catch (error) {
      console.log(vote);
      console.log(error);
      console.trace();
      alert('couldnt save vote!');
    }
  }

  @action
  setScore(event: any) {
    this.score = event.target.value;
  }

  get scoreEmoji() {
    return formatEmojiHtml(this.args.entry.shrimpoEmoji);
  }

  get scoreEmojiPath() {
    return emojiPath([this.args.entry.shrimpoEmoji]);
  }
}
