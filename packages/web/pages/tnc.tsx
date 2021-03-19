import { ClientHeader, ClientLayout } from '@/components/client/ClientLayout';
import { GoBackButton } from '@/components/GoBackButton';
import { TNC } from '@/components/TNC';

export default function TNCPage() {
  return (
    <>
      <ClientHeader title="使用條款及免責聲明" left={<GoBackButton />} />
      <TNC />
    </>
  );
}

TNCPage.layout = ClientLayout;
