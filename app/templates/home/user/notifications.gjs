import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import UserNotification from "../../../components/user-notification.ts";
export default RouteTemplate(<template><div class="page-spacing">
  <div class="flex">
    {{#if @controller.model.length}}
      <h1>{{t "profile.notifications.header"}}</h1>
    {{else}}
      <h1>{{t "profile.notifications.no_notifications_yet"}}</h1>
    {{/if}}
    <img src="/assets/images/futsu.png" alt="{{t "profile.notifications.pidgeon"}}" class="ml-2" />
  </div>

  <ul>
    {{#each @controller.model as |notification|}}
      <UserNotification @notification={{notification}} />
    {{/each}}
  </ul>
</div></template>)