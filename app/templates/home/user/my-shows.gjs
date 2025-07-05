import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import { LinkTo } from "@ember/routing";
import ShowCard from "../../../components/user/show-card.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <h1 class="mb-2">{{t "profile.my-shows.title"}}</h1>
  <LinkTo class="cool-button" @route="home.user.my-shows.new">
    NEW SHOW
  </LinkTo>
  {{#each @controller.model as |show|}}
    <ShowCard @show={{show}} />
  {{/each}}
</section>
</template>)