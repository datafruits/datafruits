import { helper } from '@ember/component/helper';

export function aprilFools(args) {
  let today = new Date();
  return today.getMonth() === 3 && today.getDate() === 1;
}

export default helper(aprilFools);
