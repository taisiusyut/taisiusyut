import React, { ChangeEvent } from 'react';
import {
  Button,
  HTMLSelect,
  IButtonProps,
  ISwitchProps,
  Switch as BP3Swtich
} from '@blueprintjs/core';
import {
  ListViewDialog,
  ListViewDialogProps,
  ListItem,
  ListSpacer,
  ListViewDialogFooter
} from '@/components/ListViewDialog';
import { ButtonPopover } from '@/components/ButtonPopover';
import { NumericInput } from '@/components/Input';
import { useBoolean } from '@/hooks/useBoolean';
import {
  defaultPreferences,
  Preferences,
  useClientPreferences
} from '@/hooks/useClientPreferences';
import { createForm, FormItemProps, ControlProps } from '@/utils/form';

const title = '設定';
const icon = 'settings';

const { Form, FormItem, useForm } = createForm<Preferences>({ noStyle: true });

const switchProps: ISwitchProps = { large: true, alignIndicator: 'right' };

function Switch(props: FormItemProps<Preferences> & { deps?: undefined }) {
  return (
    <FormItem {...props} valuePropName="checked">
      <BP3Swtich {...switchProps} />
    </FormItem>
  );
}

function ThemeSelector({ value, onChange }: ControlProps<Theme>) {
  return (
    <BP3Swtich
      large
      alignIndicator="right"
      {...(typeof value === 'undefined' || !onChange
        ? {}
        : {
            checked: value === 'dark',
            onChange: (event: ChangeEvent<HTMLInputElement>) =>
              onChange(event.target.checked ? 'dark' : 'light')
          })}
    />
  );
}

export function ClientPreferencesDialog(props: ListViewDialogProps) {
  const [preferences, { update }] = useClientPreferences();
  const [form] = useForm();

  return (
    <Form
      form={form}
      initialValues={preferences}
      onValuesChange={update}
      hidden
    >
      <ListViewDialog {...props} icon={icon} title={title}>
        <ListSpacer>外觀</ListSpacer>

        <ListItem
          rightElement={
            <FormItem name="theme">
              <ThemeSelector />
            </FormItem>
          }
        >
          黑夜模式
        </ListItem>

        <ListItem rightElement={<Switch name="pagingDisplay" />}>
          分頁顯示
        </ListItem>

        <ListItem rightElement={<Switch name="fixWidth" />}>
          固定頁面寬度
        </ListItem>

        <ListSpacer>章節內容</ListSpacer>

        <ListItem
          rightElement={
            <div>
              <FormItem name="fontSize">
                <NumericInput fill minorStepSize={1} />
              </FormItem>
              <style jsx>
                {`
                  :global(.#{$ns}-input-group) {
                    width: 50px;
                    :global(input) {
                      text-align: center;
                    }
                  }
                `}
              </style>
            </div>
          }
        >
          字體大小
        </ListItem>

        <ListItem
          rightElement={
            <FormItem name="lineHeight">
              <HTMLSelect>
                <option value="1em">1</option>
                <option value="1.15em">1.15</option>
                <option value="1.5em">1.5</option>
                <option value="2em">2</option>
              </HTMLSelect>
            </FormItem>
          }
        >
          行距
        </ListItem>

        <ListItem rightElement={<Switch name="autoFetchNextChapter" />}>
          自動加載下一章
        </ListItem>

        <ListViewDialogFooter>
          <Button
            fill
            text="恢復預設"
            intent="danger"
            onClick={() => {
              form.setFieldsValue(defaultPreferences);
              update(defaultPreferences);
            }}
          />
        </ListViewDialogFooter>
      </ListViewDialog>
    </Form>
  );
}

export function ClientPreferences(props: IButtonProps) {
  const [isOpen, open, close] = useBoolean();
  return (
    <>
      <ButtonPopover
        {...props}
        minimal
        icon={icon}
        content={title}
        onClick={open}
      />
      <ClientPreferencesDialog isOpen={isOpen} onClose={close} />
    </>
  );
}
