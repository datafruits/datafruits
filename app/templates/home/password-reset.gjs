import RouteTemplate from 'ember-route-template'
import RandomPasswordMessage from "../../../embroider-pair-component/%2Fhome%2Ftony%2Fsrc%2Fdatafruits%2Fapp%2Ftemplates%2Fcomponents%2Frandom-password-message.hbs/__vpc__/%2Fhome%2Ftony%2Fsrc%2Fdatafruits%2Fapp%2Fcomponents%2Frandom-password-message.ts";
import { on } from "@ember/modifier";
import t from "ember-intl/helpers/t";
import { Input } from "@ember/component";
export default RouteTemplate(<template><section class="page-spacing">
  <h1 class="mb-2 text-xl">
    <RandomPasswordMessage />
  </h1>

  <form {{on "submit" @controller.submit}}>
    <div class="mb-4">
      <label class for="login">
        {{t "password_reset.email"}}
      </label>
      <Input id="login" placeholder="email" class type="email" @value={{@controller.email}} autofocus={{true}} autocapitalize="off" />
    </div>

    <div class="flex items-center justify-between">
      <Input @type="submit" class="cool-button cursor-pointer" disabled={{@controller.cantSubmit}} data-test-submit-button @value={{t "password_reset.submit"}} />
    </div>
  </form>
</section></template>)