import React, { useEffect, useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { TextArea } from '@/components/Input';
import { createUserForm } from '@/components/UserForm';
import { useAuth } from '@/hooks/useAuth';
import { getUser, updateUser } from '@/service';
import { UserRole, Schema$User } from '@/typings';
import { SettingsSection } from './SettingsSection';
import { Toaster } from '@/utils/toaster';
import classes from './Settings.module.scss';

const { UserForm, Email, Nickname, FormItem, useForm } = createUserForm();

const getProfileFailure = Toaster.apiError.bind(Toaster, `Get profile failure`);
const updateProfileFailure = Toaster.apiError.bind(
  Toaster,
  `Update profile failure`
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
      <UserForm
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
              <TextArea rows={4} className={classes.description} />
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
            intent="primary"
            onClick={form.submit}
            loading={updateUser.loading}
          >
            Apply
          </Button>
        </div>
      </UserForm>
    </SettingsSection>
  );
}
