import React from 'react';
import {
  DateRangeInput as BP3DateRangeInput,
  IDateRangeInputProps
} from '@blueprintjs/datetime';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import dayjs from 'dayjs';

export interface DateRangeInputProps extends Partial<IDateRangeInputProps> {}

const defaultProps: DateRangeInputProps = {
  formatDate: date => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
  parseDate: str => new Date(str),
  shortcuts: false,
  allowSingleDayRange: true,
  reverseMonthAndYearMenus: true
};

export function DateRangeInput({ onChange, ...props }: DateRangeInputProps) {
  return (
    <BP3DateRangeInput
      {...defaultProps}
      {...props}
      onChange={range =>
        onChange &&
        onChange([range[0], range[1] && dayjs(range[1]).endOf('day').toDate()])
      }
    />
  );
}
