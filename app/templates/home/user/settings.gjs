import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
import { Input, Textarea } from "@ember/component";
import eq from "ember-truth-helpers/helpers/equal";
import TimezoneSelect from "../../../components/timezone-select.ts";
export default RouteTemplate(<template><div class="page-spacing">

  <h1 class="debussy-header">
    {{t "profile.settings"}}
  </h1>

  <div class="page-bg user-settings-menu">

    <div id="user-profile-settings-greeting" class="py-4 pl-4 flex justify-start font-semibold">
      <span class="text-3xl">
        {{@controller.randomGreeting}}
      </span>
      <span class="pl-8 text-4xl font-cursive">
        {{@controller.currentUser.user.username}}
      </span>
    </div>

    <div id="user-profile-settings-avatar" class="flex flex-wrap justify-evenly">
      <div>
        <label class="align-top" for="updateProfilePicture"> {{t "profile.my_pic"}}</label>
        <br />
        <input class="py-4 px-4 my-2 text-df-yellow w-full semibold border-dashed" id="updateProfilePicture" name="updateProfilePicture" type="file" {{on "change" @controller.updateFile}} />
      </div>

      <div>
        <label for="chatPreview">
          {{t "profile.chat"}}
        </label>
        <div class="py-4 my-2 flex flex-wrap border-white border-dashed border-2" id="chatPreview" name="chatPreview">
          <img class="mx-4 w-6 rounded-md" src="{{@controller.currentUser.user.avatarUrl}}">
          <span class="text-df-yellow align-text-bottom">
            {{@controller.currentUser.user.username}}
          </span>
          <span class="px-2 text-df-yellow">
            {{t "profile.chat_test"}}
          </span>
        </div>
      </div>
    </div>


    <hr class="my-8" />

    <form {{on "submit" @controller.saveUser}}>

      <div class="mt-4 flex justify-around">
        <label class="ml-4 align-top text-white w-1/5">
          {{t "profile.username"}}
        </label>
        <Input class="user-settings-input w-4/5" @value={{@controller.currentUser.user.username}} />
      </div>

      <div class="mt-4 flex justify-around">
        <label class="ml-4 align-top text-white w-1/5">
          {{t "profile.bio"}}
        </label>
        <Textarea class="user-settings-input h-40 w-4/5" @value={{@controller.currentUser.user.bio}} />
      </div>

      <div class="mt-4 flex justify-around">
        <label class="ml-4 align-top text-white w-1/5">
          {{t "profile.homepage"}}
        </label>
        <Input class="user-settings-input w-4/5" @value={{@controller.currentUser.user.homepage}} />
      </div>

      <br />

      <div class="flex flex-wrap justify-evenly">
        <div>
        <label class="align-top text-white">{{t "profile.pronouns"}}</label>
        <Input class="user-settings-input" @value={{@controller.currentUser.user.pronouns}} />
        </div>
        <div>
        <label class="text-white">{{t "profile.style"}}</label>
        <select id="style-selector" name="style-selector" class="user-settings-input h-9" aria-label="{{t "style"}}" {{on "change" @controller.setUserStyle}}>
          {{#each @controller.availableStyles as |style|}}
          <option value={{style}} selected={{eq @controller.currentUser.user.style style}}>
            {{style}}
          </option>
          {{/each}}
        </select>
        </div>
        <div>
        <label class="text-white">
          {{t "profile.time_zone"}}
        </label>
        <TimezoneSelect @selectedTimezone={{@controller.currentUser.user.timeZone}} @onChange={{@controller.setTimezone}} />
        </div>
      </div>

      <br />

      <div class="flex justify-around">

        <input type="submit" value="{{t "profile.submit"}}" class="cool-button" data-test-submit />
      </div>
    </form>

  </div>
</div></template>)