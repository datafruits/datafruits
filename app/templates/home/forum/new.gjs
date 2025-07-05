import RouteTemplate from 'ember-route-template'
import Form from "../../../components/forum/form.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <Form @thread={{@controller.model}} />
</section>
</template>)