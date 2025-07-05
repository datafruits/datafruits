import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import randomLoadingSpinner from "../../helpers/random-loading-spinner.js";
import randomLoadingMessage from "../../helpers/random-loading-message.js";
import NetworkStatus from "../../components/network-status.js";
import DatafruitsChat from "../../components/datafruits-chat.js";
export default RouteTemplate(<template>{{#if @controller.fastboot.isFastBoot}}
  <div class="mt-5 pt-2 px-5">
    <div class="md:px-8">
      <div class="loading-container">
        <img alt={{t "loading"}} src={{randomLoadingSpinner}} />
      </div>
      <div class="loading-container">
        <h1>{{randomLoadingMessage}}</h1>
      </div>
    </div>
  </div>
{{else}}
  <NetworkStatus as |status|>
    <DatafruitsChat @networkStatus={{status}} @authenticate={{@controller.authenticate}} @isAuthenticating={{@controller.isAuthenticating}} />
  </NetworkStatus>
{{/if}}</template>)