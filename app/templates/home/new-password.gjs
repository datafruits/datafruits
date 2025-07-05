import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import PasswordForm from "../../components/password-form.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <h1 class="mb6 text-xl">{{t "password_new.heading"}}</h1>
  <PasswordForm @token={{@controller.router.currentRoute.queryParams.token}} />
</section>

</template>)