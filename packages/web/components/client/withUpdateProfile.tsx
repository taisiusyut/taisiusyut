import React, { MouseEvent } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { openMixedConfirmOverlay } from '@/components/MixedOverlay';
import { createUserForm } from '@/components/UserForm';
import { Toaster } from '@/utils/toaster';
import { getProfile, updateProfile as updateProfileAPI } from '@/service';
import { Param$UpdateUser } from '@/typings';
import { AuthState, AuthActions } from '@/hooks/useAuth';

export interface OnClick {
  onClick?: (event: MouseEvent<any>) => void;
}

interface Props {
  auth: AuthState;
  actions: AuthActions;
}

const { Form, Nickname, Email, useForm } = createUserForm();

const title = '更改帳號資料';

const onFailure = Toaster.apiError.bind(Toaster, `Update profile failure`);

export function withUpdateProfile<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function WithUpdateProfile({ auth, actions, ...props }: P & Props) {
    const [form] = useForm();

    useRxAsync(getProfile, {
      defer: !!auth.user?.email,
      onSuccess: actions.updateProfile,
      onFailure
    });

    async function onConfirm() {
      if (!auth.user?.id) {
        throw new Error(`user id is not defined`);
      }
      const payload = await form.validateFields();
      const changes: Param$UpdateUser = { id: auth.user.id };
      for (const [_key, value] of Object.entries(payload)) {
        const key = _key as Exclude<keyof Param$UpdateUser, 'id'>;
        if (value !== auth.user[key]) {
          changes[key] = value;
        }
      }

      try {
        const response = await updateProfileAPI(changes);
        actions.updateProfile(response);
        Toaster.success({ message: `Update profile success` });
      } catch (error) {
        Toaster.apiError(`Update profile failure`, error);
        throw error;
      }
    }

    function handleClick() {
      form.setFieldsValue(auth.user ? auth.user : {});
      openMixedConfirmOverlay({
        title,
        onConfirm,
        icon: 'user',
        confirmText: '確認',
        cancelText: '取消',
        children: (
          <Form form={form}>
            <Nickname />
            <Email />
          </Form>
        )
      });
    }

    return (
      <Component {...((props as unknown) as P)} onClick={handleClick}>
        {title}
      </Component>
    );
  };
}
