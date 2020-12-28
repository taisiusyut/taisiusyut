interface PageEventProps {
  event: string;
  page: string;
}

export const GTMPageView = (url: string) => {
  const pageEvent: PageEventProps = {
    event: 'pageview',
    page: url
  };
  window && window.dataLayer && window.dataLayer.push(pageEvent);
  return pageEvent;
};
