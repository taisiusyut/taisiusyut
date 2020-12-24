interface PageEventProps {
  event: string;
  page: string;
  userId?: string;
}

export const GTMPageView = (url: string, userId?: string) => {
  const pageEvent: PageEventProps = {
    event: 'pageview',
    page: url,
    userId
  };
  window && window.dataLayer && window.dataLayer.push(pageEvent);
  return pageEvent;
};
