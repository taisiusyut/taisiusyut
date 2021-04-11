import React from 'react';
import { RootRegistration } from '@/components/admin/RootRegistration';
import { UserRole } from '@/typings';

export default function RootRegistrationPage() {
  return <RootRegistration />;
}

RootRegistrationPage.access = [UserRole.Root];
RootRegistrationPage.redirect = '/';
