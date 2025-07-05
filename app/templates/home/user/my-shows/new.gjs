import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import ShowForm from "../../../../components/user/show-form.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <h1 class="text-3xl">
    {{t "profile.my-shows.new"}}
  </h1>
  <ShowForm @show={{@controller.model}} />
</section></template>)