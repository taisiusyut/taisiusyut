import React from 'react';
import { ClientHeader, ClientLayout } from '@/components/client/ClientLayout';
import { GoBackButton } from '@/components/GoBackButton';

export default function FAQPage() {
  return (
    <>
      <ClientHeader title="常見問題" left={<GoBackButton />} />
      <div
        style={{
          height: `100%`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        未諗到
      </div>
    </>
  );
}

FAQPage.layout = ClientLayout;
