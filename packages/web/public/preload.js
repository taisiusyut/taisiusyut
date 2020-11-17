// @ts-check

/**
 * @typedef {{ theme: Theme }} Preferences
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

    /** @type {{ theme: Theme }}} */
    var preferences = storage['preferences'] || { theme: 'light' };

    window.__setTheme = function (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList[theme === 'dark' ? 'add' : 'remove'](
        'bp3-dark'
      );
      preferences['theme'] = theme;
      storage['preferences'] = preferences;
      rootStorage[storageKey] = storage;
      localStorage.setItem(keys.root, JSON.stringify(rootStorage));
    };

    window.__setTheme(preferences.theme);
  } catch (error) {
    console.log(error);
  }
})();
