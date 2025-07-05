import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import randomLoadingSpinner from "../helpers/random-loading-spinner.js";
import { LinkTo } from "@ember/routing";
export default RouteTemplate(<template><div class="text-center text-white text-shadow">
  <div id="not-found-spin">
    <h1>
      {{t "404.title"}}
    </h1>
    <img src={{randomLoadingSpinner}} alt={{t "loading"}}>
  </div>
  <h1>
    {{t "404.message"}}
  </h1>
  <LinkTo @route="home">
    {{t "404.return_linktext"}}
  </LinkTo>
</div>
</template>)