// refrences:
// https://antoinevastel.com/bot%20detection/2018/01/17/detect-chrome-headless-v2.html
// https://blog.shapesecurity.com/2015/01/22/detecting-phantomjs-based-visitors/

import platform from 'platform';

export function isHeadless(): false | Record<string, boolean> {
  const hasHeadlessChromeUA = /HeadlessChrome/.test(window.navigator.userAgent);
  const hasWebdriver = !!navigator.webdriver;
  const isChrome = /chrome/i.test(platform.name || '');
  const windowChromeNotFound = !('chrome' in window);

  const hasPhantomJSUA = /PhantomJS/.test(window.navigator.userAgent);
  const hasPhantomJSProps = 'callPhantom' in window || '_phantom' in window;
  const noFuntionBind = !Function.prototype.bind;

  const isHeadLessChrome =
    hasHeadlessChromeUA || hasWebdriver || (isChrome && windowChromeNotFound);
  const isPhantomJS = hasPhantomJSUA || hasPhantomJSProps || noFuntionBind;

  if (isHeadLessChrome || isPhantomJS) {
    return {
      hasHeadlessChromeUA,
      hasWebdriver,
      isChrome,
      windowChromeNotFound,
      hasPhantomJSUA,
      hasPhantomJSProps,
      noFuntionBind
    };
  }

  return false;
}
