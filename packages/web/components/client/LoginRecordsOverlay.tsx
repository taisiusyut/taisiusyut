import React, { CSSProperties } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import {
  ListViewOverlay,
  ListViewDialogProps,
  ListViewFooter,
  ListItem,
  ListSpacer
} from '@/components/ListViewOverlay';
import { getLoginRecords, logoutOthers } from '@/service';
import { Toaster } from '@/utils/toaster';
import { createOpenOverlay } from '@/utils/openOverlay';
import { Schema$LoginRecord } from '@/typings';
import platform from 'platform';
import dayjs from 'dayjs';

interface Props extends ListViewDialogProps {}

interface Record extends Partial<Schema$LoginRecord> {
  id: string;
  platform?: typeof platform;
}

const icon = 'application';
const title = '已登入裝置';

const mutedTextStyle: CSSProperties = {
  color: `var(--text-light-color)`,
  marginTop: 5,
  fontSize: '0.9em'
};

const onFailure = Toaster.failure.bind(`Get login records failure`);
const request = async () => {
  const records = await getLoginRecords();
  return records.reduce((result, record) => {
    const item = { ...record, platform: platform.parse(record.userAgent) };
    return item.current ? [item, ...result] : [...result, item];
  }, [] as Record[]);
};

const logoutOthersFailure = Toaster.apiError.bind(
  Toaster,
  `Logout others device failure`
);
function LogoutOther({ onClose }: Pick<ListViewDialogProps, 'onClose'>) {
  const [{ loading }, { fetch }] = useRxAsync(logoutOthers, {
    defer: true,
    onSuccess: onClose,
    onFailure: logoutOthersFailure
  });
  return (
    <Button intent="danger" fill loading={loading} onClick={fetch}>
      登出其他裝置
    </Button>
  );
}

export const openLoginRecordsOverlay = createOpenOverlay(LoginRecordsOverlay);

export function LoginRecordsOverlay(props: Props) {
  const [
    { loading, data: records = [{ id: '1' }, { id: '2' }, { id: '3' }] }
  ] = useRxAsync(request, {
    defer: !props.isOpen,
    onFailure
  });

  return (
    <ListViewOverlay {...props} icon={icon} title={title}>
      {records.map((record, idx) => (
        <React.Fragment key={record.id}>
          {idx === 0 && <ListSpacer>當前裝置</ListSpacer>}
          {idx === 1 && <ListSpacer>其他裝置</ListSpacer>}
          <ListItem>
            <div>
              {record.platform
                ? record.platform.description || '未知裝置'
                : 'Loading...'}
            </div>
            <div style={mutedTextStyle}>
              最後登入於：
              {record.updatedAt
                ? dayjs(record.updatedAt).format(`YYYY-MM-DD HH:mm:ss`)
                : `N/A`}
            </div>
          </ListItem>
        </React.Fragment>
      ))}

      <ListViewFooter onClose={props.onClose}>
        {!loading && records.length > 1 && (
          <LogoutOther onClose={props.onClose} />
        )}
      </ListViewFooter>
    </ListViewOverlay>
  );
}
