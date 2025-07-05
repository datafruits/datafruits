import RouteTemplate from 'ember-route-template'
import Post from "../../../components/post.ts";
import Form from "../../../components/post/form.ts";
import t from "ember-intl/helpers/t";
export default RouteTemplate(<template><section class="page-spacing">
  <h1 class="text-3xl font-cursive mb-2">{{@controller.model.title}}</h1>
  {{#each @controller.model.sortedPosts as |post|}}
    <Post @post={{post}} />
  {{/each}}
  <section>
    {{#if @controller.session.isAuthenticated}}
      <h1 class="text-2xl font-cursive mb-2">Hey, {{@controller.currentUser.user.username}}, leave a reply.....???</h1>
      <Form @postable={{@controller.model}} @postableType={{"ForumThread"}} />
    {{else}}
      {{t "forum.login_or_register"}}
    {{/if}}
  </section>
</section>
</template>)