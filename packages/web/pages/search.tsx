import React from 'react';
import {
  ClientHeader,
  ClientLayout,
  ClientLayoutProps
} from '@/components/client/ClientLayout';
import { ClientSearchPanel } from '@/components/client/ClientSearch';

export default function SearchPage() {
  return <ClientHeader />;
}

const layoutProps: ClientLayoutProps = {
  leftPanel: ClientSearchPanel
};

SearchPage.layout = ClientLayout;
SearchPage.layoutProps = layoutProps;
