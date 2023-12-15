import { ApiError } from './../../../errors/ApiError';
import { HttpStatus } from '../../../utils/httpStatusCodesUtils';
import { Request, Response, NextFunction } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { UserController } from '..';
import { Role, User } from '../../../models/User';
import { authenticateUser } from '../../../services/authService';
import { userDTO, userData } from '../../../testUtils/testData';

jest.mock('../../../models/User');
jest.mock('../../../services/authService');

let req: MockProxy<Request> & Request;
let res: MockProxy<Response> & Response;
let next: jest.MockedFunction<NextFunction>;
let userController: UserController;
let nextError: Error | null;

const roleTestCases = [
  { role: Role.REGULAR, description: 'should set the role to regular if not defined' },
  { role: Role.ADMIN, description: 'should set the role to admin if defined' },
];

const validationTestCases = [
  { field: 'name', value: '', description: 'should fail if the name is empty' },
  { field: 'name', value: 'short', description: 'should fail if the name is too short' },
  {
    field: 'name',
    value: 'this name is way too long to be valid',
    description: 'should fail if the name is too long',
  },
  { field: 'email', value: 'not an email', description: 'should fail if the email is not valid' },
  { field: 'email', value: '', description: 'should fail if the email is empty' },
  { field: 'password', value: '', description: 'should fail if the password is empty' },
  { field: 'password', value: 'short', description: 'should fail if the password is too short' },
  {
    field: 'password',
    value: 'this password is way too long to be valid',
    description: 'should fail if the password is too long',
  },
  { field: 'role', value: 'not a role', description: 'should fail if the role is not valid' },
];

beforeEach(() => {
  req = mock<Request>();
  res = mock<Response>({
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  });
  next = jest.fn().mockImplementation((error) => {
    nextError = error;
  });
  userController = new UserController();
  nextError = null;
});

describe('UserController', () => {
  describe('register', () => {
    validationTestCases.forEach(({ field, value, description }) => {
      it(description, async () => {
        req.body = { ...userData, [field]: value };
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);
        (User.create as jest.Mock).mockImplementationOnce(() => {
          throw new Error(`Validation error: ${field} is not valid`);
        });

        await userController.register(req, res, next);

        expect(nextError).toBeInstanceOf(Error);
        expect(nextError!.message).toBe(`Validation error: ${field} is not valid`);
      });
    });
    it('should throw an error if the email is already in use', async () => {
      req.body = { email: userData.email };
      (User.findOne as jest.Mock).mockResolvedValueOnce(true);

      await userController.register(req, res, next);

      expect(nextError).toBeDefined();
      expect(nextError!.message).toEqual('Email already in use');
    });

    it('should create a new user if the email is not in use', async () => {
      req.body = userData;
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);
      (User.create as jest.Mock).mockResolvedValueOnce({
        id: 1,
        ...req.body,
        toDTO: () => userDTO,
      });

      await userController.register(req, res, next);

      expect(nextError).toBeNull();
      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(userDTO);
    });

    roleTestCases.forEach(({ role, description }) => {
      it(description, async () => {
        req.body = { email: userData.email, name: userData.name, password: userData.password, role };
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);
        (User.create as jest.Mock).mockResolvedValueOnce({
          id: 1,
          ...req.body,
          toDTO: () => ({ ...userDTO, role }),
        });

        await userController.register(req, res, next);

        expect(nextError).toBeNull();
        expect(User.create).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
        expect(res.json).toHaveBeenCalledWith({ ...userDTO, role });
      });
    });
  });

  describe('login', () => {
    it('should authenticate the user', async () => {
      req.body = { email: userData.email, password: userData.password };

      const token = 'testToken';

      (authenticateUser as jest.Mock).mockResolvedValueOnce({ user: userDTO, token });

      await userController.login(req, res, next);

      expect(authenticateUser).toHaveBeenCalledWith(userData.email, userData.password);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ user: userDTO, token });
    });

    it('should throw an error if authentication fails', async () => {
      req.body = { email: userData.email, password: userData.password };

      (authenticateUser as jest.Mock).mockImplementationOnce(() => {
        throw ApiError.unauthorized('Invalid email or password');
      });

      await userController.login(req, res, next);

      expect(authenticateUser).toHaveBeenCalledWith(userData.email, userData.password);
      expect(nextError).toBeInstanceOf(ApiError);
      expect(nextError?.message).toBe('Invalid email or password');
    });
  });
});
