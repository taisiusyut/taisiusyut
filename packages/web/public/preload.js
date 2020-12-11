// @ts-check

/**
 * @typedef {{ theme?: Theme, accentColor?: AccentColor }} Preferences
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
    var preferences = storage['preferences'] || {};

    window.__setTheme(preferences['theme'] || 'dark');
    window.__setAccentColor(preferences['accentColor'] || 'blue');
  } catch (error) {
    console.log(error);
  }
})();
