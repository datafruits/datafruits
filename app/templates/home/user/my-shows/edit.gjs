import RouteTemplate from 'ember-route-template'
import ShowForm from "../../../../components/user/show-form.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <ShowForm @show={{@controller.model}} @edit={{true}} />
</section></template>)