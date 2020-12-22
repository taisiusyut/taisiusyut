import { BookService } from '@/modules/book/book.service';
import {
  Schema$Authenticated,
  Schema$Book,
  UserRole,
  BookStatus
} from '@/typings';
import {
  createUserAndLogin,
  setupRoot,
  setupUsers,
  getUser
} from '../../service/auth';
import { createBook, getBooks, updateBook } from '../../service/book';

type BooksStats = Record<keyof typeof BookStatus, number>;

interface Author {
  auth: Schema$Authenticated;
  books: {
    stats: BooksStats;
    data: Schema$Book[];
    total: number;
  };
}

interface Mocks {
  total: number;
  stats: BooksStats;
  authors: Author[];
}

const bookStatus = Object.values(BookStatus).filter(
  (v): v is BookStatus => typeof v === 'number'
);
const bookStats = bookStatus.reduce(
  (payload, status) => ({ ...payload, [BookStatus[status]]: 0 }),
  {} as BooksStats
);

const sum = (numbers: number[]) => numbers.reduce((sum, v) => sum + v, 0);

function createBooks(payload: Partial<BooksStats>): Author['books'] {
  const stats = { ...bookStats, ...payload };
  return {
    stats,
    data: [],
    total: sum(Object.values(stats))
  };
}

async function setupBooks(token: string, status: BookStatus) {
  let response = await createBook(token);
  let book: Schema$Book = response.body;

  if (status !== BookStatus.Private) {
    response = await updateBook(root.token, book.id, { status });
    book = response.body;
  }
  return book;
}

const authors = [
  createBooks({ Public: 1, Pending: 2, Finished: 1 }),
  createBooks({ Public: 2, Pending: 2, Finished: 1 }),
  createBooks({ Public: 2, Pending: 1, Finished: 1 })
].map<Author>(books => ({ books, auth: {} as Schema$Authenticated }));

const mocks: Mocks = {
  authors,
  stats: authors
    .map(s => s.books.stats)
    .reduce((result, stats) => {
      Object.entries(stats).forEach(([key, value]) => {
        const k = key as keyof BooksStats;
        result[k] = result[k] + value;
      });
      return result;
    }, bookStats),
  total: sum(authors.map(s => s.books.total))
};

export function testGetBooks() {
  beforeAll(async () => {
    await app.get(BookService).clear();
    await setupRoot();
    await setupUsers();
    for (const author of mocks.authors) {
      const response = await createUserAndLogin(root.token, {
        role: UserRole.Author
      });
      author.auth = response.body;

      for (const key in author.books.stats) {
        const status = BookStatus[key as keyof BooksStats];
        const length = author.books.stats[key as keyof BooksStats];

        for (let i = 0; i < length; i++) {
          const book = await setupBooks(author.auth.token, status);
          author.books.data.push(book);
        }
      }
    }
  });

  test.each`
    user        | length
    ${'root'}   | ${mocks.total}
    ${'admin'}  | ${mocks.total}
    ${'author'} | ${mocks.stats.Public + mocks.stats.Finished}
    ${'client'} | ${mocks.stats.Public + mocks.stats.Finished}
  `(
    `global $user access books correctly`,
    async ({ user, length }: Record<string, any>) => {
      const response = await getBooks(getUser(user).token, { pageSize: 100 });
      expect(response.body.data).toHaveLength(length);
      expect(response.body.total).toBe(length);

      if (user === 'client') {
        expect(response.body.data).not.toContainObject({
          id: expect.anything(),
          email: expect.anything(),
          username: expect.anything(),
          password: expect.anything()
        });
      } else if (user === 'author') {
      } else {
        expect(response.body.data).toContainObject({
          author: expect.objectContaining({
            id: expect.any(String),
            username: expect.any(String),
            email: expect.any(String)
          })
        });
      }
    }
  );

  test.each(mocks.authors.map((author, index) => [index, author] as const))(
    `author-%s can access all public books and his/her books`,
    async (_index, { auth, books }) => {
      const response = await getBooks(auth.token, { pageSize: 100 });
      // prettier-ignore
      const length =
        (mocks.stats.Public + mocks.stats.Finished) -
        (books.stats.Public + books.stats.Finished) +
        books.total;
      expect(response.body.total).toBe(length);
      expect(response.body.data).toHaveLength(length);
      expect(response.body.data).toContainObject({
        status: expect.any(Number)
      });
    }
  );

  test.each(mocks.authors.map((author, index) => [index, author] as const))(
    `author-%s can access books by status`,
    async (_index, { auth, books }) => {
      for (const status of bookStatus) {
        const key = BookStatus[status] as keyof BooksStats;
        const response = await getBooks(auth.token, { pageSize: 100, status });
        const length = books.stats[key];
        expect(response.body.total).toBe(length);
        expect(response.body.data).toHaveLength(length);
        if (response.body.data.length) {
          expect(response.body.data).toContainObject({
            status: expect.any(Number)
          });
        }
      }
    }
  );
  test(`client access books by status`, async () => {
    for (const status of bookStatus) {
      const response = await getBooks(client.token, { pageSize: 100, status });

      if (status === BookStatus.Public || status === BookStatus.Finished) {
        const length = mocks.stats[BookStatus[status] as keyof BooksStats];
        expect(response.body.total).toBe(length);
        expect(response.body.data).toHaveLength(length);
      } else {
        const length = mocks.stats.Public + mocks.stats.Finished;
        expect(response.body.total).toBe(length);
        expect(response.body.data).toHaveLength(length);
      }
    }
  });

  test(`client access books by author nickname`, async () => {
    for (const author of authors) {
      const response = await getBooks(author.auth.token, {
        pageSize: 1000,
        authorName: author.auth.user.nickname
      });
      expect(response.body.data).toHaveLength(author.books.total);
    }
  });
}
