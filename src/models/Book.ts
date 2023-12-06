import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/config/sequelize';

class Book extends Model {
  public id!: number;
  public title!: string;
  public content!: string[];
  public lastReadPage!: number;
  public author!: string;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    content: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
    },
    lastReadPage: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    author: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: 'books',
    sequelize,
  },
);

export default Book;
