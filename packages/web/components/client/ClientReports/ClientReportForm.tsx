import { Input, TextArea } from '@/components/Input';
import { BugReportTypeSelect } from '@/components/Select/BugReportTypeSelect';
import { createForm, FormProps, validators } from '@/utils/form';
import { Param$CreateBugReport, Param$UpdateBugReport } from '@/typings';
import { Max_Bug_Report_Title, Max_Bug_Report_Description } from '@/constants';

type Schema = Param$CreateBugReport & Param$UpdateBugReport;

export type ClientReportFormProps = FormProps<Schema>;

const { Form, FormItem, useForm } = createForm<Schema>();

export { useForm };

export function ClientReportForm(props: ClientReportFormProps) {
  return (
    <Form {...props}>
      <FormItem name="id" noStyle>
        <input hidden />
      </FormItem>

      <FormItem
        name="type"
        label="類型"
        validators={[validators.required('請選擇類型')]}
      >
        <BugReportTypeSelect />
      </FormItem>

      <FormItem
        name="title"
        label="標題"
        validators={[
          validators.required('請輸入標題'),
          validators.maxLength(
            Max_Bug_Report_Title,
            `最多輸入${Max_Bug_Report_Title}字`
          )
        ]}
      >
        <Input />
      </FormItem>

      <FormItem
        name="description"
        label="問題描述/建議"
        validators={[
          validators.required('請輸入問題描述/建議'),
          validators.maxLength(
            Max_Bug_Report_Description,
            `最多輸入${Max_Bug_Report_Description}字`
          )
        ]}
      >
        <TextArea rows={4} />
      </FormItem>
    </Form>
  );
}
