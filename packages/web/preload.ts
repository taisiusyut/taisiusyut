/* eslint-disable no-var  */

interface IPreferences {
  theme?: Theme;
  accentColor?: AccentColor;
  fixWidth?: boolean;
  pagingDisplay?: boolean;
  fontSize?: number;
  lineHeight?: string;
}

export function preload() {
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

  var preferences: IPreferences = {};
  try {
    var keys = {
      root: 'taisiusyut',
      admin: 'admin',
      client: 'client'
    };

    var rootStorage: Record<string, Record<string, any>> = JSON.parse(
      localStorage.getItem(keys.root) || '{}'
    );
    var storageKey = /^\/admin/.test(window.location.pathname)
      ? keys.admin
      : keys.client;

    var storage = rootStorage[storageKey] || {};

    preferences = storage['preferences'] || {};
  } catch (error) {
    // eslint-disable-next-line
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
      var els = Array.prototype.slice.call(
        document.querySelectorAll('[id^="chapter-"]')
      );
      els.forEach(function (el) {
        // prettier-ignore
        el.setAttribute('style', 'font-size: ' + (fontSize || 18) + 'px; line-height: ' + (lineHeight || '1.5em'));
      });
    }
  }

  // https://stackoverflow.com/a/13382873
  function getScrollbarWidth() {
    // Creating invisible container
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    var inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    var scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Removing temporary elements from the DOM
    outer.parentNode && outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }

  window.addEventListener('load', function () {
    if (getScrollbarWidth()) {
      document.documentElement.setAttribute('custom-scrollbar', '');
    }
    handleChapterContentStyle();
  });
}
