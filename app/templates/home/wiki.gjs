import RouteTemplate from 'ember-route-template'
import pageTitle from "ember-page-title/helpers/page-title";
import t from "ember-intl/helpers/t";
import { LinkTo } from "@ember/routing";
export default RouteTemplate(<template>{{pageTitle (t "wiki.title")}}
<div class="page-spacing">
  <h1 class="debussy-header">{{t "wiki.welcome"}}</h1>

  <div class="page-bg">
    {{#if @controller.session.isAuthenticated}}
      <div class="pt-6 my-4 mx-4">
        <LinkTo @route="home.wiki.new" class="cool-button">
          NEW ARTICLE
        </LinkTo>
      </div>
    {{/if}}

    <section>
      <h2 class="text-3xl font-cursive md:pl-2">{{t "wiki.latest"}}</h2>
      <ul class="text-2xl bold underline md:pl-4">
        {{#each @controller.model as |wikiPage|}}
          <li>
            <LinkTo @route="home.wiki.show" @model={{wikiPage.slug}}>
              {{wikiPage.title}}
            </LinkTo>
          </li>
        {{/each}}
      </ul>
    </section>
  </div>
</div>
</template>)