import RouteTemplate from 'ember-route-template'
import Article from "../../../components/wiki/article.ts";
export default RouteTemplate(<template><div class="mt-5 pt-2 px-5">
  <Article @page={{@controller.model}} />
</div>
</template>)