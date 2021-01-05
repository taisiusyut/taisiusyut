import React from 'react';
import { ClientHeader, ClientLayout } from '@/components/client/ClientLayout';
import { GoBackButton } from '@/components/GoBackButton';

export default function FAQPage() {
  return (
    <>
      <ClientHeader title="FAQ" left={<GoBackButton />} />
      <div
        style={{
          height: `100%`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        Working In Progress
      </div>
    </>
  );
}

FAQPage.layout = ClientLayout;
