import RouteTemplate from 'ember-route-template'
import pageTitle from "ember-page-title/helpers/page-title";
import View from "../../components/show-series/view.gts";
export default RouteTemplate(<template>{{pageTitle @controller.model.title}}
<View @showSeries={{@controller.model}} /></template>)