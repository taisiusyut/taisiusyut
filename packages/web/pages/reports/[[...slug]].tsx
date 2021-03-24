import React from 'react';
import { GetServerSideProps } from 'next';
import { Meta } from '@/components/Meta';
import {
  ClientLayout,
  ClientLayoutProps
} from '@/components/client/ClientLayout';
import {
  ClientReportsPanel,
  ClientReportDetail,
  ClientReportDetailProps
} from '@/components/client/ClientReports';

type Param = {
  slug: string[];
};

export const getServerSideProps: GetServerSideProps<
  ClientReportDetailProps,
  Param
> = async context => {
  const slug = context.params?.slug || [];
  const [reportId = null] = slug;

  return {
    props: {
      reportId
    }
  };
};

export default function ClientReportPage(props: ClientReportDetailProps) {
  return (
    <>
      <Meta title="問題/建議 | 睇小說" />
      <ClientReportDetail {...props} />
    </>
  );
}

const layoutProps: ClientLayoutProps = {
  leftPanel: ClientReportsPanel
};

ClientReportPage.layout = ClientLayout;
ClientReportPage.layoutProps = layoutProps;
