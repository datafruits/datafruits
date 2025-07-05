import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import dayjs, { Dayjs } from "dayjs";
import { BufferedChangeset } from 'ember-changeset/types';
import changeset from "ember-changeset/helpers/changeset";
import ChangesetForm from "../ui/changeset-form.gts";
import t from "ember-intl/helpers/t";
import formatDay from "../../helpers/format-day.js";
import formatTime from "../../helpers/format-time.js";
import { on } from "@ember/modifier";
import TimePicker from "../time-picker.gts";
import TrackUploader from "../track-uploader.gts";
import RecordingsSearch from "./recordings-search.gts";
import pick from "ember-composable-helpers/helpers/pick";
import set from "ember-set-helper/helpers/set";
import eq from "ember-truth-helpers/helpers/equal";
import LabelsSelect from "../labels-select.gts";
import Button from "@frontile/buttons/components/button";
import or from "ember-truth-helpers/helpers/or";
import includes from "ember-composable-helpers/helpers/includes";

interface MyShowsEpisodeFormArgs {
  episode: ScheduledShow;
}

export default class MyShowsEpisodeForm extends Component<MyShowsEpisodeFormArgs> {<template>{{#let (changeset @episode this.EpisodeValidations) as |changeset|}}
  <ChangesetForm @changeset={{changeset}} @onError={{this.onError}} @onSubmit={{this.onSubmit}} as |Form|>
      <section class="flex">
        <div>
          <Form.Input @label={{t "profile.my-shows.form.title"}} @fieldName="title" @containerClass="mb-2" />
          <div>
            <div>
              <span>Air date:</span> {{formatDay @episode.start}} - {{formatTime @episode.start}}
            </div>
            <label class="align-top" for="show-artwork"> {{t "profile.my-shows.form.artwork"}}</label>
            <br />
            {{#if @episode.isNew}}
              {{#if changeset.image}}
                <img alt="artwork" width="300" height="300" src="{{changeset.image}}">
              {{/if}}
            {{else}}
              {{#if changeset.thumbImageUrl}}
                <img alt="artwork" width="300" height="300" src="{{changeset.thumbImageUrl}}">
              {{/if}}
            {{/if}}
            <input class="py-4 px-4 my-2 text-df-yellow w-full semibold border-dashed" id="showArtwork" name="showArtwork" type="file" {{on "change" this.updateFile}} />
          </div>
          <Form.Textarea @label={{t "profile.my-shows.form.description"}} @fieldName="description" @containerClass="mb-2" @size="lg" @value={{changeset.description}} rows="20" cols="50" />
          <TimePicker @property="start" @changeset={{changeset}} @onChange={{this.setEndAfterStart}} />
          <TimePicker @property="end" @changeset={{changeset}} @startTime={{changeset.start}} />
          {{#if @episode.airDatePassed}}
            <h2 class="text-x">
              ARCHIVE
            </h2>
            <Form.Checkbox @type="checkbox" @label={{t "profile.my-shows.form.prerecorded-archive"}} id="use-prerecord" @fieldName="usePrerecordedFileForArchive" />
            <TrackUploader @changeset={{changeset}} />
            {{#if @episode.prerecordTrackFilename}}
              <span>{{@episode.prerecordTrackFilename}}</span>
            {{/if}}
            <div class="mb-2">
              <h3 class="text-l">
                Select recording
              </h3>
              <RecordingsSearch @changeset={{changeset}} />
            </div>
            <Form.Input @label={{t "profile.my-shows.form.youtube-link"}} @fieldName="youtubeLink" @containerClass="mb-2" />
            <Form.Input @label={{t "profile.my-shows.form.mixcloud-link"}} @fieldName="mixcloudLink" @containerClass="mb-2" />
            <Form.Input @label={{t "profile.my-shows.form.soundcloud-link"}} @fieldName="soundcloudLink" @containerClass="mb-2" />
            <label for="archive-status">Archive Status</label>
            <select id="archive-status" {{on "change" (pick "target.value" (set changeset "status"))}}>
              {{#each-in this.statusOptions as |key val|}}
                <option value="{{val}}" selected={{eq changeset.status val}}>
                  {{key}}
                </option>
              {{/each-in}}
            </select>
          {{else}}
            <h2 class="text-x">
              {{t "profile.my-shows.form.prerecorded-set"}}
            </h2>
            <TrackUploader @changeset={{changeset}} @onStartUpload={{this.onStartUpload}} @onFinishUpload={{this.onFinishUpload}} />
            {{#if changeset.prerecordTrackId}}
              {{changeset.prerecordTrackFilename}}
            {{/if}}
          {{/if}}
        </div>
      </section>
      <LabelsSelect class="mb-2" @changeset={{changeset}} />
      <div class="mb-4">
        <Button @type="submit" @intent="primary" disabled={{(or (eq this.isUploading true) (or Form.state.hasSubmitted changeset.isInvalid))}} class="cool-button mb-2">
          {{t "profile.my-shows.form.update"}}
        </Button>
      </div>
      {{#if (or (eq this.currentUser.user.username @episode.hostedBy) (includes "admin" this.currentUser.user.roles))}}
        <div>
          <Button @type="submit" @intent="danger" class="cool-button mb-2 danger" {{on "click" this.deleteEpisode}}>
            {{t "profile.my-shows.form.delete"}}
          </Button>
        </div>
      {{/if}}
  </ChangesetForm>
{{/let}}</template>
  @service declare router: any;
  @service declare currentUser: any;

  file: Blob | null = null;

  statusOptions = {
    "Published": "archive_published",
    "Unpublished": "archive_unpublished"
  };

  @tracked isUploading: boolean = false;

  @action
  onStartUpload() {
    this.isUploading = true;
  }

  @action
  onFinishUpload() {
    this.isUploading = false;
  }

  @action updateFile(e: any){
    this.file = e.target.files[0];
    this.args.episode.imageFilename = e.target.files[0].name;
    const reader = new FileReader();

    reader.onload = (e) => {
      this.args.episode.image = e.target?.result as string;
    };
    reader.onerror = (e) => {
      console.log('error reading file');
      console.log(e);
    };

    reader.readAsDataURL(this.file as Blob);
  }

  @action
  onSubmit(result: any) {
    this.router.transitionTo('home.shows.episode', result);
  }

  @action
  onError() {
    console.log('couldnt ssave show');
  }

  @action
  deleteEpisode() {
    confirm("Are you sure?!!!");
    this.args.episode.destroyRecord().then(() => {
      alert("Goodbye episode. :(");
      //redirect to /my-shows
      this.router.transitionTo('home.user.my-shows');
    });
  }

  @action
  setEndAfterStart(startTime: Dayjs, changeset: BufferedChangeset) {
    if(startTime.hour() > dayjs(changeset.get('endAt')).hour()) {
      console.log('setting end time to: ', startTime.add(1, 'hour').hour());
      changeset.set('endTime', startTime.add(1, 'hour'));
    }
  }
}
