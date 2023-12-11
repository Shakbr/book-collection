import { DataTypes, Model } from 'sequelize';
import sequelize from '@/database/config/sequelize';
import bcrypt from 'bcrypt';
import { UserDTO } from '@/types/types';

export enum Password {
  MIN_LENGTH = 8,
  MAX_LENGTH = 128,
}

export enum Role {
  ADMIN = 'admin',
  REGULAR = 'regular',
}

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  toDTO(): UserDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        len: {
          args: [1, 128],
          msg: 'name must be between 1 and 128 characters long',
        },
      },
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [Password.MIN_LENGTH, Password.MAX_LENGTH],
          msg: `Password must be between ${Password.MIN_LENGTH} and ${Password.MAX_LENGTH} characters long`,
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Role.REGULAR,
      validate: {
        isIn: {
          args: [[Role.ADMIN, Role.REGULAR]],
          msg: `Role must be either ${Role.ADMIN} or ${Role.REGULAR}`,
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user: User) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  },
);
