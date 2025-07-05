import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import { LinkTo } from "@ember/routing";
import formatDay from "../../../helpers/format-day.js";
import formatTime from "../../../helpers/format-time.js";
import { array } from "@ember/helper";
import Description from "../../../components/show-series/description.ts";
import PodcastTrack from "../../../components/podcast-track.js";
import TrackLabel from "../../../components/track-label.ts";
import Form from "../../../components/post/form.ts";
import Post from "../../../components/post.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <section class="flex w-full">
    <section class="w-1/2">
      <div style="background-image: url('{{@controller.model.imageOrDefault}}')" alt={{@controller.model.title}} class="w-full h-full show-image bg-top bg-cover"></div>
      <h1 class="text-3xl">
        {{@controller.model.title}}
      </h1>
      <h2>
        {{t "show.hosted_prefix"}}
      </h2>
      <div>
        {{#each @controller.model.djs as |host|}}
          <div>
            <img class="inline rounded-lg" style="height: 2rem;" src="{{host.avatarUrl}}" align="center" alt={{host.username}}>
          </div>
          <span class="font-cursive text-xl">
            <LinkTo @route="home.dj" @model={{host.username}}>
              {{host.username}}
            </LinkTo>
          </span>
        {{/each}}
      </div>
      <strong>Air date:</strong> {{formatDay @controller.model.start}} - {{formatTime @controller.model.start}}
      {{#if @controller.canEditShow}}
        <div class="my-2">
          <LinkTo @route="home.user.my-shows.episode" @models={{array @controller.model.showSeriesSlug @controller.model.slug}} class="cool-button">
            {{t "profile.my-shows.edit"}}
          </LinkTo>
        </div>
      {{/if}}
      <p>
      </p>
      <p>
        <Description @description={{@controller.model.description}} />
      </p>
      {{#each @controller.model.tracks as |track|}}
        <PodcastTrack @track={{track}} @show={{@controller.model}} />
      {{/each}}
      <p class="wiki-article uppercase text-2xl p-2 mb-4">
        Check out more episodes of
        <LinkTo @route="home.show" @model={{@controller.model.showSeriesSlug}}>
          {{@controller.model.showSeriesTitle}}
        </LinkTo>
      </p>
      <div class>
        {{#each @controller.model.labels as |label|}}
          <TrackLabel @label={{label}} />
        {{/each}}
      </div>
      <div>
        <h1>{{t "show.episode.comments"}}</h1>
        <section>
          {{#if @controller.session.isAuthenticated}}
            <h1 class="text-2xl font-cursive mb-2">Hey, {{@controller.currentUser.user.username}}, {{t "show.episode.leave_a_comment"}}</h1>
            <Form @postable={{@controller.model}} @postableType={{"ScheduledShow"}} />
          {{else}}
            {{t "forum.login_or_register"}}
          {{/if}}
        </section>
        <section class="posts">
          {{#each @controller.model.posts as |post|}}
            <Post @post={{post}} />
          {{/each}}
        </section>
      </div>
    </section>
    <section class="w-1/2">
        {{#if @controller.model.tracklist}}
          <h1 class="text-2xl">{{t "show.tracklist"}}</h1>
        {{/if}}
    </section>
  </section>
</section></template>)