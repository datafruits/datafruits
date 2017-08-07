# fastboot-transform
Transforms given broccoli tree that contains browser API to be fastboot complaint.

# Usage
If you library here at `a/b/c.js` contains:
```js
window.foo = bar;
```

The above file is not compatible in FastBoot. Therefore, you will need to wrap it as:

```js
var fastboot-transform = require('fastboot-transform');

fastboot-transform(new Funnel('a/b/c.js'));
```

The result of the above is:
```js
if (typeof FastBoot === 'undefined') {
 window.foo = bar;
}
```
