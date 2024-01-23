import { helper } from '@ember/component/helper';

export function lockedFruitImagePath(params: any/*, hash*/) {
  const level = params[0];
  return `/assets/images/lv${level}_fruit.gif`;
}

export default helper(lockedFruitImagePath);
