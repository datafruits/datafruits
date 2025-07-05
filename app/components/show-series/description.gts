import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { SafeString } from 'handlebars';
import emojione from 'emojione';
import markedDown from "../../helpers/marked-down.js";

interface ShowSeriesDescriptionArgs {
  description: string | undefined;
}

export default class ShowSeriesDescription extends Component<ShowSeriesDescriptionArgs> {<template>{{markedDown this.body}}</template>
  get body(): SafeString | undefined {
    if(this.args.description) {
      return htmlSafe(emojione.shortnameToImage(this.args.description));
    } else {
      return undefined;
    }
  }
}
