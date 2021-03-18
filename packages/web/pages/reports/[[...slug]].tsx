import React from 'react';
import { GetServerSideProps } from 'next';
import { ClientLayout } from '@/components/client/ClientLayout';
import {
  ClientReportDetail,
  ClientReportDetailProps
} from '@/components/client/ClientReports/ClientReportDetail';
import { Meta } from '@/components/Meta';

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

ClientReportPage.layout = ClientLayout;