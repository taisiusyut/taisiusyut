import React from 'react';
import { ThemeSelector } from '@/components/ThemeSelector';
import { Preferences, useAdminPreferences } from '@/hooks/useAdminPreferences';
import { SettingsSection } from './SettingsSection';
import { createForm } from '@/utils/form';
import classes from './Settings.module.scss';

const { Form, FormItem } = createForm<Preferences>({ inline: true });

export function SettingsPreferences() {
  const [initialValues, actions] = useAdminPreferences();

  return (
    <SettingsSection title="Preferences" className={classes['preferences']}>
      <Form initialValues={initialValues} onValuesChange={actions.update}>
        <FormItem name="theme" label="Theme">
          <ThemeSelector />
        </FormItem>
      </Form>
    </SettingsSection>
  );
}
