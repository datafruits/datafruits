import Model, { attr } from '@ember-data/model';

export default class Recording extends Model {
  @attr('string') declare filesize: string;
  @attr('string') declare path: string;
  @attr('string') declare processingStatus: string;
  //@service session;

  get unprocessed() {
    return this.processingStatus === 'unprocessed';
  }
  get processing() {
    return this.processingStatus === 'processing';
  }
  get processed() {
    return this.processingStatus === 'processed';
  }
  get processingFailed() {
    return this.processingStatus === 'processing_failed';
  }

  get filename() {
    return this.path.split("/home/deploy/datafruits/recordings/")[1];
  }

  // get downloadLink() {
  //   return `${ENV.API_HOST}/recordings/${this.id}?token=${this.session.data.authenticated.token}`;
  // }
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'recording': Recording;
  };;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
}
