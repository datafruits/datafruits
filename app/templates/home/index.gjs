import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import ShowEpisodeCard from "../../components/show-episode-card.ts";
export default RouteTemplate(<template><h2 class="text-2xl text-shadow my-2 mt-5 pt-2 px-5">
  {{t "home.upcoming_shows"}}
</h2>
<div class="flex flex-wrap flex-shrink-0">
  {{#each @controller.model.upcomingShows as |show|}}
    <ShowEpisodeCard @episode={{show}} />
  {{/each}}
</div>
<h2 class="text-2xl text-shadow my-2 mt-5 pt-2 px-5">
  {{t "home.latest_podcasts"}}
</h2>
<div class="flex flex-wrap flex-shrink-0">
  {{#each @controller.model.latestPodcasts as |track|}}
    <ShowEpisodeCard @episode={{track}} />
  {{/each}}
</div></template>)