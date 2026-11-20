import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { t } from 'ember-intl';
import type VideoStreamService from 'datafruits13/services/video-stream';

interface VisualsVideoSignature {
  Args: {
    draggable: unknown;
    styleProperties: unknown;
  };
}

export default class VisualsVideoComponent extends Component<VisualsVideoSignature> {
  initVideo = modifier((element, []) => {
    console.log('init video');
    this.videoStream.initializePlayer();
  });

  @service
  declare videoStream: VideoStreamService;

  <template>
    <video
      {{this.initVideo}}
      id="video-player"
      class="video-js vjs-default-skin vjs-16-9 vjs-big-play-centered vjs-fluid"
      preload="auto"
      playsinline
      muted
    >
      <p class="vjs-no-js">
        {{t "player.compatibility.warning"}}
        {{!-- template-lint-disable no-nested-interactive --}}
        <a
          href="http://videojs.com/html5-video-support/"
          target="_blank" rel="noopener noreferrer"
        >
          {{t "player.compatibility.linktext"}}
        </a>
      </p>
    </video>
  </template>
}
