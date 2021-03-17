import { Icon } from '@blueprintjs/core';

export function ClientReportWarning() {
  return (
    <div
      style={{
        width: 280,
        lineHeight: '1.5em',
        textAlign: 'center',
        margin: 'auto auto 50px auto'
      }}
    >
      <Icon icon="warning-sign" intent="warning" iconSize={40} />
      <div>
        請注意，提交的內容是公開的，帳號或者其他私隱問題請直接聯繫管理員
      </div>
    </div>
  );
}
