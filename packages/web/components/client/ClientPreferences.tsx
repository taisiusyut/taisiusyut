import React, { ChangeEvent, useEffect, useState } from 'react';
import { fromEvent } from 'rxjs';
import {
  Button,
  HTMLSelect,
  IButtonProps,
  ISwitchProps,
  Switch as BP3Swtich
} from '@blueprintjs/core';
import {
  ListViewOverlay,
  ListViewOverlayProps,
  ListItem,
  ListSpacer,
  ListViewFooter
} from '@/components/ListViewOverlay';
import { ButtonPopover } from '@/components/ButtonPopover';
import { NumericInput } from '@/components/Input';
import {
  defaultPreferences,
  Preferences,
  PreferencesActions,
  useClientPreferences
} from '@/hooks/useClientPreferences';
import { createForm, FormItemProps, ControlProps } from '@/utils/form';
import { createOpenOverlay } from '@/utils/openOverlay';

interface ClientPreferencesDialogProps extends ListViewOverlayProps {
  preferences: Preferences;
  onUpdate: PreferencesActions['update'];
}

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

const getScreenWidth =
  typeof window !== 'undefined' ? window.screen.width : 1440;

export const openClientPreferences = createOpenOverlay(ClientPreferencesDialog);

export const ClientPreferencesDialogIcon = 'settings';
export const ClientPreferencesDialogTitle = '設定';

export function ClientPreferencesDialog({
  preferences,
  onUpdate,
  ...props
}: ClientPreferencesDialogProps) {
  const [form] = useForm();
  const [screenWidth, setScreenWidth] = useState(getScreenWidth);

  useEffect(() => {
    const subscription = fromEvent(window, 'orientationchange').subscribe(() =>
      setScreenWidth(getScreenWidth)
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Form
      form={form}
      initialValues={preferences}
      onValuesChange={onUpdate}
      hidden
    >
      <ListViewOverlay
        {...props}
        icon={ClientPreferencesDialogIcon}
        title={ClientPreferencesDialogTitle}
      >
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

        {screenWidth > 640 && (
          <ListItem rightElement={<Switch name="pagingDisplay" />}>
            分頁顯示
          </ListItem>
        )}

        {screenWidth > 1280 && (
          <ListItem rightElement={<Switch name="fixWidth" />}>
            固定頁面寬度
          </ListItem>
        )}

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
          自動載入下一章
        </ListItem>

        <ListViewFooter onClose={props.onClose}>
          <Button
            fill
            text="恢復預設"
            intent="danger"
            onClick={() => {
              form.setFieldsValue(defaultPreferences);
              onUpdate(defaultPreferences);
            }}
          />
        </ListViewFooter>
      </ListViewOverlay>
    </Form>
  );
}

export function ClientPreferences(props: IButtonProps) {
  const [preferences, { update }] = useClientPreferences();
  return (
    <ButtonPopover
      {...props}
      minimal
      icon={ClientPreferencesDialogIcon}
      content={ClientPreferencesDialogTitle}
      onClick={() => openClientPreferences({ preferences, onUpdate: update })}
    />
  );
}
