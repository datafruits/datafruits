import Component from '@glimmer/component';
import { service } from '@ember/service';

interface WikiArticleSignature {
  Args: {
    page: {
      body?: string;
      title?: string;
      slug?: string;
    };
  };
}

export default class WikiArticle extends Component<WikiArticleSignature> {
  @service declare session: any;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    WikiArticle: typeof WikiArticle;
  }
}