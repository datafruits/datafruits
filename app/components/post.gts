import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { SafeString } from 'handlebars';
import emojione from 'emojione';
import type PostModel from 'datafruits13/models/post';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LinkTo } from "@ember/routing";
import Badges from "./user/badges.ts";
import markedDown from "../helpers/marked-down.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

interface PostSignature {
  Args: {
    post: PostModel;
  };
}

export default class Post extends Component<PostSignature> {<template>  <section class="flex bg-df-pink my-2 py-4 rounded-lg post">
    <span class="p-4 shrink-0" style="height: 10rem; width: 10rem; flex-shrink: 0;">
      <img class="rounded-lg inline self-center object-none" style="height: 10rem; width: 100%;" align="center" alt="{{@post.posterUsername}}" src="{{@post.posterAvatar}}" />
    </span>
    <section class="flex flex-col grow">
      <span class="user-info mb-2">
        <LinkTo @route="home.dj" @model={{@post.posterUsername}} class="text-3xl df-text-yellow">
          {{@post.posterUsername}}
        </LinkTo>
        <span>{{this.formattedDate}}</span>
        <Badges @role={{@post.posterRole}} />
      </span>
      <p class="bg-df-blue-dark p-4 forum-post">
        {{markedDown this.body}}
      </p>
    </section>
  </section></template>
  get body(): SafeString {
    return htmlSafe(emojione.shortnameToImage(this.args.post.body));
  }

  get formattedDate(): string {
    const timeZone = dayjs.tz.guess();
    return dayjs(this.args.post.createdAt).tz(timeZone).format('LLL');
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Post: typeof Post;
  }
}

