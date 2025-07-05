import Component from '@glimmer/component';
import type Label from 'datafruits13/models/label';
import { LinkTo } from "@ember/routing";
import { hash } from "@ember/helper";

interface TrackLabelArgs {
  label: Label;
}

 
export default class TrackLabel extends Component<TrackLabelArgs> {<template><LinkTo class="track-label
    text-df-yellow
    classic:bg-df-pink
    blm:bg-black
    hover:text-white
    p-1
    uppercase
    border-solid
    border-white
    border-2
    mx-2
    font-extrabold" @route="home.podcasts" @query={{hash tags=@label.name}}>
  {{@label.name}}
</LinkTo></template>
}
