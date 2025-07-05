import t from "ember-intl/helpers/t";import type { TemplateOnlyComponent } from '@ember/component/template-only';

interface VisualsVideoSignature {
  Args: {
    draggable: unknown;
    styleProperties: unknown;
  };
}

const VisualsVideoComponent =
  <template><video id="video-player" class="video-js vjs-default-skin vjs-16-9 vjs-big-play-centered vjs-fluid" controls preload="auto" data-setup="{'fluid': true}" playsinline style={{@styleProperties}} draggable={{@draggable}} muted>
  <p class="vjs-no-js">
    {{t "player.compatibility.warning"}}
    {{!-- template-lint-disable no-nested-interactive --}}
    <a href="http://videojs.com/html5-video-support/" target="_blank" rel="noopener noreferrer">
      {{t "player.compatibility.linktext"}}
    </a>
  </p>
</video></template> satisfies TemplateOnlyComponent<VisualsVideoSignature>;

export default VisualsVideoComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Visuals::Video': typeof VisualsVideoComponent;
    'visuals/video': typeof VisualsVideoComponent;
  }
}
