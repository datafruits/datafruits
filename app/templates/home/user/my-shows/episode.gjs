import RouteTemplate from 'ember-route-template'
import EpisodeForm from "../../../../components/my-shows/episode-form.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <h1 class="text-3xl">
    {{@controller.model.title}}
  </h1>
  <section class="flex">
    <EpisodeForm @episode={{@controller.model}} />
  </section>
</section></template>)