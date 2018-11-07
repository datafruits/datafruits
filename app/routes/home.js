import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Route.extend({
  i18n: service(),
  fastboot: service(),
  model(){
    return this.store.queryRecord('scheduled-show', {next: true});
  },
  afterModel(){
    if(!this.get('fastboot.isFastBoot')){
      let locales = this.get('i18n.locales');
      let language = navigator.languages[0] || navigator.language || navigator.userLanguage;
      language = locales.includes(language.toLowerCase()) ? language : 'en';

      this.set('i18n.locale', language)
    }
  },

  refreshNext() {
    later(() => {
      this.model();
      this.refreshNext();
    }, 60000);
  },

  afterModel() {
   this.setHeadTags();
  },

  setHeadTags() {
   const headTags = [
     {
       type: 'meta',
       attrs: {
         name: 'twitter:card',
         content: 'player'
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:site',
         content: '@datafruits'
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:creator',
         content: '@datafruits'
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:title',
         content: `datafruits.fm`
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:description',
         content: 'its just a website'
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:player',
         content: "https://datafruits.fm/container"
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:player:width',
         content: "480"
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:player:height',
         content: "80"
       },
     },
   ];

   this.set('headTags', headTags);
  }
});
