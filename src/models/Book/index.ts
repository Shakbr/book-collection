import { DataTypes, Model } from 'sequelize';
import sequelize from '@/database/config/sequelize';
import { User } from '../User';

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
            throw new Error('Content must be an array');
          }
          if (value.length < 1) {
            throw new Error('Content must have at least 1 page');
          }
          value.forEach((page, index) => {
            if (page.length < 1) {
              throw new Error(`Page ${index + 1} must not be empty`);
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
        min: {
          args: [0],
          msg: 'Last read page must be at least 1',
        },
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
  },
);

User.hasMany(Book, { foreignKey: 'userId' });
Book.belongsTo(User, { foreignKey: 'userId' });
