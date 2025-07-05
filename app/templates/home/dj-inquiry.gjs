import RouteTemplate from 'ember-route-template'
import pageTitle from "ember-page-title/helpers/page-title";
import t from "ember-intl/helpers/t";
import randomLoadingSpinner from "../../helpers/random-loading-spinner.js";
import { on } from "@ember/modifier";
import { Input, Textarea } from "@ember/component";
import eq from "ember-truth-helpers/helpers/equal";
export default RouteTemplate(<template>{{pageTitle (t "djinquiry.title")}}
<h1>
  <img class="inline" src={{randomLoadingSpinner}} alt={{t "loading"}}>
  <span class="font-debussy">
    {{t "djinquiry.heading"}}
  </span>
  <img class="inline" src={{randomLoadingSpinner}} alt={{t "loading"}}>
</h1>
<div class="page-spacing">
  <div class="page-bg px-4 py-4">
    <div>
      <p>
        {{t "djinquiry.description"}}
      </p>
      {{#if @controller.model.isNew}}
        <p>
          {{#if @controller.model.errors}}
            <div class="error-message">
              {{t "djinquiry.error"}}
            </div>
          {{/if}}
          <form {{on "submit" @controller.submitApplication}}>
            <div>
              <label for="dj-form-email">
                {{t "djinquiry.email"}}
              </label>
              <br>
              <Input name="dj-form-email" id="dj-form-email" @value={{@controller.model.email}} />
              {{#if @controller.model.errors.email}}
                {{#each @controller.model.errors.email as |error|}}
                  <div class="error">
                    <span>
                      {{error.message}}
                    </span>
                  </div>
                {{/each}}
              {{/if}}
            </div>
            <div>
              <label for="dj-form-username">
                {{t "djinquiry.username"}}
              </label>
              <br>
              <Input name="dj-form-username" id="dj-form-username" @value={{@controller.model.username}} />
              {{#if @controller.model.errors.username}}
                {{#each @controller.model.errors.username as |error|}}
                  <div class="error">
                    <span>
                      {{error.message}}
                    </span>
                  </div>
                {{/each}}
              {{/if}}
            </div>
            <div>
              <label for="dj-form-mix">
                {{t "djinquiry.link_to_mix"}}
              </label>
              <br>
              <Input name="dj-form-mix" id="dj-form-mix" @value={{@controller.model.link}} />
              {{#if @controller.model.errors.link}}
                {{#each @controller.model.errors.link as |error|}}
                  <div class="error">
                    <span>
                      {{error.message}}
                    </span>
                  </div>
                {{/each}}
              {{/if}}
            </div>
            <div>
              <label for="dj-form-url">
                {{t "djinquiry.homepage_url"}}
              </label>
              <br>
              <Input name="dj-form-url" id="dj-form-url" @value={{@controller.model.homepageUrl}} />
            </div>
            <div>
              <label for="dj-form-interval">
                {{t "djinquiry.interval"}}
              </label>
              <br>
              <select onchange={{action "setShowInterval"}} value="target.value">
                {{#each @controller.intervals as |interval|}}
                  {{#if (eq @controller.model.interval interval)}}
                    <option value={{interval}} selected="selected">
                      {{interval}}
                    </option>
                  {{else}}
                    <option value={{interval}}>
                      {{interval}}
                    </option>
                  {{/if}}
                {{/each}}
              </select>
            </div>
            <div>
              <label for="dj-form-time">
                {{t "djinquiry.time"}}
              </label>
              <br>
              <Textarea id="dj-form-time" @value={{@controller.model.desiredTime}} />
              {{#if @controller.model.errors.desiredTime}}
                {{#each @controller.model.errors.desiredTime as |error|}}
                  <div class="error">
                    <span>
                      {{error.message}}
                    </span>
                  </div>
                {{/each}}
              {{/if}}
            </div>
            <div>
              <label for="dj-form-other">
                {{t "djinquiry.other"}}
              </label>
              <br>
              <Textarea name="dj-form-other" id="dj-form-other" @value={{@controller.model.otherComment}} />
            </div>
            <div>
              <label for="min-age">
                {{t "djinquiry.min_age"}}
              </label>
              <Input @type="checkbox" @checked={{@controller.minAge}} />
            </div>
            <div>
              <label for="coc-checkbox">
                <a href="https://datafruits.fm/coc" target="blank">
                  {{t "djinquiry.coc_accept"}}
                </a>
              </label>
              <Input @type="checkbox" @checked={{@controller.cocAccepted}} name="coc-checkbox" />
            </div>
            <div>
              <input type="submit" value="Send" class="cool-button" disabled={{@controller.canSubmit}}>
            </div>
          </form>
        </p>
      {{else}}
        <p>
          <img src="/assets/images/thanks.gif" alt={{t "thanks"}}>
          <br>
          {{t "djinquiry.thanks"}}
        </p>
      {{/if}}
    </div>
  </div>
</div></template>)