import RouteTemplate from 'ember-route-template'
import Form from "../../../components/shrimpo/form.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <Form @model={{@controller.model}} />
</section>
</template>)