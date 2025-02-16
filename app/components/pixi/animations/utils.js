export function screenShake() {
    const element = document.getElementsByTagName('body')[0];
    element.classList.remove('screen-shake');
    // https://css-tricks.com/restart-css-animation/
    void element.offsetWidth;
    element.classList.add('screen-shake');
}

//export function blobs() {
//}
