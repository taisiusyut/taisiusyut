import React from 'react';
import { Input } from '@/components/Input';
import {
  DateRangeInput,
  DateRangeInputProps
} from '@/components/Input/DateRangeInput';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { createForm, DeepPartial, FormProps, validators } from '@/utils/form';
import { Param$CreateAnnouncement, AnnouncementType } from '@/typings';
import {
  Max_Announcement_Title,
  Max_Announcement_Description
} from '@/constants';
import dayjs from 'dayjs';
import classes from './Announcements.module.scss';

interface Store extends Param$CreateAnnouncement {
  period: [Date, Date];
}

interface Value extends Param$CreateAnnouncement {}

const { Form, FormItem, useForm } = createForm<Store, Value>();

export const useAnnouncementForm = useForm;

const dateRangeProps: DateRangeInputProps = {
  minDate: new Date(),
  popoverProps: { fill: true },
  endInputProps: { fill: true },
  startInputProps: { fill: true }
};

export function beforeSubmit({ period, ...store }: Store): Value {
  const [start, end] = period.map(d => d.getTime());
  return { ...store, start, end, type: AnnouncementType.Public };
}

export function transoformInitialValues(
  values: DeepPartial<Value>
): DeepPartial<Store> {
  return {
    ...values,
    period:
      values?.start && values?.end
        ? ([
            dayjs(values.start).startOf('day'),
            dayjs(values.end).endOf('day')
          ].map(d => d.toDate()) as Store['period'])
        : [new Date(), new Date()]
  };
}

export function AnnouncementForm(props: FormProps<Store, Value>) {
  return (
    <Form
      {...props}
      beforeSubmit={beforeSubmit}
      transoformInitialValues={transoformInitialValues}
    >
      <FormItem
        name="title"
        label="Title"
        validators={[
          validators.required('Please input title'),
          validators.maxLength(
            Max_Announcement_Title,
            `title should not longer then ${Max_Announcement_Title}`
          )
        ]}
      >
        <Input />
      </FormItem>

      <FormItem
        name="period"
        label="Period"
        validators={[validators.required('Please select period')]}
      >
        <DateRangeInput {...dateRangeProps} />
      </FormItem>

      <FormItem
        name="description"
        label="Description"
        validators={[
          validators.required('Please input description'),
          validators.maxLength(
            Max_Announcement_Description,
            `descriptions should not longer then ${Max_Announcement_Description}`
          )
        ]}
      >
        <ContentEditor className={classes['description']} />
      </FormItem>
    </Form>
  );
}
