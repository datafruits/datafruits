import { helper } from '@ember/component/helper';

export function randomLoadingMessage() {
  // TODO translate these
  let loadingMessages = [
    'musta been the onion salad dressing',
    "it's just a website",
    'this is BGS',
    'glorpening fruit buffers...',
    'greasy hotdogs...greasy fries...',
    'if you see viz say viz',
    'you can play anysong',
    'did you try a fruit summon?',
    'GLORP points may be awarded to the most GLORPiest',
    'check out our wiki, fruits-topi-yeah-',
    'who is the shrimpshake CEO???!',
    'get XP, level up, unlock new fruits!',
    "if you're a DJ, you gotta upload your own archives. shrimpshakeco won't do it for you sorry.",
    'recalibrating veggie filters...',
    'check your fruit alignment on your profile',
    'whats your style? chunky? grumpy? sleepy?',
  ];
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
}

export default helper(randomLoadingMessage);
