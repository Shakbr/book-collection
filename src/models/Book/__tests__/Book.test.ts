import sequelize from '../../../database/config/sequelize';
import { Book } from '..';
import { bookData, userData } from '../../../testUtils/testData';
import { User } from '../../User';

describe('Book Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await User.create(userData);
  });
  const model = Book;
  const bookDataWithUserId = { ...bookData, userId: 1 };
  const validationTestCases = [
    {
      description: 'should throw an error if title is too long',
      body: { ...bookDataWithUserId, title: 'a'.repeat(129) },
      errorMessage: 'Title must be between 1 and 128 characters long',
    },
    {
      description: 'should throw an error if content is not an array',
      body: { ...bookDataWithUserId, content: '' },
      errorMessage: 'Content must be an array',
    },
    {
      description: 'should throw an error if content is empty',
      body: { ...bookDataWithUserId, content: [] },
      errorMessage: 'Content must have at least 1 page',
    },
    {
      description: 'should throw an error if a page is empty',
      body: { ...bookDataWithUserId, content: ['Page1', '', 'page3'] },
      errorMessage: 'Page 2 must not be empty',
    },
    {
      description: 'should throw an error if author is too long',
      body: { ...bookDataWithUserId, author: 'a'.repeat(129) },
      errorMessage: 'Author must be between 1 and 128 characters long',
    },
    {
      description: 'should throw an error if userId is less than 1',
      body: { ...bookData, userId: 0 },
      errorMessage: 'User ID must be at least 1',
    },
    {
      description: 'should throw an error if userId is not an integer',
      body: {
        ...bookData,
        userId: '1.5',
      },
      errorMessage: 'User ID must be an integer',
    },
  ];

  const notNullTestCases = [
    {
      description: 'should throw an error if title is not provided',
      body: { ...bookDataWithUserId, title: null },
      errorMessage: 'Book.title cannot be null',
    },
    {
      description: 'should throw an error if author is not provided',
      body: { ...bookDataWithUserId, author: null },
      errorMessage: 'Book.author cannot be null',
    },
    {
      description: 'should throw an error if userId is not provided',
      body: { ...bookData, userId: undefined },
      errorMessage: 'Book.userId cannot be null',
    },
  ];

  describe('validations', () => {
    describe('on notNull', () => {
      notNullTestCases.forEach(({ description, body, errorMessage }) => {
        it(description, async () => {
          const book = model.build(body);
          await expect(book.validate()).rejects.toThrow(`notNull Violation: ${errorMessage}`);
        });
      });
    });

    describe('for model creation', () => {
      validationTestCases.forEach(({ description, body, errorMessage }) => {
        it(description, async () => {
          const book = model.build(body);
          await expect(book.validate()).rejects.toThrow(`Validation error: ${errorMessage}`);
        });
      });
    });
  });

  describe('hooks', () => {
    const contentLength = 5;
    const updateValidationTestCases = [
      {
        lastReadPage: 0,
        errorMessage: 'Last read page must be at least 1',
      },
      {
        lastReadPage: contentLength + 1,
        errorMessage: `Last read page must be at most ${contentLength}`,
      },
    ];
    updateValidationTestCases.forEach(({ lastReadPage, errorMessage }) => {
      it(`should throw an error if ${errorMessage}`, async () => {
        const book = await model.create({ ...bookDataWithUserId, content: Array(contentLength).fill('content') });
        book.lastReadPage = lastReadPage;
        const response = await book.save().catch((error) => error.errors.map((errorItem) => errorItem.message));

        expect(response[0]).toBe(errorMessage);
      });
    });
  });

  describe('associations', () => {
    it('should belong to a user', async () => {
      const book = await model.create(bookDataWithUserId);
      const user = await User.findByPk(book.userId);
      expect(user).toBeDefined();
      expect(user!.id).toBe(book.userId);
    });
  });
});
