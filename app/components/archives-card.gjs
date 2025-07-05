import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { LinkTo } from "@ember/routing";

export default class ArchivesCardComponent extends Component {<template><div class="m-3 classic:bg-df-pink blm:bg-black rounded-lg border-4 border-white flex flex-col items-center justify-between w-full md:w-1/4 p-2 shadow-md">
  <div class="self-center w-full h-full">
    <LinkTo @route="home.show" @model={{@scheduledShow.id}} class="h-80 bg-center bg-cover block overflow-hidden rounded-xl" style="{{this.backgroundStyle}}">
    </LinkTo>
  </div>
  <LinkTo @route="home.show" @model={{@scheduledShow.id}}>
    {{@track.title}}
  </LinkTo>
</div>
</template>
  get backgroundStyle() {
    let imageUrl;
    const image = this.args.image;
    if (image) {
      imageUrl = image;
    } else {
      imageUrl = '/assets/images/show_placeholder.jpg';
    }
    return htmlSafe(`background-image: url('${imageUrl}');`);
  }
}
