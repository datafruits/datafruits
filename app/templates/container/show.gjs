import RouteTemplate from 'ember-route-template'
import DatafruitsPlayer from "../../components/container/datafruits-player.js";
import { get } from "@ember/helper";
import t from "ember-intl/helpers/t";
export default RouteTemplate(<template>{{#if @controller.model.tracks}}
  <DatafruitsPlayer @track={{get @controller.model.tracks "0"}} />
{{else}}
  <DatafruitsPlayer />
{{/if}}
<a class="logo" href="https://datafruits.fm/" target="_blank" rel="noopener noreferrer" aria-label={{t "site_title_fm"}}>
  <img id="circle-logo" src="/assets/images/logo.png" alt={{t "site_title"}}>
</a>
</template>)