import RouteTemplate from 'ember-route-template'
import pageTitle from "ember-page-title/helpers/page-title";
import t from "ember-intl/helpers/t";
import Form from "../../components/sign-up/form.js";
import changeset from "ember-changeset/helpers/changeset";
export default RouteTemplate(<template>{{pageTitle (t "signup.title")}}
<div class="mt-5 pt-2 px-5">
  <h1>{{t "signup.title"}}</h1>
  {{#if @controller.currentUser.user}}
    {{t "signup.already_signed_up"}}
  {{else}}
    <p>
      {{t "signup.description"}}
    </p>
    <Form @changeset={{changeset @controller.model @controller.UserValidations}} />
  {{/if}}
</div>
</template>)