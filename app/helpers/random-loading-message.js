import { helper } from '@ember/component/helper';

export function randomLoadingMessage() {
  let loadingMessages = [
    'musta been the onion salad dressing',
    "it's just a website",
    'this is BGS',
    'loading...',
    'greasy hotdogs...greasy fries...',
  ];
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
}

export default helper(randomLoadingMessage);
