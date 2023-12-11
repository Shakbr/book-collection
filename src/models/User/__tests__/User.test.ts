import { Password, User } from '..';
import bcrypt from 'bcrypt';
import { userData } from '../../../controllers/userController/__tests__/userController.test';
import sequelize from '../../../database/config/sequelize';

describe('User Model', () => {
  const model = User;

  describe('comparePassword', () => {
    it('returns true if the password matches', async () => {
      const password = userData.password;
      const user = new User();
      user.password = await bcrypt.hash(password, 10);

      const isMatch = await user.comparePassword(password);

      expect(isMatch).toBe(true);
    });

    it('returns false if the password does not match', async () => {
      const password = userData.password;
      const user = new User();
      user.password = await bcrypt.hash(password, 10);

      const isMatch = await user.comparePassword('wrongpassword');

      expect(isMatch).toBe(false);
    });
  });
  describe('validations', () => {
    it('requires a valid email', async () => {
      try {
        await model.create({ ...userData, email: 'not an email' });
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error.message).toEqual('Validation error: Validation isEmail on email failed');
      }
    });

    it('requires an email', async () => {
      try {
        await model.create({ ...userData, email: null });
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error.message).toEqual('notNull Violation: User.email cannot be null');
      }
    });

    it('requires a password', async () => {
      try {
        await model.create({ ...userData, password: null });
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error.message).toEqual('notNull Violation: User.password cannot be null');
      }
    });

    it('requires a password of the correct length', async () => {
      try {
        await model.create({ ...userData, password: 'short' });
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error.message).toEqual(
          `Validation error: Password must be between ${Password.MIN_LENGTH} and ${Password.MAX_LENGTH} characters long`,
        );
      }
    });

    it('requires a name', async () => {
      try {
        await model.create({ ...userData, name: null });
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error.message).toEqual('notNull Violation: User.name cannot be null');
      }
    });

    it('requires a name of the correct length', async () => {
      try {
        await model.create({ ...userData, name: '' });
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error.message).toEqual('Validation error: name must be between 1 and 128 characters long');
      }
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
      const user = model.build(userData);
      const createdUserData = await user.save();
      const password = createdUserData.getDataValue('password');
      const isMatch = await bcrypt.compare(userData.password, password);

      expect(isMatch).toBe(true);
    });

    it('hashes the password before updating a user', async () => {
      const user = model.build(userData);
      const createdUserData = await user.save();
      const newPassword = 'newPassword123';
      createdUserData.setDataValue('password', newPassword);
      const updatedUserData = await createdUserData.save();
      const updatedPassword = updatedUserData.getDataValue('password');

      const isMatch = await bcrypt.compare(newPassword, updatedPassword);

      expect(isMatch).toBe(true);
    });
  });
});
