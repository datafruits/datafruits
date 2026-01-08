import Service from '@ember/service';
import { tracked } from "@glimmer/tracking";

export default class SiteSettings extends Service {
  @tracked audioVisualizerOn = false;

}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'site-settings': SiteSettings;
  }
}
