import RouteTemplate from 'ember-route-template'
import Await from "../../../../components/await.js";
import EpisodeCard from "../../../../components/my-shows/episode-card.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <h1 class="text-3xl">MANAGE EPISODES</h1>
  <section class="flex space-x-2 w-full">
    <section class="w-1/2">
      <h1>ARCHIVES</h1>
      <Await @promise={{@controller.fetchArchives}}>
        <:pending>
          Loading episodes...
        </:pending>

        <:success as |episodes|>
          {{#each episodes as |episode|}}
            <EpisodeCard @episode={{episode}} />
          {{/each}}
        </:success>

        <:error>
          Something went wrong :(
        </:error>
      </Await>
    </section>
    <section class="w-1/2">
      <h1>UPCOMING</h1>
      <Await @promise={{@controller.fetchUpcoming}}>
        <:pending>
          Loading episodes...
        </:pending>

        <:success as |episodes|>
          {{#each episodes as |episode|}}
            <EpisodeCard @episode={{episode}} />
          {{/each}}
        </:success>

        <:error>
          Something went wrong :(
        </:error>
      </Await>
    </section>
  </section>
</section></template>)