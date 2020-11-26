import React from 'react';
import { ClientLayout } from '@/components/client/ClientLayout';
import { ClientHome } from '@/components/client/ClientHome';

export default function HomePage() {
  return <ClientHome />;
}

HomePage.layout = ClientLayout;
