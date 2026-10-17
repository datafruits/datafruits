import { action } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { htmlSafe } from "@ember/template";
import { SafeString } from "handlebars";

export default class DjController extends Controller {
  @service router;
  @service('emoji-zone') emojiZone;
  queryParams = ["page"];

  @action
  browseLabel(label) {
    this.router.transitionTo("home.podcasts", {
      queryQueryParams: { tags: label.name },
    });
  }

  get modelBio() {
    if (!this.model.bio) return undefined;
    
    // Replace standard :shortname: patterns with local custom emoji assets via EmojiZoneService
    let parsedBio = this.model.bio.replace(/:([a-zA-Z0-9_+-]+):/g, (match, name) => {
      return this.emojiZone.htmlFor(name) || match;
    });

    return htmlSafe(parsedBio);
  }

  get qualifiedHomepageUrl() {
    let pattern = /^http(s?):\/\//;
    if (this.model.homepage && pattern.test(this.model.homepage)) {
      return this.model.homepage;
    } else {
      return `https://${this.model.homepage}`;
    }
  }
}