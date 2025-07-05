import RouteTemplate from 'ember-route-template'
import randomLoadingSpinner from "../../helpers/random-loading-spinner.js";
import t from "ember-intl/helpers/t";
import randomLoadingMessage from "../../helpers/random-loading-message.js";
export default RouteTemplate(<template><div class="loading-container">
  <img src={{randomLoadingSpinner}} alt={{t "loading"}}>
</div>
<div class="loading-container">
  <h1>
    {{randomLoadingMessage}}
  </h1>
</div>
</template>)