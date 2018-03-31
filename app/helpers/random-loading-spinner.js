import { helper } from '@ember/component/helper';

export function randomLoadingSpinner() {
  let loadingSpinners = [
    "/assets/images/jambox_spin.gif",
    "/assets/images/anotherpizza_rotate.gif",
    "/assets/images/datacoin.gif"
  ];
  return loadingSpinners[Math.floor(Math.random()*loadingSpinners.length)];
}

export default helper(randomLoadingSpinner);
