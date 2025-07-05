import RouteTemplate from 'ember-route-template'
import pageTitle from "ember-page-title/helpers/page-title";
import t from "ember-intl/helpers/t";
import Podcasts from "../../components/podcasts.ts";
export default RouteTemplate(<template>{{pageTitle (t "podcasts.title")}}
<div class="page-spacing">
  <h1 class="debussy-header">
    {{t "podcasts.title"}}
  </h1>
  <div class="page-bg">
    <Podcasts @labels={{@controller.model.labels}} @query={{@controller.router.currentRoute.queryParams}} @page={{@controller.router.currentRoute.queryParams.page}} />
  </div>
</div></template>)