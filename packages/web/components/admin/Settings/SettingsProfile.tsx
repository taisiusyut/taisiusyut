import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { createUserForm } from '@/components/UserForm';
import type { ContentEditorProps } from '@/components/admin/ContentEditor';
import { useAuth, useAuthActions } from '@/hooks/useAuth';
import {
  clearJwtToken,
  getJwtToken,
  getProfile,
  updateProfile as updateProfileAPI
} from '@/service';
import { UserRole, Schema$User, Param$UpdateUser } from '@/typings';
import { SettingsSection } from './SettingsSection';
import { Toaster } from '@/utils/toaster';
import classes from './Settings.module.scss';

const { Form, FormItem, Email, Nickname, useForm } = createUserForm();

const ContentEditor = dynamic<ContentEditorProps>(
  () =>
    import(
      /* webpackChunkName: "chapters-list-drawer" */ `@/components/admin/ContentEditor`
    ).then(({ ContentEditor }) => ContentEditor),
  { ssr: false }
);

const useUpdateProfile = () => {
  const { updateProfile } = useAuthActions();
  const [{ request, onSuccess, onFailure }] = useState(() => ({
    request: async (payload: Param$UpdateUser) => {
      const result = await updateProfileAPI(payload);
      // clear and get the new token
      // This make sure the checking of `nickname` in `routes.auth.profile` is correct
      clearJwtToken();
      await getJwtToken();
      return result;
    },
    onSuccess: (user: Schema$User) => {
      updateProfile(user);
      Toaster.success({ message: `Update profile success` });
    },
    onFailure: Toaster.apiError.bind(Toaster, `Update profile failure`)
  }));
  const [{ loading }, { fetch }] = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure
  });
  return { loading, update: fetch };
};

const getProfileFailure = Toaster.apiError.bind(Toaster, `Get profile failure`);

export function SettingsProfile() {
  const [form] = useForm();
  const [{ user }, { updateProfile }] = useAuth();
  const profile = useUpdateProfile();

  useRxAsync(getProfile, {
    onSuccess: updateProfile,
    onFailure: getProfileFailure
  });

  return (
    <SettingsSection title="Profile" className={classes['profile']}>
      <Form
        form={form}
        key={JSON.stringify(user)}
        initialValues={user ? user : undefined}
        onFinish={payload =>
          user && profile.update({ id: user.user_id, ...payload })
        }
      >
        <Nickname />
        <Email />

        {user?.role === UserRole.Author && (
          <>
            <FormItem label="Description" name="description">
              <ContentEditor className={classes['description']} />
            </FormItem>
          </>
        )}

        <div className={classes['footer']}>
          <Button onClick={() => form.resetFields()} disabled={profile.loading}>
            Reset
          </Button>
          <Button type="submit" intent="primary" loading={profile.loading}>
            Apply
          </Button>
        </div>
      </Form>
    </SettingsSection>
  );
}
