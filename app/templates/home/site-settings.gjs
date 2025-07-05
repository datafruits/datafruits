import RouteTemplate from 'ember-route-template'
import pageTitle from "ember-page-title/helpers/page-title";
import t from "ember-intl/helpers/t";
import SiteSettings from "../../components/site-settings.js";
export default RouteTemplate(<template>{{pageTitle (t "settings.title")}}
<div class="page-spacing">
  <div class="page-bg px-4 py-4">
    <h1>{{t "settings.title"}}</h1>

    <SiteSettings />
  </div>
</div>
</template>)