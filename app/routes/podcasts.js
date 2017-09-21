import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  model(){
  fastboot: service(),

  model(){
    let shoebox = this.get('fastboot.shoebox');
    let shoeboxStore = shoebox.retrieve('my-store');
    let isFastBoot = this.get('fastboot.isFastBoot');

    if (isFastBoot) {
      if (!shoeboxStore) {
        shoeboxStore = {};
        shoebox.put('my-store', shoeboxStore);
      }

      return hash({
        tracks: this.store.queryRecord('podcast', { name: 'datafruits' }).then((podcast) => {
          let tracks = podcast.get('tracks');
          if(!shoeboxStore.track){
            shoeboxStore.tracks = [];
            tracks.forEach((track) => {
              shoeboxStore.tracks.pushObject(track);
            });
          }
          return tracks;
        }),
        labels: this.store.findAll('label')
      });
    return shoeboxStore;
  }
});
