import RouteTemplate from 'ember-route-template'
import or from "ember-truth-helpers/helpers/or";
import eq from "ember-truth-helpers/helpers/equal";
import { LinkTo } from "@ember/routing";
import Badges from "../../../../components/user/badges.ts";
import BadgeViewerContainer from "../../../../components/user/badge-viewer-container.js";
import formattedShrimpoRanking from "../../../../helpers/formatted-shrimpo-ranking.ts";
import emojiPath from "../../../../helpers/emoji-path.ts";
import Player from "../../../../components/shrimpo/player.ts";
import Pagination from "../../../../components/shrimpo/pagination.ts";
import and from "ember-truth-helpers/helpers/and";
import notEq from "ember-truth-helpers/helpers/not-equal";
import VotingCategoriesTable from "../../../../components/shrimpo/voting-categories-table.ts";
import VotingTable from "../../../../components/shrimpo/voting-table.ts";
import t from "ember-intl/helpers/t";
import Form from "../../../../components/post/form.ts";
import Post from "../../../../components/post.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <section class="flex space-x-2 w-full">
    {{#if (or (eq @controller.model.shrimpoStatus "completed") (eq @controller.model.shrimpoType "mega"))}}
      <section class="w-1/4 bg-df-pink rounded-lg border-4 border-white ">
        <span class="p-4 shrink-0" style="height: 10rem; width: 10rem; flex-shrink: 0;">
          <img class="rounded-lg inline self-center object-none" style="height: 10rem; width: 100%;" align="center" alt="{{@controller.model.username}}" src="{{@controller.model.userAvatar}}" />
        </span>
        <section class="flex flex-col grow">
          <span class="user-info mb-2">
            <LinkTo @route="home.dj" @model={{@controller.model.username}} class="text-3xl df-text-yellow">
              {{@controller.model.username}}
            </LinkTo>
            <Badges @role={{@controller.model.userRole}} />
          </span>
        </section>
      </section>
    {{/if}}

    <section class="w-3/4">
      <section class="bg-df-pink rounded-lg border-4 border-white mb-2 p-2">
        <h2>{{@controller.model.title}}</h2>
        <p>
          {{@controller.model.description}}
        </p>
        {{#if (eq @controller.model.shrimpoStatus "completed")}}
          <div class>
            <div>
              {{#each @controller.model.trophyAwards as |trophyAward|}}
                <BadgeViewerContainer @badge={{trophyAward}} />
              {{/each}}
            </div>
            {{#if (eq @controller.model.shrimpoType "mega")}}
              <!-- mega category scores -->
              <ul>
                <li><span class="font-bold">{{formattedShrimpoRanking @controller.model.ranking @controller.model.shrimpoTotalEntries}}</span> overall ({{@controller.model.totalScore}})</li>
                {{#each @controller.model.shrimpoVotingCategoryScores as |votingCategoryScore|}}
                  {{log votingCategoryScore.shrimpoVotingCategory.emoji}}
                  <li>
                    <img width="48" class="inline" src="{{emojiPath votingCategoryScore.shrimpoVotingCategory.emoji}}">
                    <span class="font-bold">{{formattedShrimpoRanking votingCategoryScore.ranking @controller.model.shrimpoTotalEntries}}</span>
                    - {{votingCategoryScore.shrimpoVotingCategory.name}} - ({{votingCategoryScore.score}})
                  </li>
                {{/each}}
              </ul>
            {{else}}
              <span class="font-extrabold">{{formattedShrimpoRanking @controller.model.ranking @controller.model.shrimpoTotalEntries}}</span>

              <div>
                <span>Total {{@controller.scoreEmoji}}'s:</span>
                <span class="font-extrabold">{{@controller.model.totalScore}}</span>
              </div>
            {{/if}}
          </div>
        {{/if}}
        <Player @shrimpoEntry={{@controller.model}} />
      </section>
      <section class="bg-df-pink rounded-lg border-4 border-white mb-2 p-2">
        <Pagination @entry={{@controller.model}} />
      </section>
      {{#if (and @controller.session.isAuthenticated (or (eq @controller.model.shrimpoStatus "voting") (eq @controller.model.shrimpoType "mega")))}}
        {{#if (notEq @controller.model.shrimpoStatus "completed")}}
          {{#if (notEq @controller.currentUser.user.username @controller.model.username)}}
            {{#if (eq @controller.model.shrimpoType "mega")}}
              <section class="bg-df-pink rounded-lg border-4 border-white p-2">
                <VotingCategoriesTable @entry={{@controller.model}} @votingCategories={{@controller.model.shrimpo.shrimpoVotingCategories}} @votingCompletionPercentage={{@controller.model.shrimpoVotingCompletionPercentage}} />
              </section>
            {{else}}
              <section class="bg-df-pink rounded-lg border-4 border-white p-2">
                <VotingTable @entry={{@controller.model}} @votingCompletionPercentage={{@controller.model.shrimpoVotingCompletionPercentage}} />
              </section>
            {{/if}}
          {{else}}
            <h1>can't vote on one's OWN shrimpo that just wouldn't be ok would it</h1>
          {{/if}}
        {{/if}}
      {{/if}}
      <section>
        {{#if @controller.session.isAuthenticated}}
          <h1 class="text-2xl font-cursive mb-2">Hey, {{@controller.currentUser.user.username}}, {{t "show.episode.leave_a_comment"}}</h1>
          <Form @postable={{@controller.model}} @postableType={{"ShrimpoEntry"}} />
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