import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { LinkTo } from "@ember/routing";

export default class BlogPostPreview extends Component {<template><h3>
  <LinkTo @route="home.blogs.show" @model={{@post.id}}>
    {{this.body.title}}
  </LinkTo>
</h3>
<article>
  <img width="300" src={{this.body.previewImage.cdnUrl}} alt={{this.body.previewImage.imageFileName}}>
</article>
</template>
  @service
  intl;

  get body() {
    let body = this.args.post.blogPostBodies.filter((body) => {
      return body.language == this.intl.locale;
    }).firstObject;
    if (!body) {
      body = this.args.post.blogPostBodies.filter((body) => {
        return body.language == 'en';
      }).firstObject;
    }
    return body;
  }
}
