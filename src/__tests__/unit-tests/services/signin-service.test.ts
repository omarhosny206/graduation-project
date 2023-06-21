import ISigninRequest from '../../../interfaces/users/signin-request-interface';
import ISigninResponse from '../../../interfaces/users/signin-response-interface';
import { signin } from '../../../services/signin-service';
import * as userService from '../../../services/user-service';
import * as bcrypt from 'bcrypt';
import * as jwt from '../../../utils/jwt';
import ApiError from '../../../utils/api-error';

// important
jest.mock('bcrypt');

let storedUser: any = {
  email: 'test@example.com',
  password: 'hashed-password',
  confirmed: true,
  active: true,
  save: jest.fn().mockResolvedValueOnce({
    email: 'test@example.com',
    password: 'hashed-password',
    confirmed: true,
    active: true,
  }),
};

beforeAll(async () => {});
afterAll(async () => {});

describe('signin-service', () => {
  describe('valid signin request', () => {
    it('should send signin response', async () => {
      const signinRequest: ISigninRequest = {
        email: 'test@example.com',
        password: '12345678',
      };

      const expectedResponse: ISigninResponse = {
        user: storedUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      // mocks
      jest.spyOn(userService, 'getByEmailOrDefault').mockResolvedValueOnce(storedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwt, 'generateAccessToken').mockResolvedValueOnce('access-token');
      jest.spyOn(jwt, 'generateRefreshToken').mockResolvedValueOnce('refresh-token');

      const signinResponse: ISigninResponse = await signin(signinRequest);
      expect(signinResponse.user).toEqual(expectedResponse.user);
    });
  });

  describe('valid credentials with no active account', () => {
    it('should send signin response and reactivate the user', async () => {
      const signinRequest: ISigninRequest = {
        email: 'test@example.com',
        password: '12345678',
      };

      const storedUser2 = { ...storedUser, active: false };
      // mocks
      jest.spyOn(userService, 'getByEmailOrDefault').mockResolvedValueOnce(storedUser2);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwt, 'generateAccessToken').mockResolvedValueOnce('access-token');
      jest.spyOn(jwt, 'generateRefreshToken').mockResolvedValueOnce('refresh-token');

      const signinResponse = await signin(signinRequest);
      expect(signinResponse.user.active).toEqual(true);
    });
  });

  describe('valid credentials with non confirmed email', () => {
    it(`should throw ApiError.unauthorized('Email confirmation is required')`, async () => {
      const signinRequest: ISigninRequest = {
        email: 'test@example.com',
        password: '12345678',
      };

      const storedUser2 = { ...storedUser, confirmed: false };
      // mocks
      jest.spyOn(userService, 'getByEmailOrDefault').mockResolvedValueOnce(storedUser2);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(signin(signinRequest)).rejects.toThrow(ApiError.unauthorized('Email confirmation is required'));
    });
  });

  describe('invalid credentials: wrong email', () => {
    it(`should throw ApiError.unauthorized('Bad Credentials: Invalid email')`, async () => {
      const signinRequest: ISigninRequest = {
        email: 'x@example.com',
        password: '12345678',
      };

      // mocks
      jest.spyOn(userService, 'getByEmailOrDefault').mockResolvedValueOnce(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(signin(signinRequest)).rejects.toThrow(ApiError.unauthorized('Bad Credentials: Invalid email'));
    });
  });

  describe('invalid credentials: wrong password', () => {
    it(`should throw ApiError.unauthorized('Bad Credentials: Invalid password')`, async () => {
      const signinRequest: ISigninRequest = {
        email: 'test@example.com',
        password: '12345678',
      };

      // mocks
      jest.spyOn(userService, 'getByEmailOrDefault').mockResolvedValueOnce(storedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(signin(signinRequest)).rejects.toThrow(ApiError.unauthorized('Bad Credentials: Invalid password'));
    });
  });
});
