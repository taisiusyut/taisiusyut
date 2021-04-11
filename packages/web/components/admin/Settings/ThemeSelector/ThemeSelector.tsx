import React from 'react';
import { Control } from '@/utils/form';
import classes from './ThemeSelector.module.scss';

export function ThemeSelector({ value, onChange }: Control<Theme>) {
  const handleChange = onChange || (() => void 0);
  const lightClassName = [
    classes['theme'],
    classes['light'],
    value === 'light' ? classes['active'] : ''
  ];
  const darkClassName = [
    classes['theme'],
    classes['dark'],
    value === 'dark' ? classes['active'] : ''
  ];

  return (
    <div className={classes['theme-selector']}>
      <div className={lightClassName.join(' ').trim()}>
        <div onClick={() => handleChange('light')} />
      </div>
      <div className={darkClassName.join(' ').trim()}>
        <div onClick={() => handleChange('dark')} />
      </div>
    </div>
  );
}
