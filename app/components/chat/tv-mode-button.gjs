import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
<template><div class="flex justify-between" title={{if @enabled (t "chat.titles.video_on") (t "chat.titles.video_off")}}>
  <label id="tv-mode-input-label" for="tv-mode-input">
    {{t "chat.settings.show_video"}}
  </label>
  <input id="tv-mode-input" name="tv-mode-input" type="checkbox" class="mx-2" checked={{@enabled}} {{on "change" @toggleVideo}} />
</div>
</template>