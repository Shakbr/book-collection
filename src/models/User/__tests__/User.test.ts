import bcrypt from 'bcrypt';
import sequelize from '../../../database/config/sequelize';
import { userData } from '../../../testUtils/testData';
import { Password, Role, User } from '..';
describe('User Model', () => {
  const model = User;

  describe('comparePassword', () => {
    it('returns true if the password matches', async () => {
      const password = userData.password;
      const user = model.build();
      user.password = await bcrypt.hash(password, 10);

      const isMatch = await user.comparePassword(password);

      expect(isMatch).toBe(true);
    });

    it('returns false if the password does not match', async () => {
      const password = userData.password;
      const user = model.build();
      user.password = await bcrypt.hash(password, 10);

      const isMatch = await user.comparePassword('wrongpassword');

      expect(isMatch).toBe(false);
    });
  });
  describe('validations', () => {
    const notNullTestCases = [
      {
        description: 'should throw an error if email is not provided',
        body: { ...userData, email: null },
        errorMessage: 'User.email cannot be null',
      },
      {
        description: 'should throw an error if password is not provided',
        body: { ...userData, password: null },
        errorMessage: 'User.password cannot be null',
      },
      {
        description: 'should throw an error if name is not provided',
        body: { ...userData, name: null },
        errorMessage: 'User.name cannot be null',
      },
      {
        description: 'should throw an error if role is not provided',
        body: { ...userData, role: null },
        errorMessage: 'User.role cannot be null',
      },
    ];
    const validationTestCases = [
      {
        description: 'should throw an error if email is not an email',
        body: { ...userData, email: 'not an email' },
        errorMessage: 'Validation isEmail on email failed',
      },
      {
        description: 'should throw an error if password is too short',
        body: { ...userData, password: 'short' },
        errorMessage: `Password must be between ${Password.MIN_LENGTH} and ${Password.MAX_LENGTH} characters long`,
      },
      {
        description: 'should throw an error if password is too long',
        body: { ...userData, password: 'a'.repeat(129) },
        errorMessage: `Password must be between ${Password.MIN_LENGTH} and ${Password.MAX_LENGTH} characters long`,
      },
      {
        description: 'should throw an error if name is too short',
        body: { ...userData, name: '' },
        errorMessage: 'name must be between 1 and 128 characters long',
      },
      {
        description: 'should throw an error if name is too long',
        body: { ...userData, name: 'a'.repeat(129) },
        errorMessage: 'name must be between 1 and 128 characters long',
      },
      {
        description: 'should throw an error if role is not a valid role',
        body: { ...userData, role: 'invalid role' },
        errorMessage: `Role must be either ${Role.ADMIN} or ${Role.REGULAR}`,
      },
    ];

    describe('on notNull', () => {
      notNullTestCases.forEach(({ description, body, errorMessage }) => {
        it(description, async () => {
          const user = model.build(body);
          await expect(user.validate()).rejects.toThrow(`notNull Violation: ${errorMessage}`);
        });
      });
    });

    describe('for model creation', () => {
      validationTestCases.forEach(({ description, body, errorMessage }) => {
        it(description, async () => {
          const user = model.build(body);
          await expect(user.validate()).rejects.toThrow(`Validation error: ${errorMessage}`);
        });
      });
    });
    describe('hooks', () => {
      beforeAll(async () => {
        await sequelize.sync({ force: true });
      });
      beforeEach(async () => {
        await User.destroy({ truncate: true });
      });
      it('hashes the password before creating a user', async () => {
        const createdUserData = await model.create(userData);
        const password = createdUserData.getDataValue('password');
        const isMatch = await bcrypt.compare(userData.password, password);

        expect(isMatch).toBe(true);
      });

      it('hashes the password before updating a user', async () => {
        const createdUserData = await model.create(userData);
        const newPassword = 'newPassword123';
        createdUserData.setDataValue('password', newPassword);
        const updatedUserData = await createdUserData.save();
        const updatedPassword = updatedUserData.getDataValue('password');

        const isMatch = await bcrypt.compare(newPassword, updatedPassword);

        expect(isMatch).toBe(true);
      });
    });
  });
});
