import RouteTemplate from 'ember-route-template'
import t from "ember-intl/helpers/t";
import PcNav from "../components/pc-nav.js";
import SpNav from "../components/sp-nav.js";
import UserMenu from "../components/user-menu.js";
import OurVersionNotifier from "../components/our-version-notifier.js";
import DatafruitsPlayer from "../components/datafruits-player.ts";
import DjDonateModal from "../components/dj-donate-modal.js";
import HackButton from "../components/hack-button.ts";
import AddDatafruit from "../components/add-datafruit.js";
import DatafruitsVisuals from "../components/datafruits-visuals.js";
import Notifications from "../components/notifications.js";
import WindowResizeHandler from "../components/window-resize-handler.js";
import Pixi from "../components/pixi.js";
import LoginModal from "../components/login-modal.js";
export default RouteTemplate(<template><section class="h-handle-resize flex flex-col justify-between">
  <div class="flex classic:bg-df-pink blm:bg-black trans:bg-df-blue">
    <a class="skip-to-content-link" href="#main-content">
      {{t "skip_to_content"}}
    </a>
    <PcNav @toggleSubMenu={{@controller.toggleSubMenu}} @submenuOpen={{@controller.submenuOpen}} @toggleUserMenu={{@controller.toggleUserMenu}} @toggleLoginModal={{@controller.toggleLoginModal}} />
    <SpNav @toggleMenu={{@controller.toggleMenu}} @toggleUserMenu={{@controller.toggleUserMenu}} @menuOpen={{@controller.menuOpen}} />
  </div>
  <UserMenu @showing={{@controller.isShowingUserMenu}} @toggleUserMenu={{@controller.toggleUserMenu}} />
  <OurVersionNotifier @updateMessage="Updates have been made to datafruits! Refresh to stay up-to-date 💻" @reloadButtonText="Refresh" />
  <div class="overflow-auto min-h-0 text-white text-shadow flex flex-col flex-grow" id="main-content">
    {{outlet}}
  </div>
  <DatafruitsPlayer class="flex-col flex justify-center classic:bg-df-pink blm:bg-black trans:bg-df-blue text-xl py-2 text-white leading-none">
    <DjDonateModal class="hidden md:block mr-2" />
    <HackButton class="hidden md:block mr-2" />
  </DatafruitsPlayer>
  <div class="flex-row flex justify-between text-xl classic:bg-df-green-dark blm:bg-black trans:bg-df-blue">
    <AddDatafruit />
  </div>
</section>
<DatafruitsVisuals class="block absolute top-0 w-screen h-screen h-handle-resize" />
{{#unless @controller.fastboot.isFastBoot}}
  <Notifications />
  <WindowResizeHandler />
  {{#if @controller.showingPixi}}
    <Pixi />
  {{/if}}
{{/unless}}

{{#if @controller.aprilFools}}
  {{!-- bgs --}}
  <a href="https://datafruits.bandcamp.com/album/bgs-vs-firedrill-studio-phone-3" rel="noopener noreferrer" target="_blank"><img class="tiny-guy" alt=":bgs:" src="/assets/images/bgs_small.png" /></a>
  {{!-- grumby --}}
  <a href="https://www.youtube.com/shorts/9_g8YA_vJzg" rel="noopener noreferrer" target="_blank"><img class="tiny-grumby" alt=":bgs:" src="/assets/images/emojis/grumby.gif" /></a>
{{/if}}

{{#if @controller.showingLoginModal}}
  <LoginModal @login={{@controller.authenticate}} @toggleModal={{@controller.toggleLoginModal}} />
{{/if}}

<div id="modals-container">
</div></template>)