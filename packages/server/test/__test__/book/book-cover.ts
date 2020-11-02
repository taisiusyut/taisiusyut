import superagent from 'superagent';
import { HttpStatus } from '@nestjs/common';
import { Schema$Book } from '@/typings';
import { createBook, deleteBook, updateBook } from '../../service/book';
import {
  cloudinarySign,
  cloudinaryUpload,
  defaultImageFile
} from '../../service/cloudinary';
import { setupUsers } from '../../service/auth';

export function testBookCover() {
  beforeAll(async () => {
    await setupUsers();
  });

  test.skip(
    'cloudinary image should be removed',
    async () => {
      const signPayload = await cloudinarySign(author.token);

      let response = await createBook(author.token);
      let book: Schema$Book = response.body;

      const uploadCover = async () => {
        const response = await cloudinaryUpload({
          ...signPayload,
          file: defaultImageFile
        });
        return updateBook(author.token, book.id, {
          cover: response.secure_url
        });
      };

      // test case
      const actions = [
        // replace
        () => uploadCover(),
        // remove
        () => updateBook(admin.token, book.id, { cover: null }),
        // delete
        () => deleteBook(admin.token, book.id)
      ];

      for (const action of actions) {
        response = await uploadCover();

        book = response.body;
        expect(book.cover).toMatch(/cloudinary/);

        response = await action();

        response = await superagent
          .get(book.cover as string)
          .catch(response => response);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
      }
    },
    60 * 1000
  );
}
