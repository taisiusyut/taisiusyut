import React from 'react';
import { openMixedConfirmOverlay } from '@/components/MixedOverlay';
import { createBugReport, updateBugReport } from '@/service';
import { Schema$BugReport } from '@/typings';
import {
  useForm,
  ClientReportForm,
  ClientReportFormProps
} from './ClientReportForm';
import { ClientReportWarning } from './ClientReportWarning';
import { Toaster } from '@/utils/toaster';
import { useAuthState } from '@/hooks/useAuth';

interface Create {
  request: typeof createBugReport | typeof updateBugReport;
  onSuccess: (payload: Schema$BugReport) => void;
}

export interface UseBugReportActionProps {
  formProps?: ClientReportFormProps;
}

export const icon = 'annotation';
export const title = '問題/建議';

export function useClientReportAction({ request, onSuccess }: Create) {
  const [form] = useForm();
  const { user } = useAuthState();

  async function onConfirm() {
    const payload = await form.validateFields();
    try {
      const report = await request(payload);
      onSuccess(report);
    } catch (error) {
      Toaster.apiError(`發生錯誤`, error);
      throw error;
    }
  }

  const openReportModal = (formProps?: ClientReportFormProps) => {
    form.resetFields();
    openMixedConfirmOverlay({
      icon,
      title,
      onConfirm,
      style: { width: 400 },
      children: React.createElement(
        React.Fragment,
        {},
        React.createElement(ClientReportWarning),
        React.createElement(ClientReportForm, {
          ...formProps,
          role: user?.role,
          form
        })
      )
    });
  };

  return openReportModal;
}
