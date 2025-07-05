import RouteTemplate from 'ember-route-template'
import List from "../../components/djs/list.ts";
export default RouteTemplate(<template><div class="mt-5 pt-2 px-5">
  <List @searchParams={{@controller.router.currentRoute.queryParams}} />
</div></template>)