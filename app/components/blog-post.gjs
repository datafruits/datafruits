import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { LinkTo } from "@ember/routing";

export default class BlogPost extends Component {<template><h3>
  <LinkTo @route="home.blogs.show" @model={{this.post.id}}>
    {{this.body.title}}
  </LinkTo>
</h3>
<article class="blog-post">
  {{this.body.htmlSafeBody}}
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
