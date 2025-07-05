import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import { LinkTo } from "@ember/routing";
import ThreadList from "../../components/forum/thread-list.ts";
export default RouteTemplate(<template><section class="page-spacing">
  <section class="flex justify-between mb-4">
    <h1 class="debussy-header">{{t "forum.title"}}</h1>
    {{#if @controller.session.isAuthenticated}}
      <LinkTo class="cool-button" @route="home.forum.new">
        {{t "forum.new_topic"}}
      </LinkTo>
    {{/if}}
  </section>
  <section class="mb-2">
    <ThreadList @forumThreads={{@controller.model}} />
  </section>
</section></template>)