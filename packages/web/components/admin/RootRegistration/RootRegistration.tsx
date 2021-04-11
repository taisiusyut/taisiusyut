import React from 'react';
import { CardWithLogo } from '@/components/CardWithLogo';
import { RootRegisterForm } from '@/components/admin/RootRegisterForm';
import classes from './RootRegistration.module.scss';

export function RootRegistration() {
  return (
    <div className={classes['classes']}>
      <CardWithLogo title={`Root\nRegistration`}>
        <RootRegisterForm />
      </CardWithLogo>
    </div>
  );
}
