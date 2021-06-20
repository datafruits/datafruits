import Service from '@ember/service';

export default class ThemeService extends Service {
  setTheme(theme) {
    let element = document.getElementsByTagName('html')[0];
    let currentTheme = `theme-${localStorage.getItem('datafruits-theme') || 'classic'}`;
    element.classList.remove(currentTheme);
    let themeName = `theme-${theme}`;
    element.classList.add(themeName);
    localStorage.setItem('datafruits-theme', theme);
  }
}
