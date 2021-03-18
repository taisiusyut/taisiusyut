import { ClientSearch } from '../ClientSearch';
import { ClientReports } from '../ClientReports';

interface OtherContentProps {
  asPath: string;
  onLeave: () => void;
  isSearching: boolean;
}

export function OtherContent({
  asPath,
  onLeave,
  isSearching
}: OtherContentProps) {
  const pathname = asPath.replace(/^\/|(\/|\?).*/g, '');
  switch (pathname) {
    case 'reports':
      return <ClientReports onLeave={onLeave} />;
  }

  if (isSearching || pathname === 'search') {
    return <ClientSearch onLeave={onLeave} />;
  }

  return null;
}
