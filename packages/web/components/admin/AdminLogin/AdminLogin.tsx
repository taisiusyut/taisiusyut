import React from 'react';
import { CardWithLogo } from '@/components/CardWithLogo';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import classes from './AdminLogin.module.scss';

export function AdminLogin() {
  return (
    <div className={classes['container']}>
      <CardWithLogo title="睇小說">
        <AdminLoginForm />
      </CardWithLogo>
    </div>
  );
}
