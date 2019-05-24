import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    browseLabel(label){
      this.transitionToRoute('home.podcasts', { queryParams: { tags: label.name } });
    }
  }
});
