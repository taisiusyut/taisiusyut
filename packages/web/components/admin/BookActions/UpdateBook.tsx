import { BookActionDialog, BookActionDialogProps } from './BookActionDialog';
import {
  useForm,
  Form,
  BookName,
  BookDescription,
  BookCategory,
  BookTags,
  BookCover
} from '@/components/admin/Books/BookForm';
import { updateBook } from '@/service';

export function UpdateBookDialog(props: BookActionDialogProps) {
  const [form] = useForm();
  return (
    <BookActionDialog
      {...props}
      request={({ id }) =>
        form.validateFields().then(changes => updateBook({ ...changes, id }))
      }
    >
      <Form form={form} style={{ width: 500 }} initialValues={props.book}>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1 1 auto' }}>
            <BookName />
            <BookCategory />
          </div>
          <div style={{ marginLeft: 15 }}>
            <BookCover />
          </div>
        </div>
        <BookDescription />
        <BookTags />
      </Form>
    </BookActionDialog>
  );
}
