import Ember from 'ember';

export function imagesEnabledButtonLabel(params/*, hash*/) {
  let imagesEnabled = params[0];
  if(imagesEnabled){
    return "Images are on";
  }else{
    return "Images are off";
  }
}

export default Ember.Helper.helper(imagesEnabledButtonLabel);
