import { helper } from '@ember/component/helper';

export function randomLoadingMessage() {
  let loadingMessages = [
    "musta been the onion salad dressing",
    "it's just a website",
    "this is BGS",
    "loading...",
    "STUDIO PHONE inside UK: 0116 2581 545 outside UK: 44 116 2581 545",
    "greasy hotdogs...greasy fries..."
  ];
  return loadingMessages[Math.floor(Math.random()*loadingMessages.length)];
}

export default helper(randomLoadingMessage);
