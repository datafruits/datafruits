import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import UserFavorites from "../../../components/user-favorites.ts";
export default RouteTemplate(<template><div class="page-spacing">
  <h1 class="debussy-header">{{t "profile.my_favorites"}}</h1>
  <div class="bg-df-blue-dark blm:bg-black rounded py-2">
    <UserFavorites />
  </div>
</div>
</template>)