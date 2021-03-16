import { ClientHeader, ClientLayout } from '@/components/client/ClientLayout';
import { GoBackButton } from '@/components/GoBackButton';
import { TNCContent } from '@/components/TNCContent';

export default function TNCPage() {
  return (
    <>
      <ClientHeader title="使用條款及免責聲明" left={<GoBackButton />} />
      <TNCContent />
    </>
  );
}

TNCPage.layout = ClientLayout;
