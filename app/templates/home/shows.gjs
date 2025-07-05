import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import { LinkTo } from "@ember/routing";
import ShowsList from "../../components/shows-list.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <h2 class="text-4xl text-shadow mb-2 uppercase">
    {{t "shows.title"}}
  </h2>
  <div>
    {{#if @controller.session.isAuthenticated}}
      <LinkTo @route="home.user.my-shows" class="cool-button">
        {{t "profile.my-shows.title"}}
      </LinkTo>
    {{/if}}
  </div>
  <div class="flex flex-wrap flex-shrink-0">
    <ShowsList @shows={{@controller.model}} />
  </div>
</section></template>)