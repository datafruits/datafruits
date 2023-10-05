import { helper } from '@ember/component/helper';

export function lengthInHours(params/*, hash*/) {
  const startDate = params[0];
  const endDate = params[1];
  return parseInt(endDate.split(":")[0]) - new Date(startDate).getHours();
}

export default helper(lengthInHours);
