import RouteTemplate from 'ember-route-template'
import pageTitle from "ember-page-title/helpers/page-title";
import t from "ember-intl/helpers/t";
import { LinkTo } from "@ember/routing";
import Icon from "../../components/ui/icon.js";
export default RouteTemplate(<template>{{pageTitle "about"}}
<div class="page-spacing">
  <h1 class="debussy-header">
    {{t "just_a_website"}}
  </h1>
  <div class="page-bg">
    <div class="about-section">
      <div id="about-us-details">
        <h1>{{t "about_datafruits_header"}}</h1>
        <div class="about-section-text">
          <p>
            {{t "about_datafruits_1"}}
          </p>
          <p>
            {{t "about_datafruits_2"}}
          </p>
          <p>
            {{t "about_datafruits_3"}}
          </p>
        </div>
      </div>
      <div id="community-details">
        <h1>{{t "about_community_header"}}</h1>
        <div class="about-section-text">
          <p>
            {{t "about_community_1"}}
            <span>
              <LinkTo @route="home.coc" aria-label={{t "code_of_conduct_aria"}}>
                {{t "code_of_conduct"}}.
              </LinkTo>
            </span>
            {{t "about_community_2"}}
          </p>
        </div>
      </div>
      <div id="support-details">
        <h1>{{t "about_page.listenersupport_header"}}</h1>
        <div class="about-section-text">
          <p>
            {{t "about_page.listenersupport"}}
          </p>
        </div>
        <div class="about-section-text">
          <p>
            <LinkTo @route="home.support">{{t "about_page.premium_learn_more"}}</LinkTo>
          </p>
        </div>
        <div class="about-section-text">
          <p>
            {{t "about_page.donate_request"}}
          </p>
          <a href="https://paypal.me/datafruitsfm" target="_blank" rel="noopener noreferrer" aria-label={{t "about_page.donate_aria"}}>
            {{t "about_page.donate_linktext"}}
          </a>
        </div>
      </div>
      <hr class="border-df-green my-4 blm:border-white" />
      <div id="social-media-links" class="text-4xl py-2">
        <ul class="flex flex-wrap mb-4 justify-evenly">
          <li>
            <a href="https://discord.gg/83mteTQDvu" title={{t "discord.title"}} aria-label={{t "discord.aria"}} target="_blank" rel="noopener noreferrer">
              <Icon @name="discord" @prefix="fab" />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/channel/UCYTXGeHBvKP0Q9Wcxfop5FA/" title={{t "youtube.title"}} aria-label={{t "youtube.aria"}} target="_blank" rel="noopener noreferrer">
              <Icon @name="youtube" @prefix="fab" />
            </a>
          </li>
          <li>
            <a href="https://www.tiktok.com/@datafruits" title={{t "tiktok.title"}} aria-label={{t "tiktok.aria"}} target="_blank" rel="noopener noreferrer">
              <Icon @name="tiktok" @prefix="fab" />
            </a>
          </li>
          <li>
            <a href="http://twitter.com/datafruits" title={{t "twitter.title"}} aria-label={{t "twitter.aria"}} target="_blank" rel="noopener noreferrer">
              <Icon @name="twitter" @prefix="fab" />
            </a>
          </li>
          <li>
            <a href="http://instagram.com/datafruits" title={{t "instagram.title"}} aria-label={{t "instagram.aria"}} target="_blank" rel="noopener noreferrer">
              <Icon @name="instagram" @prefix="fab" />
            </a>
          </li>
          <li>
            <a href="http://soundcloud.com/datafruits" title={{t "soundcloud.title"}} aria-label={{t "soundcloud.aria"}} target="_blank" rel="noopener noreferrer">
              <Icon @name="soundcloud" @prefix="fab" />
            </a>
          </li>
          <li>
            <a href="https://datafruits.bandcamp.com/" title={{t "bandcamp.title"}} aria-label={{t "bandcamp.aria"}} target="_blank" rel="noopener noreferrer">
              <Icon @name="bandcamp" @prefix="fab" />
            </a>
          </li>
          <li>
            <a href="https://www.patreon.com/datafruits" title={{t "patreon.title"}} aria-label={{t "patreon.aria"}} target="_blank" rel="noopener noreferrer">
              <Icon @name="patreon" @prefix="fab" />
            </a>
          </li>
          <li>
            <a href="http://github.com/datafruits" title={{t "github.title"}} aria-label={{t "github.aria"}} target="_blank" rel="noopener noreferrer">
              <Icon @name="github" @prefix="fab" />
            </a>
          </li>
          <li>
            <a href="https://paypal.me/datafruitsfm" title={{t "paypal.title"}} target="_blank" rel="noopener noreferrer" aria-label={{t "about_page.donate_aria"}}>
              <Icon @name="paypal" @prefix="fab" />
            </a>
          </li>
          <li>
            <a href="mailto:info@datafruits.fm" title={{t "email.title"}} aria-label={{t "email.aria"}} target="_blank" rel="noopener noreferrer">
              <Icon @name="envelope" @prefix="fas" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <a href="http://datavegetables.club" class="text-df-blue hover:text-df-yellow text-shadow-none">
      {{t "secret"}}
    </a>
  </div>
</div></template>)