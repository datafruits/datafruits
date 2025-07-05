import RouteTemplate from 'ember-route-template'
import { LinkTo } from "@ember/routing";
import { on } from "@ember/modifier";
import t from "ember-intl/helpers/t";
import markedDown from "../../../helpers/marked-down.js";
import eq from "ember-truth-helpers/helpers/equal";
import Countdown from "../../../components/shrimpo/countdown.ts";
import formatDate from "../../../helpers/format-date.js";
import EntryCard from "../../../components/shrimpo/entry-card.ts";
import EntryUploader from "../../../components/shrimpo/entry-uploader.ts";
import Form from "../../../components/post/form.ts";
import Post from "../../../components/post.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <h1>{{@controller.model.title}}</h1>
  <section class="flex space-x-2 w-full">
    <section class="w-1/4">
      <section class="bg-df-pink rounded-lg border-4 border-white p-2 mb-2">
        <img src={{@controller.model.coverArtUrl}} alt class="h-40" />
      </section>
      <section class="bg-df-pink rounded-lg border-4 border-white p-2 mb-2">
        <h4>Hosted By:</h4>
        <LinkTo class="text-xl font-bold" @route="home.dj" @model={{@controller.model.username}}>
          <img class="inline rounded-lg" style="height: 3rem;" align="center" alt="{{@controller.model.username}}" src="{{@controller.model.userAvatar}}" />
          {{@controller.model.username}}
        </LinkTo>
      </section>
      <section>
        <!-- admin stuff -->
        {{#if @controller.hostLoggedIn}}
          <button {{on "click" @controller.endShrimpo}} disabled={{if @controller.canEndShrimpo false true}} class="cool-button">
            {{t "shrimpo.end_shrimpo"}}
          </button>
        {{/if}}
      </section>
    </section>
    <section class="w-3/4">
      <section class="bg-df-pink rounded-lg border-4 border-white p-2 mb-6">
        <h3>Rules:</h3>
        <p class="m-2">
          {{markedDown @controller.model.rulePack}}
        </p>
        <div>
          <h3>Status: {{@controller.model.status}}</h3>
          {{#if (eq @controller.model.status "running")}}
            <Countdown @endAt={{@controller.model.endAt}} />
          {{/if}}
        </div>
        <div>
          <h3>Shrimpo type: <span class="uppercase">{{@controller.model.shrimpoType}}</span></h3>
        </div>
        {{#if (eq @controller.model.shrimpoType "mega")}}
          <div>
            <h4>Voting Categories:</h4>
            {{@controller.formattedVotingCategories}}
          </div>
        {{/if}}
        <h4>{{@controller.model.savedShrimpoEntries.length}} entries</h4>
        <div>
          Started at: {{formatDate @controller.model.startAt}}
        </div>
        {{#if (eq @controller.model.status "completed")}}
          <div>
            Ended at: {{formatDate @controller.model.endedAt}}
          </div>
        {{/if}}
        <p class="m-2">
          <a class="cool-button" href="{{@controller.model.zipFileUrl}}">
            {{t "shrimpo.download_pack"}}
          </a>
        </p>
      </section>
      <div>
        {{#if @controller.canShowEntries}}
          <div class="mb-4">
            {{#if @controller.model.entriesZipFileUrl}}
              <a class="cool-button" href={{@model.entriesZipFileUrl}}>{{t "shrimpo.download_all"}}</a>
            {{/if}}
          </div>
          {{#if (eq @controller.model.shrimpoType "mega")}}
            {{#if (eq @controller.model.status "completed")}}
              <!-- two cols of results -->
              <h1>best overall</h1>
              {{#each @controller.model.savedShrimpoEntries as |shrimpoEntry|}}
                <EntryCard @shrimpoEntry={{shrimpoEntry}} />
              {{/each}}
              <hr />
              {{#each @controller.model.shrimpoVotingCategories as |category|}}
                <h1>{{category.name}}</h1>
                {{#each category.sortedScores as |score|}}
                  <EntryCard @shrimpoEntry={{score.shrimpoEntry}} @categoryScore={{score}} />
                  <hr />
                {{/each}}
              {{/each}}
            {{else}}
              <h1>Entries</h1>
              {{#each @controller.model.savedShrimpoEntries as |shrimpoEntry|}}
                <EntryCard @shrimpoEntry={{shrimpoEntry}} />
              {{/each}}
            {{/if}}
          {{else}}
            <h1>Entries</h1>
            {{#each @controller.model.savedShrimpoEntries as |shrimpoEntry|}}
              <EntryCard @shrimpoEntry={{shrimpoEntry}} />
            {{/each}}
          {{/if}}
        {{/if}}
      </div>

      {{#if (eq @controller.model.status "running")}}
        <section class="bg-df-pink rounded-lg border-4 border-white p-2">
            {{#if @controller.session.isAuthenticated}}
              <h2>SUBMIT ENTRY</h2>
              <EntryUploader @shrimpo={{@controller.model}} />
            {{else}}
              <span><LinkTo @route="home.sign-up">Create an account</LinkTo> to join the shrimpo.</span>
            {{/if}}
        </section>
      {{/if}}
      <section>
        {{#if @controller.session.isAuthenticated}}
          <h1 class="text-2xl font-cursive mb-2">Hey, {{@controller.currentUser.user.username}}, {{t "show.episode.leave_a_comment"}}</h1>
          <Form @postable={{@controller.model}} @postableType={{"Shrimpo"}} />
        {{else}}
          {{t "forum.login_or_register"}}
        {{/if}}
      </section>
      <section class="posts">
        {{#each @controller.model.posts as |post|}}
          <Post @post={{post}} />
        {{/each}}
      </section>
    </section>
  </section>
</section></template>)