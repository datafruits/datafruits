import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
import Icon from "./ui/icon.js";
import { LinkTo } from "@ember/routing";
import { hash } from "@ember/helper";
import NotificationsWindow from "./user/notifications-window.ts";
import WebsiteSettings from "./website-settings.gts";

export default class PcNav extends Component {<template><nav id="desktop-navbar" class="classic:bg-df-pink blm:bg-black trans:bg-df-blue mb-2 hidden md:block overflow-hidden w-full text-3xl relative" role="navigation">
  <ul class="flex flex-wrap mt-2 ml-2">
    <li class="its-just-a-website-menu-item">
      <a {{on "mouseenter" @toggleSubMenu}} aria-label={{t "radio.aria"}} class="text-white text-shadow-light hover:text-white" href="#">
        {{t "radio.title"}}
        <Icon class="transition-all duration-100 ease-in-out
          {{if @submenuOpen "rotated"}}" aria-hidden="true" @name="chevron-right" />
      </a>
    </li>
    <li class="its-just-a-website-menu-item">
      <LinkTo class="text-white text-shadow-light hover:text-gray-400" aria-label={{t "chat.aria"}} @route="home.chat">
        {{t "chat.title"}}
      </LinkTo>
    </li>
    <li class="its-just-a-website-menu-item">
      <a class="text-white text-shadow-light hover:text-gray-400" aria-label={{t "releases.aria"}} href="http://releases.datafruits.fm/" target="_blank" rel="noopener noreferrer">
        {{t "label"}}
      </a>
    </li>
    <li class="its-just-a-website-menu-item">
      <a class="text-white text-shadow-light hover:text-gray-400" aria-label={{t "shop.aria"}} href="https://datafruits.bandcamp.com/merch" target="_blank" rel="noopener noreferrer">
        {{t "shop.title"}}
      </a>
    </li>
    <li class="its-just-a-website-menu-item">
      <LinkTo class="text-white text-shadow-light hover:text-gray-400" aria-label={{t "about.aria"}} @route="home.about">
        {{t "about.title"}}
      </LinkTo>
    </li>
    <li class="its-just-a-website-menu-item">
      <LinkTo class="text-white text-shadow-light hover:text-gray-400" aria-label={{t "shrimpo.aria"}} @route="home.shrimpos">
        {{t "shrimpo.title"}}
      </LinkTo>
    </li>
    <li class="its-just-a-website-menu-item">
      <LinkTo class="text-white text-shadow-light hover:text-gray-400" aria-label={{t "about.aria"}} @route="home.support">
        {{t "support.title"}}
      </LinkTo>
    </li>
    {{#unless this.session.isAuthenticated}}
      <li class="its-just-a-website-menu-item">
        <button class="text-white text-shadow-light hover:text-gray-400" aria-label={{t "settings.title"}} {{on "click" this.settingsDialogToggle}}>
          {{t "settings.icon"}}
        </button>
      </li>
    {{/unless}}
  </ul>
  {{#if @submenuOpen}}
    <ul class="flex flex-wrap items-center ml-2">
      <li>
        <LinkTo class="its-just-a-website-sub-menu-item" aria-label={{t "shows.aria"}} @route="home.shows">
          {{t "shows.title"}}
        </LinkTo>
      </li>
      <li>
        <LinkTo class="its-just-a-website-sub-menu-item" aria-label={{t "djs.aria"}} @route="home.djs" @query={{hash tags="dj"}}>
          {{t "djs.title"}}
        </LinkTo>
      </li>
      <li>
        <LinkTo class="its-just-a-website-sub-menu-item" aria-label={{t "podcasts.aria"}} @route="home.podcasts">
          {{t "podcasts.title"}}
        </LinkTo>
      </li>
      <li>
        <LinkTo class="its-just-a-website-sub-menu-item" aria-label={{t "timetable.aria"}} @route="home.timetable">
          {{t "timetable.title"}}
        </LinkTo>
      </li>
      <li>
        <LinkTo class="its-just-a-website-sub-menu-item" aria-label={{t "djinquiry.aria"}} @route="home.dj-inquiry">
          {{t "djinquiry.title"}}
        </LinkTo>
      </li>
      <li>
        <div class="relative">
          <img class="absolute" style="top: -15px; left: -30px;" src="/assets/images/new.gif" alt="{{t "new"}}" />
          <LinkTo class="its-just-a-website-sub-menu-item" aria-label={{t "forum.aria"}} @route="home.forum">
            {{t "forum.title"}}
          </LinkTo>
        </div>
      </li>
      <li>
        <div class="relative">
          <img class="absolute" style="top: -15px; left: -30px;" src="/assets/images/new.gif" alt="{{t "new"}}" />
          <LinkTo class="its-just-a-website-sub-menu-item" aria-label={{t "wiki.aria"}} @route="home.wiki">
            {{t "wiki.title"}}
          </LinkTo>
        </div>
      </li>
    </ul>
  {{/if}}
</nav>
{{#if this.session.isAuthenticated}}
  <ul class="hidden md:block px-4 py-4 font-semibold text-3xl">
    <li class="flex justify-end">
      <a href="#" class role="button" aria-label="{{t "usermenu.dropdown-aria"}}" {{on "click" @toggleUserMenu}}>
        <img class="inline rounded-lg" style="height: 3rem;" align="center" src="{{this.currentUser.user.avatarUrl}}" alt={{this.currentUser.user.username}} />
      </a>
      <button class="text-white text-shadow-light hover:text-gray-400" aria-label={{t "settings.title"}} {{on "click" this.settingsDialogToggle}}>
        {{t "settings.icon"}}
      </button>
    </li>
    <li class="flex space-x-2 whitespace-nowrap">
      <span>Lv. {{this.currentUser.user.level}}</span>
      <div>
        <span class="text-xs">Ƒ</span><span>{{this.currentUser.user.fruitTicketBalance}}</span>
      </div>
      <NotificationsWindow />
    </li>
  </ul>
{{else}}
  <nav class="hidden md:flex flex-row items-start mt-4 mr-8">
    <LinkTo @route="home.sign-up" class="cool-button mr-2">
      {{t "chat.sign_up"}}
    </LinkTo>
    <button {{on "click" @toggleLoginModal}} type="button" class="cool-button" title={{t "chat.titles.login"}} data-test-login-button>
      {{t "chat.login"}}
    </button>
  </nav>
  <LinkTo aria-label={{t "home.aria"}} class="hidden md:block" @route="home.index">
    <h1 class="logo font-debussy text-5xl text-white">
      {{t "site_title_fm"}}
    </h1>
  </LinkTo>
{{/if}}
{{#unless this.fastboot.isFastBoot}}
  {{#if this.showingSettings}}
    <WebsiteSettings @closeDialog={{this.closeDialog}} />
  {{/if}}
{{/unless}}</template>
  @service
  session;

  @service
  currentUser;

  @tracked
  showingSettings = false;

  @action
  settingsDialogToggle() {
    this.showingSettings = !this.showingSettings;
  }

  @action
  closeDialog() {
    this.showingSettings = false;
  }
}
