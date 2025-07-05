import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import formatDay from "../../helpers/format-day.js";
import Badges from "../../components/user/badges.ts";
import markedDown from "../../helpers/marked-down.js";
import GiftUserFruitTix from "../../components/gift-user-fruit-tix.ts";
import FruitsAffinity from "../../components/fruits-affinity.ts";
import { LinkTo } from "@ember/routing";
import formatDate from "../../helpers/format-date.js";
import includes from "ember-composable-helpers/helpers/includes";
import Tracks from "../../components/djs/tracks.ts";
export default RouteTemplate(<template><div class="mt-5 pt-2 px-5">
  <div class="bg-df-pink fancy-box p-2">
    <div class="flex">
      <div class="w-1/2">
        <h1 class="font-cursive text-2xl mb-2">
          {{@controller.model.username}}
        </h1>
        {{#if @controller.model.imageMediumUrl}}
          <img class="rounded-lg mb-2" src={{@controller.model.imageMediumUrl}} alt={{@controller.model.username}}>
        {{else}}
          <img class="rounded-lg mb-2" src="/assets/images/show_placeholder.jpg" alt={{@controller.model.username}}>
        {{/if}}
        <p class>
          <span>{{t "profile.joined"}}</span> - {{formatDay @controller.model.createdAt}}
        </p>
        <p class>
          <span>{{t "profile.last_login"}}</span> - <span>{{formatDay @controller.model.lastSignInAt}}</span>
        </p>
        <p class="mt-2 mb-2">
          <span>Lv. {{@controller.model.level}}</span>
          <div>
            <span class="text-xs">Ƒ</span><span>{{@controller.model.fruitTicketBalance}}</span>
          </div>
        </p>
        <Badges @role={{@controller.model.role}} />
        <p class="mt-2 mb-2">
          {{markedDown @controller.modelBio}}
        </p>
        <p class="mt-2 mb-2">
          <a href="{{@controller.qualifiedHomepageUrl}}" target="_blank" rel="noreferrer noopener">
            {{@controller.model.homepage}}
          </a>
        </p>
        <span>{{t "profile.style"}} <span class="text-df-yellow font-bold">{{@controller.model.style}}</span></span>
        <GiftUserFruitTix @toUser={{@controller.model}} />
      </div>
      <div class="w-1/2">
        {{log @controller.model.fruitsAffinity}}
        <FruitsAffinity @fruitsAffinity={{@controller.model.fruitsAffinity}} />
      </div>
    </div>
  </div>
  <div class="col-md-6 mt-5">
    {{#if @controller.model.nextShow}}
      <h2 class="text-xl">
        {{t "dj.upcoming_shows"}}
      </h2>
      <LinkTo @route="home.show" @model={{@controller.model.nextShow}}>
        {{@controller.model.nextShow.title}} - {{formatDate @controller.model.nextShow.start}}
      </LinkTo>
    {{/if}}
  </div>
</div>

{{#if (includes "dj" @controller.model.roles)}}
  <div class="mt-5 pt-2 px-5">
    <h2 class="text-xl">
      {{t "dj.podcasts"}}
    </h2>
    <Tracks @dj={{@controller.model}} @page={{@controller.router.currentRoute.queryParams.page}} />
  </div>
{{/if}}
</template>)