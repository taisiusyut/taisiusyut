import React, { useEffect } from 'react';
import {
  adminPreferencesStorage,
  Preferences,
  useAdminPreferencesActions
} from '@/hooks/useAdminPreferences';
import { createForm } from '@/utils/form';
import { SettingsSection } from './SettingsSection';
import { ThemeSelector } from './ThemeSelector';
import classes from './Settings.module.scss';

const { Form, FormItem, useForm } = createForm<Preferences>({ inline: true });

export function SettingsPreferences() {
  const actions = useAdminPreferencesActions();
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(adminPreferencesStorage.get());
  }, [form]);

  return (
    <SettingsSection title="設定" className={classes['preferences']}>
      <Form form={form} onValuesChange={actions.update}>
        <FormItem name="theme" label="主題">
          <ThemeSelector />
        </FormItem>
      </Form>
    </SettingsSection>
  );
}
