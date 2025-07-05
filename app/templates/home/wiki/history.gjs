import RouteTemplate from 'ember-route-template'

export default RouteTemplate(<template><div class="mt-5 pt-2 px-5">
  <h1 class="text-3xl">{{@controller.model.title}} history</h1>
  <article class="bg-df-pink wiki-article p-1">
    <ul>
      {{#each @controller.model.wikiPageEdits as |edit|}}
        <li>
          <span>{{edit.createdAt}}</span>
          <span class="italic">{{edit.summary}}</span>
          <strong>{{edit.username}}</strong>
        </li>
      {{/each}}
    </ul>
  </article>
</div>
</template>)