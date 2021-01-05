// @ts-check

/**
 * @typedef {{
 *  theme?: Theme,
 *  accentColor?: AccentColor,
 *  fixWidth?: boolean,
 *  pagingDisplay?: boolean
 *  fontSize?: number
 *  lineHeight?: string
 * }} Preferences
 */

(function () {
  window.__setTheme = function (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList[theme === 'dark' ? 'add' : 'remove'](
      'bp3-dark'
    );
  };

  window.__setAccentColor = function (color) {
    document.documentElement.setAttribute('data-accent-color', color);
  };

  window.__setFixWidth = function (flag) {
    document.documentElement.setAttribute(
      'data-width',
      flag ? 'fixed' : 'stretch'
    );
  };

  window.__setPagingDisplay = function (flag) {
    document.documentElement.setAttribute(
      'data-display',
      flag ? 'paging' : 'single'
    );
  };
  /** @type {Preferences}} */
  var preferences = {};
  try {
    var keys = {
      root: 'taisiusyut',
      admin: 'admin',
      client: 'client'
    };

    /** @type {Record<string, Record<string, any>>} */
    var rootStorage = JSON.parse(localStorage.getItem(keys.root) || '{}');
    var storageKey = /^\/admin/.test(window.location.pathname)
      ? keys.admin
      : keys.client;

    /** @type {{ preferences?: Preferences }} */
    var storage = rootStorage[storageKey] || {};

    /** @type {Preferences}} */
    preferences = storage['preferences'] || {};
  } catch (error) {
    console.log(error);
  }

  window.__setTheme(preferences['theme'] || 'dark');
  window.__setAccentColor(preferences['accentColor'] || 'blue');
  window.__setFixWidth(
    typeof preferences['fixWidth'] === 'undefined'
      ? true
      : preferences['fixWidth']
  );
  window.__setPagingDisplay(
    typeof preferences['pagingDisplay'] === 'undefined'
      ? true
      : preferences['pagingDisplay']
  );

  function setViewHeightVariable() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  setViewHeightVariable();
  window.addEventListener('resize', setViewHeightVariable);

  function handleChapterContentStyle() {
    var fontSize = preferences['fontSize'];
    var lineHeight = preferences['lineHeight'];
    if (fontSize || lineHeight) {
      /** @type {HTMLElement[]} */
      var els = Array.prototype.slice.call(
        document.querySelectorAll(`[id^="chapter-"]`)
      );
      els.forEach(function (el) {
        // prettier-ignore
        el.setAttribute('style', 'font-size: ' + (fontSize || 18) + 'px; line-height: ' + (lineHeight || '1.5em'))
      });
    }
  }
  handleChapterContentStyle();
})();
