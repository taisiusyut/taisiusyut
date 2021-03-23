import { ClientSearch } from '../ClientSearch';
import { ClientReportsPanel } from '../ClientReports';

interface OtherContentProps {
  asPath: string;
  onLeave: () => void;
  isSearching: boolean;
}

export function ClientLeftPanelContent({
  asPath,
  onLeave,
  isSearching
}: OtherContentProps) {
  const pathname = asPath.replace(/^\/|(\/|\?).*/g, '');
  switch (pathname) {
    case 'reports':
      return <ClientReportsPanel onLeave={onLeave} />;
  }

  if (isSearching || pathname === 'search') {
    return <ClientSearch onLeave={onLeave} />;
  }

  return null;
}
