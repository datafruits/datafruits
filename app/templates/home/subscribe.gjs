import RouteTemplate from 'ember-route-template'
import pageTitle from "ember-page-title/helpers/page-title";
import t from "ember-intl/helpers/t";
export default RouteTemplate(<template><div class="mt-5 pt-2 px-5">
  {{pageTitle "Newsletter"}}
  <h4 class="modal-title" id="myModalLabel">
    {{t "newsletter_modal.title"}}
  </h4>
  <div>
    {{!-- Begin MailChimp Signup Form --}}
    <div id="mc_embed_signup">
      <form action="https://github.us8.list-manage.com/subscribe/post?u=542d1c3ead16aecf841c8fd53&amp;id=c6c1c36c83" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
        <aside class="tiny">
          {{t "newsletter_modal.tiny"}}
        </aside>
        <label for="mce-EMAIL">Email address: </label>
        <input type="email" value name="EMAIL" class="required email" id="mce-EMAIL" placeholder={{t "newsletter_modal.placeholder_email"}}>
        <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="cool-button">
        <div id="mce-responses">
          <div class="response hidden" id="mce-error-response">
          </div>
          <div class="response hidden" id="mce-success-response">
          </div>
        </div>
      </form>
    </div>
    {{!--End mc_embed_signup--}}
  </div>
  <div class="modal-footer"></div>
</div>
</template>)