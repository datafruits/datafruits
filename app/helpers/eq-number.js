import { helper } from '@ember/component/helper';

export default helper(function eqNumber(params) {
  return parseInt(params[0]) === parseInt(params[1]);
});
