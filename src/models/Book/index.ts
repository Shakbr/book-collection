import { DataTypes, Model, ValidationError, ValidationErrorItem } from 'sequelize';
import sequelize from '@/database/config/sequelize';
import { User } from '../User';
import { ApiError } from '@/errors/ApiError';

export class Book extends Model {
  public id!: number;
  public title!: string;
  public content!: string[];
  public lastReadPage!: number;
  public author!: string;
  public userId!: number;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title must not be empty',
        },
        len: {
          args: [1, 128],
          msg: 'Title must be between 1 and 128 characters long',
        },
      },
    },
    content: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      validate: {
        isContentValid(value: string[]) {
          if (!Array.isArray(value)) {
            throw ApiError.badRequest('Content must be an array');
          } else if (value.length < 1) {
            throw ApiError.badRequest('Content must have at least 1 page');
          }
          value.forEach((page, index) => {
            if (page.length < 1) {
              throw ApiError.badRequest(`Page ${index + 1} must not be empty`);
            }
          });
        },
      },
    },
    lastReadPage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'Last read page must be an integer',
        },
      },
    },
    author: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Author must not be empty',
        },
        len: {
          args: [1, 128],
          msg: 'Author must be between 1 and 128 characters long',
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      validate: {
        min: {
          args: [1],
          msg: 'User ID must be at least 1',
        },
        isInt: {
          msg: 'User ID must be an integer',
        },
      },
    },
  },
  {
    tableName: 'books',
    sequelize,
    hooks: {
      beforeUpdate: async (book) => {
        if (book.lastReadPage < 1) {
          throw new ValidationError('Validation error', [
            new ValidationErrorItem(
              'Last read page must be at least 1',
              'validation error',
              'lastReadPage',
              book.lastReadPage.toString(),
              book,
              'min',
              'beforeUpdate',
              [],
            ),
            ,
          ]);
        } else if (book.lastReadPage > book.content.length) {
          throw new ValidationError('Validation error', [
            new ValidationErrorItem(
              `Last read page must be at most ${book.content.length}`,
              'validation error',
              'lastReadPage',
              book.lastReadPage.toString(),
              book,
              'max',
              'beforeUpdate',
              [],
            ),
          ]);
        }
      },
    },
  },
);

User.hasMany(Book, { foreignKey: 'userId' });
Book.belongsTo(User, { foreignKey: 'userId' });
