import { helper } from '@ember/component/helper';

export default helper(function formatTime(params/*, hash*/) {
  let seconds = Math.floor(params[0] % 60);
  let minutes = Math.floor(params[0] / 60);
  let hours = Math.floor(params[0] / 60 / 60);
  if(seconds < 10){
    seconds = `0${seconds}`;
  }
  if(minutes < 10){
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}:${seconds}`;
});
