import React, { useRef } from 'react';
import {
  Dialog,
  Classes,
  InputGroup,
  IDialogProps,
  ButtonGroup,
  Button,
  IButtonProps
} from '@blueprintjs/core';
import { CopyButton } from '@/components/CopyButton';
import { WhatsApp } from '@/components/WhatsApp';
import { Telegram } from '@/components/Telegram';
import { createOpenOverlay } from '@/utils/openOverlay';

interface ShareDialogProps extends IDialogProps {
  url: string;
  text: string;
  onShare?: (type: string) => void;
}

const buttonStyle = { fontSize: 18 };

function ShareDialog({ url, text, onShare, ...props }: ShareDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const buttons: (IButtonProps & { url: string; shareType: string })[] = [
    {
      shareType: 'whatsapp',
      icon: <WhatsApp />,
      url: `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`
    },
    {
      shareType: 'telegram',
      icon: <Telegram />,
      url: `https://t.me/share/url?url=${url}&text=${text}`
    }
  ];

  const handleShare = onShare || (() => void 0);

  return (
    <Dialog {...props} title="分享" icon="share" style={{ paddingBottom: 0 }}>
      <div className={Classes.DIALOG_BODY}>
        <InputGroup
          value={url}
          onChange={() => void 0}
          inputRef={inputRef}
          rightElement={
            <CopyButton
              onClick={() => {
                handleShare('copy');

                inputRef.current?.select();
                inputRef.current?.setSelectionRange(0, 99999);
                document.execCommand('copy');
                inputRef.current?.blur();
              }}
            />
          }
        />

        <div style={{ margin: '20px 0px' }} />

        <ButtonGroup fill>
          {buttons.map(({ url, shareType, ...props }) => (
            <Button
              {...props}
              key={url}
              style={buttonStyle}
              onClick={() => {
                handleShare(shareType);
                window.open(url, '_blank');
              }}
            />
          ))}
        </ButtonGroup>
      </div>
    </Dialog>
  );
}

export const openShareDialog = createOpenOverlay(ShareDialog);
