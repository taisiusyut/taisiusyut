import React from 'react';
import { CardWithLogo } from '@/components/CardWithLogo';
import { RootRegisterForm } from '@/components/admin/RootRegisterForm';
import { UserRole } from '@fullstack/server/dist/typings';

export default function RootRegistration() {
  return (
    <div className="container">
      <CardWithLogo title={`Root\nRegistration`}>
        <RootRegisterForm />
      </CardWithLogo>
      <style jsx>
        {`
          .container {
            @include absolute(0, null, null 0);
            @include sq-dimen(100%);
            @include flex(center, center);
          }
        `}
      </style>
    </div>
  );
}

RootRegistration.access = [UserRole.Root];
RootRegistration.redirect = '/';
