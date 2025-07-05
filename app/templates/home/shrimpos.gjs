import RouteTemplate from 'ember-route-template'
import { LinkTo } from "@ember/routing";
import Card from "../../components/shrimpo/card.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <h1>
    THE POWER OF SHRIMPO<span class="ml-2 text-lg italic">beta</span> COMPELS YOU
  </h1>
  <p class="italic">
    Improve your skills. Create new music.
  </p>

  {{#if @controller.canCreateNewShrimpo}}
    <div class="my-2">
      <LinkTo @route="home.shrimpos.new" class="cool-button">
        BEGIN A NEW SHRIMPO
      </LinkTo>
    </div>
  {{/if}}

  <h3>Shrimpos in Progress</h3>
  {{#each @controller.currentShrimpos as |shrimpo|}}
    <Card @shrimpo={{shrimpo}} />
  {{/each}}

  <h3>Completed Shrimpos</h3>
  {{#each @controller.completedShrimpos as |shrimpo|}}
    <Card @shrimpo={{shrimpo}} />
  {{/each}}
</section></template>)