import { helper } from '@ember/component/helper';

import _string from 'lodash/string';

const { startCase: _startCase } = _string;

export default helper(function startCase(string) {
  return _startCase(string);
});
