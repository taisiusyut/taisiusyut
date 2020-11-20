import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { createUserForm } from '@/components/UserForm';
import type { ContentEditorProps } from '@/components/admin/ContentEditor';
import { useAuth } from '@/hooks/useAuth';
import { getUser, updateUser } from '@/service';
import { UserRole, Schema$User } from '@/typings';
import { SettingsSection } from './SettingsSection';
import { Toaster } from '@/utils/toaster';
import classes from './Settings.module.scss';

const { Form, FormItem, Email, Nickname, useForm } = createUserForm();

const getProfileFailure = Toaster.apiError.bind(Toaster, `Get profile failure`);
const updateProfileFailure = Toaster.apiError.bind(
  Toaster,
  `Update profile failure`
);

const ContentEditor = dynamic<ContentEditorProps>(() =>
  import(`@/components/admin/ContentEditor`).then(
    ({ ContentEditor }) => ContentEditor
  )
);

const useProfile = () => {
  const [{ user }, { updateProfile }] = useAuth();
  const { user_id } = user || {};

  const [{ loading }, { fetch }] = useRxAsync(getUser, {
    defer: true,
    onSuccess: updateProfile,
    onFailure: getProfileFailure
  });

  useEffect(() => {
    user_id && fetch({ id: user_id });
  }, [fetch, user_id]);

  return { user, loading };
};

const useUpdateUser = () => {
  const [, { updateProfile }] = useAuth();
  const [onSuccess] = useState(() => (user: Schema$User) => {
    updateProfile(user);
    Toaster.success({ message: `Profile update success` });
  });
  const [{ loading }, { fetch }] = useRxAsync(updateUser, {
    defer: true,
    onSuccess,
    onFailure: updateProfileFailure
  });
  return { loading, fetch };
};

export function SettingsProfile() {
  const [form] = useForm();
  const { user } = useProfile();
  const updateUser = useUpdateUser();

  return (
    <SettingsSection title="Profile" className={classes['profile']}>
      <Form
        form={form}
        key={JSON.stringify(user)}
        initialValues={user ? user : undefined}
        onFinish={payload =>
          user && updateUser.fetch({ id: user.user_id, ...payload })
        }
      >
        <Nickname />
        <Email />

        {user?.role === UserRole.Author && (
          <>
            <FormItem label="Description" name="description">
              <ContentEditor className={classes.description} />
            </FormItem>
          </>
        )}

        <div className={classes['footer']}>
          <Button
            onClick={() => form.resetFields()}
            disabled={updateUser.loading}
          >
            Reset
          </Button>
          <Button
            type="submit"
            intent="primary"
            onClick={form.submit}
            loading={updateUser.loading}
          >
            Apply
          </Button>
        </div>
      </Form>
    </SettingsSection>
  );
}
