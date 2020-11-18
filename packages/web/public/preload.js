// @ts-check

/**
 * @typedef {{ theme: Theme, accentColor: AccentColor }} Preferences
 */

(function () {
  try {
    var keys = {
      root: 'taisiusyut',
      admin: 'taisiusyut/admin',
      client: 'taisiusyut/client'
    };

    /** @type {Record<string, Record<string, any>>} */
    var rootStorage = JSON.parse(localStorage.getItem(keys.root) || '{}');
    var storageKey = /^\/admin/.test(window.location.pathname)
      ? keys.admin
      : keys.client;

    /** @type {{ preferences?: Preferences }} */
    var storage = rootStorage[storageKey] || {};

    /** @type {Preferences}} */
    var preferences = storage['preferences'] || {
      theme: 'light',
      accentColor: 'blue'
    };

    /**
     * @param {Preferences} preferences
     */
    var save = function (preferences) {
      storage['preferences'] = preferences;
      rootStorage[storageKey] = storage;
      localStorage.setItem(keys.root, JSON.stringify(rootStorage));
    };

    window.__setTheme = function (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList[theme === 'dark' ? 'add' : 'remove'](
        'bp3-dark'
      );
      preferences['theme'] = theme;
      save(preferences);
    };
    window.__setTheme(preferences.theme);

    window.__setAccentColor = function (color) {
      document.documentElement.setAttribute('data-accent-color', color);
      preferences['accentColor'] = color;
      save(preferences);
    };
    window.__setAccentColor(preferences.accentColor);
  } catch (error) {
    console.log(error);
  }
})();
