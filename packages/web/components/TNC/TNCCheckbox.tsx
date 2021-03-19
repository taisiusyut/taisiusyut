import { MouseEvent, ChangeEvent } from 'react';
import { ControlProps } from '@/utils/form';
import { Checkbox } from '@blueprintjs/core';
import { openMixedConfirmOverlay } from '@/components/MixedOverlay';
import TNC from '@/tnc.md';
import classes from './TNC.module.scss';

interface TNCCheckboxProps extends ControlProps<boolean> {}

export function TNCCheckbox({ value, onChange }: TNCCheckboxProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange && onChange(event.target.checked);
  }

  function handleClick(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    openMixedConfirmOverlay({
      title: '使用條款及私隱政策',
      icon: 'info-sign',
      confirmText: '同意',
      className: classes['overlay'],
      children: <TNC />,
      onConfirm: async () => {
        onChange && onChange(true);
      }
    });
  }

  return (
    <Checkbox
      checked={typeof value === 'undefined' ? false : value}
      onChange={handleChange}
    >
      我同意
      <a
        className={classes['link']}
        href="/tnc"
        target="blank"
        onClick={handleClick}
      >
        使用條款及私隱政策
      </a>
    </Checkbox>
  );
}
